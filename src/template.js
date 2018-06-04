import style from './style';

const template = `
  <div class="${style}">
    <div class="${style.trackWrap}">
      <div class="${style.track} js-track"></div>
    </div>
    <div class="${style.control} js-knob"
      data-controls="min"
      tabindex="0"
      >
      <div class="${style.controlKnob}"></div>
    </div>
    <div class="${style.control} js-knob"
      data-controls="max"
      tabindex="0"
      >
      <div class="${style.controlKnob}"></div>
    </div>
  </div>
`;

export default template;
