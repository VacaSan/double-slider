/* eslint-disable wc/no-constructor-attributes */
import { interpolate, clamp, quantize } from "./utils.js";
import { createStore } from "./store.js";
import { addDragHandler, DragState } from "./gesture.js";

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

type ObservedAttribute =
  | typeof MAX
  | typeof MIN
  | typeof STEP
  | typeof VALUE_MAX
  | typeof VALUE_MIN
  | typeof DISABLED;

type DoubleSliderEvent = typeof EVT_CHANGE | typeof EVT_INPUT;
const template = doc.createElement("template");

template.innerHTML = `
  <style>
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  :host {
    display: block;
    color: #0375ff;
  }
  :host([hidden]) {
    display: none;
  }
  :host([disabled]) {
    color: #bdbdbd;
    pointer-events: none;
  }
  .double-slider {
    position: relative;
    width: 100%;
    height: 48px;
    color: inherit;
  }
  .track-wrap {
    position: absolute;
    top: 50%;
    width: 100%;
    height: 2px;
    border-radius: 1px;
    transform: translateY(-50%);
    overflow: hidden;
  }
  .track-wrap::after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: currentColor;
    opacity: 0.26;
  }
  .track {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: left top;
    background-color: currentColor;
    transform: translateX(0) scaleX(0);
    will-change: transform;
  }
  .thumb {
    position: absolute;
    top: 50%;
    left: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    padding: 0;
    color: inherit;
    background: none;
    transform: translateX(0) translate(-50%, -50%);
    cursor: pointer;
    user-select: none;
    outline: none;
    border: 0;
  }
  .thumb::after {
    display: block;
    content: "";
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background-color: currentColor;
    transform: scale(0.571);
    transition: transform 100ms ease-out;
    pointer-events: none;
    will-change: transform;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }
  .thumb:active::after {
    transform: scale(1);
  }
  .thumb:disabled::after {
    transform: scale(0.381);
    box-shadow: none;
  }
  .thumb::before {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    content: "";
    width: 100%;
    height: 100%;
    background-color: currentColor;
    opacity: 0;
    pointer-events: none;
    transform: scale(0);
    border-radius: 50%;
    transition: transform 210ms ease-out, opacity 210ms ease-out;
  }
  .thumb:focus:not(:active)::before {
    opacity: 0.25;
    transform: scale(0.8);
  }
</style>

<div class="double-slider">
  <div class="track-wrap">
    <div id="track" class="track"></div>
  </div>

  <button
    class="thumb"
    id="thumb-min"
    data-name="valuemin"
    role="slider"
    aria-valuemin=""
    aria-valuenow=""
    aria-valuemax=""
  ></button>
  <button
    class="thumb"
    id="thumb-max"
    data-name="valuemax"
    role="slider"
    aria-valuemin=""
    aria-valuenow=""
    aria-valuemax=""
  ></button>
</div>
`;

// TODO: validate whole state?
function validate({
  max,
  min,
  step,
}: {
  max: number;
  min: number;
  step: number;
}) {
  if (max <= min) throw new RangeError("min must be lower than max");
  if (step < 0) throw new RangeError("step must be greater than or equal zero");
}

type State = {
  max: number;
  min: number;
  step: number;
  valuemax: number;
  valuemin: number;
};

export class DoubleSlider extends HTMLElement {
  private store: ReturnType<typeof createStore<State>>;

  private $min: HTMLButtonElement;

  private $max: HTMLButtonElement;

  private $track: HTMLDivElement;

  private gBCR?: DOMRect;

  private unsubscribe?: () => void;

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

