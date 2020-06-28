import { interpolate, clamp, quantize, getValueForKeyId } from "./utils";
import contents from "./template-contents.html";

const doc = document;
const MAX = "max";
const MIN = "min";
const STEP = "step";
const VALUE_MAX = "valuemax";
const VALUE_MIN = "valuemin";
const DEFAULT_MAX = 100;
const DEFAULT_MIN = 0;
const DEFAULT_STEP = 0; // continuous
const EVT_CHANGE = "slider:change";
const EVT_INPUT = "slider:input";

const template = doc.createElement("template");

// TODO inline contents
template.innerHTML = contents;

function createStore(initialState = {}) {
  let state = initialState;
  let listeners = [];

  function setState(partial, callback) {
    const update = typeof partial === "function" ? partial(state) : partial;

    const shouldUpdate = Object.keys(update).reduce((acc, key) => {
      return acc || update[key] !== state[key];
    }, false);

    if (!shouldUpdate) return;

    const prevState = Object.assign({}, state);
    state = Object.assign({}, state, update);

    listeners.forEach(fn => fn && fn(state));

    callback && callback(state, prevState);
  }

  function getState() {
    return state;
  }

  function forceUpdate() {
    listeners.forEach(fn => fn && fn(state));
  }

  function connect(fn) {
    listeners.push(fn);

    fn(state);

    return () => {
      const index = listeners.indexOf(fn);
      listeners.splice(index, 1);
    };
  }

  return Object.freeze({
    setState,
    getState,
    forceUpdate,
    connect,
  });
}

function validate({ max, min, step }) {
  if (max <= min) throw new RangeError("min must be lower than max");
  if (step < 0) throw new RangeError("step must be greater than zero");
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

  static get observedAttributes() {
    // TODO do we need to track "disabled" attribute? I think we should...
    return [MIN, MAX, STEP, VALUE_MAX, VALUE_MIN];
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
    // kebab to camel case?
    this.store.setState({ [name]: Number(newValue) });
  }

  connectedCallback() {
    [MAX, MIN, STEP, VALUE_MAX, VALUE_MIN].forEach(prop =>
      this.upgradeProperty(prop)
    );

    this.gBCR = this.getBoundingClientRect();

    // subscribe to state changes
    this.unsubscribe = this.store.connect(this.render);

    // add event handlers
    this.$max.addEventListener("keydown", this.onKeyDown);
    this.$min.addEventListener("keydown", this.onKeyDown);

    this.unbindMax = bindDragHandler(this.$max, this.onDrag);
    this.unbindMin = bindDragHandler(this.$min, this.onDrag);

    window.addEventListener("resize", this.onResize);
  }

  disconnectedCallback() {
    // cleanup
    this.unsubscribe();
    this.unbindMin();
    this.unbindMax();
    this.$max.removeEventListener("keydown", this.onKeyDown);
    this.$min.removeEventListener("keydown", this.onKeyDown);
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

    // TODO if is disabled, apply disabled attribute to buttons
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

const LMB = 0;
// TODO give better name...
function bindDragHandler(el, handler) {
  let rAF = -1;
  // state
  let active = false;
  let last = false;
  let x = 0;
  let initial = 0;
  let target = null;

  el.addEventListener("mousedown", onDragStart);
  el.addEventListener("touchstart", onDragStart, { passive: false });

  function update() {
    handler &&
      handler({
        x,
        movement: x - initial,
        initial,
        active,
        last,
        target,
      });

    if (!active) return;

    rAF = window.requestAnimationFrame(update);
  }

  function onDragStart(evt) {
    if (evt.type === "mousedown" && evt.button !== LMB) return;

    target = evt.target;
    initial = evt.pageX || evt.touches[0].pageX;
    active = true;
    last = false;
    x = initial;

    // could be moved to its own function
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchmove", onDragMove, { passive: false });
    document.addEventListener("touchend", onDragMove, { passive: false });
    document.addEventListener("touchcancel", onDragMove, { passive: false });

    rAF = window.requestAnimationFrame(update);
    evt.preventDefault();
  }

  function onDragMove(evt) {
    try {
      x = evt.pageX || evt.touches[0].pageX;
    } catch (err) {
      // if anything bad happens, release the handle
      active = false;
      last = true;
      // *NOTE* I don't think we need to clear event handlers at this point,
      // since "mouseup" will fire as soon as the user releases the LMB
    }
    evt.preventDefault();
  }

  function onDragEnd(evt) {
    active = false;
    last = true;

    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("touchmove", onDragMove, { passive: false });
    document.removeEventListener("touchend", onDragMove, { passive: false });
    document.removeEventListener("touchcancel", onDragMove, { passive: false });

    evt.preventDefault();
  }

  return () => {
    el.removeEventListener("mousedown", onDragStart);
    el.removeEventListener("touchstart", onDragStart, { passive: false });
    window.requestAnimationFrame(rAF);
  };
}

window.customElements.define("double-slider", DoubleSlider);
