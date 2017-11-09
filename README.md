# Double-Slider

A simple two-thumb slider component.

## Demo

https://vacasan.github.io/double-slider/

## Install

```sh
npm install --save double-slider
```

## Usage

```html
<div id="my-slider"></div>
```

```js
import DoubleSlider from 'double-slider';

const mySlider = new DoubleSlider({ id: 'my-slider' });
```

## API

### DoubleSlider(*options*)

#### Options: object

`id: string` (*required*)
  String representing the DOM node.

`onStart: function` (*optional*)
  Function to be called on drag start. Receives a `value` object as an argument.

`onMove: function` (*optional*)
  Function to be called while dragging. Receives a `value` object as an argument.

`onEnd: function` (*optional*)
  Function to be called on drag end. Receives a `value` object as an argument.

`color: string` (*optional*)
  Define the color of the component (defaults to #3F51B5).

`inverse: bool` (*optional*)
  Set to `true`, for usage on dark backgrounds (defaults to `false`).

```js
const mySlider = new DoubleSlider({
  id: 'my-slider',
  onEnd: value => {
    // ...
  }
})
```

### DoubleSlider.value

The `DoubleSlider.value` property sets or gets the `min`, `max` and `range` vlues of the component.

`value: object`

```js
mySlider.vlaue = { max: 5, range: 12 };
mySlider.vlaue = { range: 7 };

mySlider.value; // { min: 0, max: 5, range: 7 }
```

## Licence

MIT
