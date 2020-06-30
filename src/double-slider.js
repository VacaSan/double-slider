import { interpolate, clamp, quantize, getValueForKeyId } from "./utils";
import { createStore } from "./store";
import { addDragHandler } from "./gesture";
import contents from "./template-contents.html";

const doc = document;
const MAX = "max";
const MIN = "min";
const STEP = "step";
const VALUE_MAX = "valuemax";
const VALUE_MIN = "valuemin";
const DISABLED = "disabled";
const DEFAULT_MAX = 100;
const DEFAULT_MIN = 0;
const DEFAULT_STEP = 0; // continuous
const EVT_CHANGE = "slider:change";
const EVT_INPUT = "slider:input";

const template = doc.createElement("template");

// TODO inline contents
template.innerHTML = contents;

function validate({ max, min, step }) {
  if (max <= min) throw new RangeError("min must be lower than max");
  if (step < 0) throw new RangeError("step must be greater than or equal zero");
}

export class DoubleSlider extends HTMLElement {
  get min() {
    return this.store.getState().min;
  }
  set min(value) {
    let { max, valuemax, valuemin } = this.store.getState();
    valuemin = clamp(valuemin, value, valuemax);
    valuemax = clamp(valuemax, valuemin, max);
    this.store.setState({ min: value, valuemax, valuemin });
  }

  get max() {
    return this.store.getState().max;
  }
  set max(value) {
    let { min, valuemax, valuemin } = this.store.getState();
    valuemax = clamp(valuemax, valuemin, value);
    valuemin = clamp(valuemin, min, valuemax);
    this.store.setState({ max: value, valuemax, valuemin });
  }

  get step() {
    return this.store.getState().step;
  }
  set step(value) {
    this.store.setState({ step: value });
  }

  get valuemax() {
    return this.store.getState().valuemax;
  }
  set valuemax(value) {
    this.store.setState(({ max, valuemin }) => ({
      valuemax: clamp(value, valuemin, max),
    }));
  }

  get valuemin() {
    return this.store.getState().valuemin;
  }
  set valuemin(value) {
    this.store.setState(({ min, valuemax }) => ({
      valuemin: clamp(value, min, valuemax),
    }));
  }

  get disabled() {
    return this.hasAttribute(DISABLED);
  }
  set disabled(value) {
    if (value) {
      this.setAttribute(DISABLED, "");
    } else {
      this.removeAttribute(DISABLED);
    }
  }

  static get observedAttributes() {
    return [MIN, MAX, STEP, VALUE_MAX, VALUE_MIN, DISABLED];
  }

