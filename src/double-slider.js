import { interpolate, clamp, quantize } from "./utils";
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

const template = doc.createElement("template");

// TODO inline contents
template.innerHTML = contents;

function createStore(initialState = {}) {
  let state = initialState;
  let listeners = [];

  function setState(partial, forceUpdate = false) {
    const update = typeof partial === "function" ? partial(state) : partial;

    const shouldUpdate = Object.keys(update).reduce((acc, key) => {
      return acc || update[key] !== state[key];
    }, forceUpdate);

    if (!shouldUpdate) return;

    const nextState = Object.assign({}, state, update);

    listeners.forEach(fn => fn && fn(nextState, state));
    state = nextState;
  }

  function getState() {
    return state;
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
    connect,
  });
}

function validate({ max, min, step }) {
  if (max <= min) throw new RangeError("min must be lower than max");
  if (step < 0) throw new RangeError("step must be greater than zero");
}

class DoubleSlider extends HTMLElement {
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

    // TODO attach event handlers (keydown...)

    // bind methods
    this.render = this.render.bind(this);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return;

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

    // can we re-use handler logic? and should we do this in connectedCallback?
    this.unbindMax = bindDragHandler(this.$max, ({ initial, movement }) => {
      const { max, min, step, valuemin } = this.store.getState();

      const { width, left } = this.gBCR;

      const inputRange = [left, left + width];
      const outputRange = [min, max];

      let valuemax = interpolate(initial + movement, inputRange, outputRange);

      if (step && step > 0) valuemax = quantize(valuemax, step);

      this.store.setState({
        valuemax: clamp(valuemax, valuemin, max),
      });
      // TODO dispatch events
    });

    this.unbindMin = bindDragHandler(this.$min, ({ initial, movement }) => {
      const { max, min, step, valuemax } = this.store.getState();

      const { width, left } = this.gBCR;

      const inputRange = [left, left + width];
      const outputRange = [min, max];

      let valuemin = interpolate(initial + movement, inputRange, outputRange);

      if (step && step > 0) valuemin = quantize(valuemin, step);

      this.store.setState({
        valuemin: clamp(valuemin, min, valuemax),
      });
    });
  }

  disconnectedCallback() {
    // cleanup
    this.unsubscribe();
    this.unbindMin();
    this.unbindMax();
  }

  render(state) {
    const { width } = this.gBCR;
    const { max, min, valuemax, valuemin } = state;

    const inputRange = [min, max];
    const outputRange = [0, width]; // in px

    // ...quantize(valuemax, step) here?
    const maxX = interpolate(valuemax, inputRange, outputRange);
    this.$max.style.transform = `translateX(${maxX}px) translate(-50%, -50%)`;

    const minX = interpolate(valuemin, inputRange, outputRange);
    this.$min.style.transform = `translateX(${minX}px) translate(-50%, -50%)`;

    const sX = interpolate(maxX - minX, [0, width], [0, 1]);
    this.$track.style.transform = `translateX(${minX}px) scaleX(${sX})`;

    // TODO update aria attributes
  }

  upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

const LMB = 0;
// TODO give better name...
function bindDragHandler(el, handler) {
  let rAF = -1;
  // state
  let active = false;
  let x = 0;
  let initial = 0;
  // maybe we'll need delta, or event?
  // delta = movement - prevMovement
  // event = initial event?

  // TODO add touch support
  el.addEventListener("mousedown", onDragStart);

  function update() {
    handler &&
      handler({
        x,
        movement: x - initial,
        initial,
        active,
      });

    if (!active) return;

    rAF = window.requestAnimationFrame(update);
  }

  function onDragStart(evt) {
    if (evt.button !== LMB) return;

    initial = evt.pageX || evt.touches[0].pageX;
    active = true;
    x = initial;

    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);

    rAF = window.requestAnimationFrame(update);
    evt.preventDefault();
  }

  function onDragMove(evt) {
    try {
      x = evt.pageX || evt.touches[0].pageX;
    } catch (err) {
      // if anything bad happens, release the handle
      active = false;
      // *NOTE* I don't think we need to clear event handlers at this point,
      // since "mouseup" will fire as soon as the user releases the LMB
    }
    evt.preventDefault();
  }

  function onDragEnd(evt) {
    active = false;

    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);

    evt.preventDefault();
  }

  return () => {
    el.removeEventListener("mousedown", onDragStart);
    window.requestAnimationFrame(rAF);
  };
}

window.customElements.define("double-slider", DoubleSlider);
