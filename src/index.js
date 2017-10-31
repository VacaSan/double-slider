import Range from './range';

const slider = new Range({
  id: 'js-range',
  onEnd: onEnd
});

const $inputs = $('input.js-range-input');
$inputs.on('input', onInput);

function onEnd (data) {
  $inputs.each(function () {
    const target = $(this);
    const controls = target.attr('data-controls');
    target.val(data[controls]);
  })
};

function onInput () {
  const controls = $(this).attr('data-controls');
  slider.value = { [controls]: this.value }
}