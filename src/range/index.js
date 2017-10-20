export default class {
  constructor (id, max, min = 0) {
    this._max = max;
    this._min = min;
    this.component = document.getElementById(id);
    this.track = this.component.querySelector('#js-range__track');
    this.controlMin = this.component.querySelector('[data-controls="min"]');
    this.controlMax = this.component.querySelector('[data-controls="max"]');

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.update = this.update.bind(this);

    this._gBCR = this.component.getBoundingClientRect();
    this.componentX = this._gBCR.left;
    this.width = this._gBCR.width;

    this.eventTarget = null;
    this.currentX = 0;

    this.addEventListeners();
  }

  addEventListeners () {
    document.addEventListener('mousedown', this.onStart);
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEnd);
  }

  _render () {
    this.controlMin.style.transform = `translateX(${this.currentX}px) translate(-50%, -50%)`;
    this.controlMax.style.transform = `translateX(${this.currentX}px) translate(-50%, -50%)`;
  }

  _valueToPx (val) {
    return (val / this._max) * this.width; //px
  }

  get min () {
    return this._min;
  }

  set min (val) {
    // val: number
    this._min = val;
  }

  get max () {
    return this._max;
  }

  set max (val) {
    // val: number
    this._max = val;
  }

  get value () {
    return this._value;
  }

  set value (val) {
    // val: array = [0, n],  n > 0
    this._value = {
      min: Math.min(...val),
      max: Math.max(...val)
    }
  }

  onStart (evt) {
    if (this.eventTarget)
      return;

    if (!evt.target.classList.contains('knob'))
      return;

    this.eventTarget = evt.target;
    this.componentX = this.component.offsetLeft;
    this.currentX = evt.pageX - this.componentX;
    this.rAF = requestAnimationFrame(this.update);

    this.eventTarget.classList.add('range__control--active');
  }

  onMove (evt) {
    if (!this.eventTarget)
      return;

    this.currentX = evt.pageX - this.componentX;
  }

  onEnd (evt) {
    if (!this.eventTarget)
      return;

    this.eventTarget.classList.remove('range__control--active');
    this.eventTarget = null;
  }

  update () {
    this.rAF = requestAnimationFrame(this.update);

    if (!this.eventTarget)
      return;

    if (this.currentX < this._min)
      this.currentX = this._min;
    else if (this.currentX > this._valueToPx(this._max))
      this.currentX = this.width;

    this.eventTarget.style.transform = `translateX(${this.currentX}px) translate(-50%, -50%)`;
  }
}