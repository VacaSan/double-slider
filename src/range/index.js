export default class {
  constructor (id, max) {
    // range
    this._max = max;

    // cache DOM
    this.component = document.getElementById(id);
    this.track = this.component.querySelector('#js-range__track');
    this.controls = {
      min: this.component.querySelector('[data-controls="min"]'),
      max: this.component.querySelector('[data-controls="max"]')
    }

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.update = this.update.bind(this);

    this._gBCR = this.component.getBoundingClientRect();
    this._state = {
      min: 0,
      max: this.toPx(this._max)
    }

    this._eventTarget = null;
    this._knob = '';

    this._addEventListeners();
  }

  _addEventListeners () {
    document.addEventListener('mousedown', this.onStart);
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEnd);
  }

  onStart (evt) {
    if (this._eventTarget)
      return;

    if (!evt.target.classList.contains('knob'))
      return;

    this._knob = evt.target.getAttribute('data-controls');
    this._eventTarget = this.controls[this._knob];
    this._state[this._knob] = evt.pageX - this._gBCR.left;
    this.rAF = requestAnimationFrame(this.update);

    this._eventTarget.classList.add('range__control--active');
  }

  onMove (evt) {
    if (!this._eventTarget)
      return;

    this._state[this._knob] = evt.pageX - this._gBCR.left;
  }

  onEnd (evt) {
    if (!this._eventTarget)
      return;

    this._eventTarget.classList.remove('range__control--active');
    this._eventTarget = null;
  }

  update () {
    this.rAF = requestAnimationFrame(this.update);

    if (!this._eventTarget)
      return;

    let currentX = this._state[this._knob];

    // Change rules for each knob
    if (currentX < 0)
      currentX = 0;
    else if (currentX > this.toPx(this._max))
      currentX = this._gBCR.width;

    this._render();
  }

  _render () {
    this.controls.max.style.transform =
      `translateX(${this._state.max}px) translate(-50%, -50%)`;
    this.controls.min.style.transform =
      `translateX(${this._state.min}px) translate(-50%, -50%)`;
  }

  toPx (val) {
    return (val / this._max) * this._gBCR.width; //px
  }
}