  static get observedAttributes(): Array<ObservedAttribute> {
    return [MAX, MIN, STEP, VALUE_MAX, VALUE_MIN, DISABLED];
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

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.$min = shadowRoot.querySelector("#thumb-min")!;
    this.$max = shadowRoot.querySelector("#thumb-max")!;
    this.$track = shadowRoot.querySelector("#track")!;

    this.render = this.render.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  attributeChangedCallback(
    name: ObservedAttribute,
    oldValue: string,
    newValue: string
  ) {
    if (name === DISABLED) {
      this.$max.disabled = this.disabled;
      this.$min.disabled = this.disabled;
    } else {
      // kebab to camel case?
      this[name] = Number(newValue);
    }
  }

  connectedCallback() {
    // TODO: check if this.isConnected
    DoubleSlider.observedAttributes.forEach(prop => this.upgradeProperty(prop));

    this.gBCR = this.getBoundingClientRect();

    // subscribe to state changes
    this.unsubscribe = this.store.connect(this.render);

    // add event handlers
    this.$max.addEventListener("keydown", this.handleKeyDown);
    this.$min.addEventListener("keydown", this.handleKeyDown);

    addDragHandler(this.$max, this.handleDrag);
    addDragHandler(this.$min, this.handleDrag);

    window.addEventListener("resize", this.handleResize);
  }

  disconnectedCallback() {
    // cleanup
    this.unsubscribe?.();
    // As part of the component lifecycle, the browser manages and
    // cleans up listeners, so you don’t have to worry about it.
    // However, if you add a listener to the global window object,
    // you’re responsible for removing the listener
    window.removeEventListener("resize", this.handleResize);
  }

  // public methods
  layout() {
    this.gBCR = this.getBoundingClientRect();
    this.render(this.store.getState());
  }

  // event handlers
  private handleResize() {
    this.layout();
  }

  private handleDrag({ target, last, initial, movement }: DragState) {
    if (!isHTMLElement(target)) return;

    const name = target.dataset.name as typeof VALUE_MAX | typeof VALUE_MIN;

    const state = this.store.getState();
    const { max, min, step } = state;
    const { width, left } = this.gBCR!;

    const inputRange = [left, left + width] as [x0: number, x1: number];
    const outputRange = [min, max] as [y0: number, y1: number];
    const current = initial + movement;

    const upperBound = state[name === VALUE_MAX ? MAX : VALUE_MAX];
    const lowerBound = state[name === VALUE_MAX ? VALUE_MIN : MIN];

    let value = interpolate(current, inputRange, outputRange);
    value = quantize(value, step);
    value = clamp(value, lowerBound, upperBound);

    this.store.setState({ [name]: value });

    this.dispatch(EVT_INPUT);
    if (last) this.dispatch(EVT_CHANGE);
  }

  private handleKeyDown(evt: KeyboardEvent) {
    if (!isHTMLElement(evt.currentTarget)) return;

    const name = evt.currentTarget.dataset.name as
      | typeof VALUE_MAX
      | typeof VALUE_MIN;
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

    this.store.setState({ [name]: clamp(nextValue, lowerBound, upperBound) });

    this.dispatch(EVT_INPUT);
    this.dispatch(EVT_CHANGE);
  }

  private render(state: State) {
    const { width } = this.gBCR!;
    const { max, min, valuemax, valuemin } = state;

    const inputRange = [min, max] as [x0: number, x1: number];
    const outputRange = [0, width] as [y0: number, y1: number]; // in px

    const maxX = interpolate(valuemax, inputRange, outputRange);
    this.$max.style.transform = `translateX(${maxX}px) translate(-50%, -50%)`;

    const minX = interpolate(valuemin, inputRange, outputRange);
    this.$min.style.transform = `translateX(${minX}px) translate(-50%, -50%)`;

    const sX = interpolate(maxX - minX, [0, width], [0, 1]);
    this.$track.style.transform = `translateX(${minX}px) scaleX(${sX})`;

    // TODO: update aria-valuetext and aria-labeledby
    // see https://www.w3.org/TR/wai-aria-practices/#slidertwothumb
    this.$max.setAttribute("aria-valuemin", String(valuemin));
    this.$max.setAttribute("aria-valuenow", String(valuemax));
    this.$max.setAttribute("aria-valuemax", String(max));

    this.$min.setAttribute("aria-valuemin", String(min));
    this.$min.setAttribute("aria-valuenow", String(valuemin));
    this.$min.setAttribute("aria-valuemax", String(valuemax));
  }

  // utils
  private upgradeProperty(prop: ObservedAttribute) {
    if (this[prop]) {
      const value = this[prop];
      delete this[prop];
      // @ts-ignore
      this[prop] = value;
    }
  }

  dispatch(type: DoubleSliderEvent) {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, detail: this }));
  }
}

function isHTMLElement(target: unknown): target is HTMLElement {
  return target instanceof HTMLElement;
}

function getValueForKeyId({
  keyId,
  value,
  min,
  max,
  step,
}: {
  keyId: string;
  value: number;
  min: number;
  max: number;
  step: number;
}) {
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

window.customElements.define("double-slider", DoubleSlider);

declare global {
  interface HTMLElementTagNameMap {
    "double-slider": DoubleSlider;
  }
}
