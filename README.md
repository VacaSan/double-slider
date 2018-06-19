# Double-Slider

Double-Slider represents an implementation of a range (two-thumb) slider component. It is based around Material Design's looks and feel, and conforms to the WAI-ARIA [slider authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#slidertwothumb).

## Demo

https://vacasan.github.io/double-slider/

## Installation

```sh
npm install --save double-slider
```

## Usage

```html
<div id="my-slider"
  data-min="25"
  data-max="75"
  data-range="100"
></div>
```

then in JS

```js
import DoubleSlider from 'double-slider';

const mySlider = new DoubleSlider(document.getElementById('my-slider'));
mySlider.addEventListener('slider:change', () => {
  const {min, max} = mySlider.value;
  console.log(`Min is: ${min}, max is: ${max}`);
});
```

### Initializing the slider with custom ranges/values

When `DoubleSlider` is initialized, it reads the element's `data-min`, `data-max` and `data-range` values if present and uses them to set the components `value` and `range` properties.

DoubleSlider requires that `data-range` attribute is provided. An error will be thrown if it is not defined.

### Double Slider Component API

#### Properties

| Property Name | Type | Description |
| --- | --- | --- |
| `value` | `object` | The current min and max values of the slider. |
| `range` | `number` | The maximum value a slider can have. |

#### Methods

| Method Signature | Description |
| --- | --- |
| `layout() => void` | Recomputes the dimensions and re-lays out the component. This should be called if the dimensions of the slider itself or any of its parent element change programmatically (it is called automatically on resize). |
| `addEventListener(type: string, handler: EventListener) => void` | Adds an event listener `handler` for event type `type` to slider's root element |
| `removeEventListener(type: string, handler: EventListener) => void` | Removes an event listener `handler` for event type `type` from the slider's root element |

#### Events

`DoubleSlider` emits a `slider:input` custom event from its root element whenever the slider value is changed by way of a user event, e.g. when a user is dragging the lisder or changing the value using the arrow keys. The `detail` property of the event is set to the slider instance that was affected.

`DoubleSlider` emits a `slider:change` custom event from its root element whenever the slider value is changed _and committed_ by way of a user event, e.g. when a user stops dragging the slider or changes the value using the arrow keys. The `detail` property of the event is set to the slider instance that was affected.

### Theming

All thematic elements of sliders make use of `currentColor`. This lets you use the `color` value to apply theming to sliders.

```css
.slider {
  color: royalblue;
}
```

## Licence

MIT
