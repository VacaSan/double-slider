import { DoubleSlider } from "./DoubleSlider.js";

window.customElements.define("double-slider", DoubleSlider);

interface DoubleSliderEvent extends Event {
  target: DoubleSlider;
}

declare global {
  interface HTMLElementTagNameMap {
    "double-slider": DoubleSlider;
  }

  interface DoubleSliderEventMap {
    "slider:change": CustomEvent<DoubleSlider>;
    "slider:input": CustomEvent<DoubleSlider>;
  }

  interface HTMLElementEventMap {
    "slider:change": DoubleSliderEvent;
    "slider:input": DoubleSliderEvent;
  }
}
