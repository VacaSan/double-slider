<div align="center">
  <h1>double slider</h1>

  <a href="https://emojipedia.org/apple/ios-13.3/hamburger/">
    <img
      src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/apple/237/hamburger_1f354.png" 
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
- [Events](#Events)
- [Customization](#Customization)
- [License](#License)

## Installation

// TODO

```sh
npm install --save double-slider
```

## Usage

// TODO

```js
import "double-slider";
```

```html
<double-slider
  min="0"
  max="100"
  step="1"
  value-min="25"
  value-max="75"
></double-slider>
```

## Properties

// TODO

## Events

// TODO

## Customization

All thematic elements of slider make use of `currentColor`. This lets you use the color value to apply styling to slider.

```css
double-slider.fancy-color {
  color: rebeccapurple;
}
```

## License

MIT