  constructor() {
    super();

    // initialize state
    const max = Number(this.getAttribute(MAX) || DEFAULT_MAX);
    const min = Number(this.getAttribute(MIN) || DEFAULT_MIN);
    const step = Number(this.getAttribute(STEP) || DEFAULT_STEP);

    let valuemax = Number(this.getAttribute(VALUE_MAX) || max);
    let valuemin = Number(this.getAttribute(VALUE_MIN) || min);
    valuemax = clamp(valuemax, valuemin, max);
    valuemin = clamp(valuemin, min, valuemax);

    validate({ max, min, step });

    this.store = createStore({
      max,
      min,
      step,
      valuemax,
      valuemin,
    });

    // attach shadow dom
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    // cache dom
    this.$min = shadowRoot.querySelector("#thumb-min");
    this.$max = shadowRoot.querySelector("#thumb-max");
    this.$track = shadowRoot.querySelector("#track");

    // bind methods
    this.render = this.render.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === DISABLED) {
      this.$max.disabled = this.disabled;
      this.$min.disabled = this.disabled;
    } else {
      // kebab to camel case?
      this.store.setState({ [name]: Number(newValue) });
    }
  }

  connectedCallback() {
    // TODO check if this.isConnected
    [MAX, MIN, STEP, VALUE_MAX, VALUE_MIN, DISABLED].forEach(prop =>
      this.upgradeProperty(prop)
    );

    this.gBCR = this.getBoundingClientRect();

    // subscribe to state changes
    this.unsubscribe = this.store.connect(this.render);

    // add event handlers
    this.$max.addEventListener("keydown", this.onKeyDown);
    this.$min.addEventListener("keydown", this.onKeyDown);

    addDragHandler(this.$max, this.onDrag);
    addDragHandler(this.$min, this.onDrag);

    window.addEventListener("resize", this.onResize);
  }

  disconnectedCallback() {
    // cleanup
    this.unsubscribe();
    // As part of the component lifecycle, the browser manages and
    // cleans up listeners, so you don’t have to worry about it.
    // However, if you add a listener to the global window object,
    // you’re responsible for removing the listener
    window.removeEventListener("resize", this.onResize);
  }

  // public methods
  layout() {
    this.gBCR = this.getBoundingClientRect();
    this.store.forceUpdate();
  }

  // event handlers
  onResize() {
    this.layout();
  }

  onDrag({ target, last, initial, movement }) {
    const name = target.dataset.name;

    const state = this.store.getState();
    const { max, min, step } = state;
    const { width, left } = this.gBCR;

    const inputRange = [left, left + width];
    const outputRange = [min, max];
    const current = initial + movement;

    const upperBound = state[name === VALUE_MAX ? MAX : VALUE_MAX];
    const lowerBound = state[name === VALUE_MAX ? VALUE_MIN : MIN];

    let value = interpolate(current, inputRange, outputRange);
    value = quantize(value, step);
    value = clamp(value, lowerBound, upperBound);

    this.store.setState({ [name]: value }, () => {
      this.dispatch(EVT_INPUT);
    });

    if (last) this.dispatch(EVT_CHANGE);
  }

  onKeyDown(evt) {
    const name = evt.target.dataset.name;
    const keyId = evt.key;

    const state = this.store.getState();

    const nextValue = getValueForKeyId({
      keyId,
      value: state[name],
      step: state[STEP],
      max: state[MAX],
      min: state[MIN],
    });

    if (Number.isNaN(nextValue)) return;

    const upperBound = state[name === VALUE_MAX ? MAX : VALUE_MAX];
    const lowerBound = state[name === VALUE_MAX ? VALUE_MIN : MIN];

    this.store.setState(
      { [name]: clamp(nextValue, lowerBound, upperBound) },
      () => {
        this.dispatch(EVT_INPUT);
        this.dispatch(EVT_CHANGE);
      }
    );
  }

  render(state) {
    const { width } = this.gBCR;
    const { max, min, valuemax, valuemin } = state;

    const inputRange = [min, max];
    const outputRange = [0, width]; // in px

    const maxX = interpolate(valuemax, inputRange, outputRange);
    this.$max.style.transform = `translateX(${maxX}px) translate(-50%, -50%)`;

    const minX = interpolate(valuemin, inputRange, outputRange);
    this.$min.style.transform = `translateX(${minX}px) translate(-50%, -50%)`;

    const sX = interpolate(maxX - minX, [0, width], [0, 1]);
    this.$track.style.transform = `translateX(${minX}px) scaleX(${sX})`;

    // TODO update aria-valuetext and aria-labeledby
    // see https://www.w3.org/TR/wai-aria-practices/#slidertwothumb
    this.$max.setAttribute("aria-valuemin", valuemin);
    this.$max.setAttribute("aria-valuenow", valuemax);
    this.$max.setAttribute("aria-valuemax", max);

    this.$min.setAttribute("aria-valuemin", min);
    this.$min.setAttribute("aria-valuenow", valuemin);
    this.$min.setAttribute("aria-valuemax", valuemax);
  }

  // utils
  upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  dispatch(type) {
    // TODO track last emitted value for each event? And if that changed
    // fire event?
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, detail: this }));
  }
}

window.customElements.define("double-slider", DoubleSlider);
