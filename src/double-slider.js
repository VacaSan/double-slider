import { interpolate, clamp, quantize } from "./utils";
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
const PAGE_FACTOR = 4;
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
    this.store.setState(state => {
      const valuemin = Math.max(state.valuemin, value);

      let valuemax = quantize(state.valuemax, state.step);
      valuemax = clamp(valuemax, valuemin, state.max);

      return { min: value, valuemax, valuemin };
    });
  }

  get max() {
    return this.store.getState().max;
  }
  set max(value) {
    this.store.setState(state => {
      const valuemax = Math.min(state.valuemax, value);

      let valuemin = quantize(state.valuemin, state.step);
      valuemin = clamp(valuemin, state.min, valuemax);

      return { max: value, valuemax, valuemin };
    });
  }

  get step() {
    return this.store.getState().step;
  }
  set step(value) {
    this.store.setState(({ valuemax, valuemin }) => ({
      step: value,
      // do we need to clamp the new values?
      valuemax: quantize(valuemax, value),
      valuemin: quantize(valuemin, value),
    }));
  }

  get valuemax() {
    return this.store.getState().valuemax;
  }
  set valuemax(value) {
    this.store.setState(({ max, step, valuemin }) => ({
      valuemax: clamp(quantize(value, step), valuemin, max),
    }));
  }

  get valuemin() {
    return this.store.getState().valuemin;
  }
  set valuemin(value) {
    this.store.setState(({ min, step, valuemax }) => ({
      valuemin: clamp(quantize(value, step), min, valuemax),
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
    valuemax = clamp(valuemax, min, max);
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
      this[name] = Number(newValue);
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
    // this is the same as this[name] = value;
    // but how do I dispatch events then 😕
    value = quantize(value, step);
    value = clamp(value, lowerBound, upperBound);

    this.store.setState({ [name]: value }, () => {
      // yeah, I don't really like this implementation...
      this.dispatch(EVT_INPUT);
    });

    if (last) this.dispatch(EVT_CHANGE);
  }

  onKeyDown(evt) {
    const name = evt.target.dataset.name;
    const keyId = evt.key;

    const state = this.store.getState();

    const nextValue = this.getValueForKeyId({
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

  getValueForKeyId({ keyId, value, min, max, step }) {
    const delta = step || (max - min) / 100;

    switch (keyId) {
      case "ArrowLeft":
      case "ArrowDown":
        return value - delta;
      case "ArrowRight":
      case "ArrowUp":
        return value + delta;
      case "PageUp":
        return value + delta * PAGE_FACTOR;
      case "PageDown":
        return value - delta * PAGE_FACTOR;
      case "Home":
        return min;
      case "End":
        return max;
      default:
        return NaN;
    }
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
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, detail: this }));
  }
}

window.customElements.define("double-slider", DoubleSlider);
