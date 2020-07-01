<div align="center">
  <h1>double slider</h1>

  <a href="https://emojipedia.org/apple/ios-13.3/hamburger/">
    <img
      src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/apple/237/skateboard_1f6f9.png" 
      alt="burger"
      width="80"
      height="80">
  </a>
</div>

Double-Slider represents an implementation of a range (two-thumb) slider component. It is based around Material Design's looks and feel, and conforms to the WAI-ARIA [slider authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#slidertwothumb).

## Content

- [Installation](#Installation)
- [Usage](#Usage)
- [Properties](#Properties)
- [Methods](#Methods)
- [Events](#Events)
- [Customization](#Customization)
- [License](#License)

## Installation

```sh
npm install --save double-slider
```

## Usage

```html
<double-slider
  id="price"
  min="0"
  max="100"
  step="5"
  valuemin="25"
  valuemax="75"
></double-slider>
```

then in js

```js
import "double-slider";

const slider = document.getElementById("price");

slider.addEventListener("slider:change", evt => {
  console.log("max value is:", evt.target.valuemax);
  console.log("min value is:", evt.target.valuemin);
});
```

## Properties

Properties can be set directly on the custom element at creation time, or dynamically via JavaScript.

> **Note** HTML Attributes don't reflect the state of the slider, so when you want to read the value, _always_ use property accessors, i.e. use `slider.valuemax`, over `slider.getAttribute('valuemax')`.

#### `max: number`

The maximum permitted value. The value must be greater than `min` attribute. If not specified defaults to 100.

#### `min: number`

The minimum permitted value. The value must be less than `max` attribute. If not specified defaults to 0.

#### `step: number`

The stepping interval.

When a step value is given, the slider will quantize all values to match that step value, _except_ for the `min` and `max`, which can always be set. This is to ensure consistent behavior.

If not specified defaults to 0, meaning no stepping is implied.

#### `valuemax: number`

Current max value. If not specified defaults to `max`.

If an attempt is made to set the value lower thant the `valuemin`, it is set to the `valuemin`. Similarly, an attempt to set the value higher than the `max` results in it being set to the `max`.

#### `valuemin: number`

Current min value. If not specified defaults to `min`.

If an attempt is made to set the value lower thant the `min`, it is set to the `min`. Similarly, an attempt to set the value higher than the `valuemax` results in it being set to the `valuemax`.

#### `disabled: boolean`

Whether or not the slider is disabled.

## Methods

#### `layout() => void`

Recomputes the dimensions and re-lays out the component. This should be called if the dimensions of the slider itself or any of its parent element change programmatically (it is called automatically on resize).

## Events

- `slider:input` Fired whenever the slider value is changed by way of a user event, e.g. when a user is dragging the slider or changing the value using the arrow keys.

- `slider:change` Fired whenever the slider value is changed and committed by way of a user event, e.g. when a user stops dragging the slider or changes the value using the arrow keys.

## Customization

All thematic elements of slider make use of `currentColor`. This lets you use the color value to apply styling to slider.

```css
double-slider.fancy-color {
  color: rebeccapurple;
}
```

## License

MIT
