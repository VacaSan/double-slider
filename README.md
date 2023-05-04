# \<double-slider>

> This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

Double-Slider represents an implementation of a range (two-thumb) slider component. It is based around Material Design's looks and feel, and conforms to the WAI-ARIA [slider authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#slidertwothumb).

## Content

- [Installation](#Installation)
- [Usage](#Usage)
- [Properties](#Properties)
- [Methods](#Methods)
- [Events](#Events)
- [Customization](#Customization)
- [Development](#Development)
- [License](#License)

## Installation

```sh
npm i double-slider
```

## Usage

```html
<script type="module">
  import "double-slider";
</script>
<double-slider
  min="0"
  max="100"
  step="5"
  valuemin="25"
  valuemax="75"
></double-slider>
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
double-slider {
  color: rebeccapurple;
}
```

## Development

### Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

### Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

### Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

### Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

## License

MIT
