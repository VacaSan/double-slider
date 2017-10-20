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
    this._eventTarget = null;
    this._knob = '';
    this._currentX = 0;
    this._state = {
      min: 0,
      max: this._toPx(this._max)
    }

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

    this._currentX = evt.pageX - this._gBCR.left;
    this._knob = evt.target.getAttribute('data-controls');
    this._eventTarget = this.controls[this._knob];
    this._state[this._knob] = evt.pageX - this._gBCR.left;
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

    const min = (this._knob === 'min')
      ? 0
      : this._state.min;
    const max = (this._knob === 'max')
      ? this._toPx(this._max)
      : this._state.max;

    // Change rules for each knob
    if (this._currentX < min)
      this._currentX = min;
    else if (this._currentX > max)
      this._currentX = max;

    this._setState({
      [this._knob]: this._currentX
    });
  }

  _render () {
    const { max, min } = this._state;
    const trackWidth = (max - min) / this._gBCR.width;

    this.controls.max.style.transform =
      `translateX(${max}px) translate(-50%, -50%)`;
    this.controls.min.style.transform =
      `translateX(${min}px) translate(-50%, -50%)`;
    this.track.style.transform =
      `translateX(${min}px) scaleX(${trackWidth})`;
  }

  _toPx (val) {
    return (val / this._max) * this._gBCR.width; //px
  }

  _setState (obj) {
    this._state = Object.assign({}, this._state, obj);
    this._render();
  }
}

