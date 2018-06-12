import style from './style';

const template = `
  <div class="${style}">
    <div class="${style.trackWrap}">
      <div class="${style.track} js-track"></div>
    </div>
    <div class="${style.control} js-knob"
      data-controls="min"
      role="slider"
      tabindex="0"
      aria-valuemin="0"
      aria-valuenow="0"
      aria-valuemax="75"
      >
      <div class="${style.controlKnob}"></div>
    </div>
    <div class="${style.control} js-knob"
      data-controls="max"
      role="slider"
      tabindex="0"
      aria-valuemin="0"
      aria-valuenow="75"
      aria-valuemax="100"
      >
      <div class="${style.controlKnob}"></div>
    </div>
  </div>
`;

export default template;
