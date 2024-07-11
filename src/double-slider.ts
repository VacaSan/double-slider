import { DoubleSlider } from "./DoubleSlider.js";

window.customElements.define("double-slider", DoubleSlider);

declare global {
  interface HTMLElementTagNameMap {
    "double-slider": DoubleSlider;
  }
}
