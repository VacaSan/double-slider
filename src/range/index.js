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
    this._currentX = 0;
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

    this._eventTarget = evt.target;
    this._knob = this._eventTarget.getAttribute('data-controls');
    this._currentX = evt.pageX - this._gBCR.left;
    this.rAF = requestAnimationFrame(this.update);

    this._eventTarget.classList.add('range__control--active');
  }

  onMove (evt) {
    if (!this._eventTarget)
      return;

    this._currentX = evt.pageX - this._gBCR.left;
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

    // Change rules for each knob
    if (this._currentX < 0)
      this._currentX = 0;
    else if (this._currentX > this.toPx(this._max, this._max, this._gBCR.width))
      this._currentX = this._gBCR.width;

    this._eventTarget.style.transform =
      `translateX(${this._currentX}px) translate(-50%, -50%)`;
  }

  toPx (val) {
    return (val / this._max) * this._gBCR.width; //px
  }
}

