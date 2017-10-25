import Slider from './range';
import Mediator from './mediator';

const mediator = new Mediator();

const slider = new Slider('js-range', mediator);

const $inputs = $('input.js-range-input');

mediator.subscribe('onend', data => {
  $inputs.each(function () {
    const target = $(this);
    const controls = target.attr('data-controls');
    target.val(data[controls]);
  })
});

$inputs.on('input', function () {
  const controls = $(this).attr('data-controls');
  slider.value = { [controls]: this.value }
});