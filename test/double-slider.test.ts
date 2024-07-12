import { expect, fixture, html } from "@open-wc/testing";
import { DoubleSlider } from "../src/DoubleSlider.js";
import "../src/double-slider.js";

describe("double-slider", () => {
  it("is accessible", async () => {
    const el = await fixture<DoubleSlider>(
      html`<double-slider></double-slider>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });

  it("has default attributes", async () => {
    const el = await fixture<DoubleSlider>(
      html`<double-slider></double-slider>`
    );

    expect(el.max).to.equal(100);
    expect(el.min).to.equal(0);
    expect(el.step).to.equal(0);
    expect(el.valuemax).to.equal(100);
    expect(el.valuemin).to.equal(0);
  });

  it("updates attributes correctly", async () => {
    const el = await fixture<DoubleSlider>(
      html`<double-slider
        max="200"
        min="50"
        step="5"
        valuemax="150"
        valuemin="75"
      ></double-slider>`
    );

    expect(el.max).to.equal(200);
    expect(el.min).to.equal(50);
    expect(el.step).to.equal(5);
    expect(el.valuemax).to.equal(150);
    expect(el.valuemin).to.equal(75);
  });

  it("updates value on keyboard interaction", async () => {
    const el = await fixture<DoubleSlider>(
      html`<double-slider></double-slider>`
    );

    const thumbMin = el.shadowRoot!.querySelector(
      "#thumb-min"
    ) as HTMLButtonElement;

    thumbMin.focus();
    thumbMin.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
    );

    expect(el.valuemin).to.be.gt(0);
  });

  it("handles disabled attribute", async () => {
    const el = await fixture<DoubleSlider>(
      html`<double-slider disabled></double-slider>`
    );
    const thumbMin = el.shadowRoot!.querySelector(
      "#thumb-min"
    ) as HTMLButtonElement;
    const thumbMax = el.shadowRoot!.querySelector(
      "#thumb-max"
    ) as HTMLButtonElement;

    expect(thumbMin.disabled).to.be.true;
    expect(thumbMax.disabled).to.be.true;
  });
});
