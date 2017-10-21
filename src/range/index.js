import { map } from './utils';

export default class {
  constructor (id, props) {
    this.props = props;
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
    this._animate = this._animate.bind(this);
    this._checkRange = this._checkRange.bind(this);

    // TODO update on resize
    this._gBCR = this.component.getBoundingClientRect();
    this._eventTarget = null;
    this._knob = '';
    this._currentX = 0;
    this._state = {
      min: 0,
      max: this._gBCR.width,
      range: this._gBCR.width
    }

    this._addEventListeners();
    this._render();
  }

  get value () {
    return {
      min: Math.round(this._toValue(this._state.min)),
      max: Math.round(this._toValue(this._state.max)),
      range: this._state.range
    }
  }

  set value (data) {
    const range = data.range || this._state.range;
    const min = data.min ? this._toPx(data.min, range) : this._state.min;
    const max = data.max ? this._toPx(data.max, range) : this._state.max;

    this._setState({
      range,
      min,
      max
    });
  }

  _addEventListeners () {
    // TODO add touch support
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
    this.rAF = requestAnimationFrame(this._animate);

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
    //TODO check when to call, here or in setState
    this.props.onChange(this.value);
  }

  _animate () {
    this.rAF = requestAnimationFrame(this._animate);

    if (!this._eventTarget)
      return;

    const min = (this._knob === 'min')
      ? 0
      : this._state.min;
    const max = (this._knob === 'max')
      ? this._gBCR.width
      : this._state.max;

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

  _toPx (val, range) {
    return (val / range) * this._gBCR.width; //px
  }

  _toValue (val) {
    return (this._state.range * val) / this._gBCR.width;
  }

  _setState (obj) {
    let nextState = map(obj, this._checkRange);
    this._state = Object.assign({}, this._state, nextState);
    this._render();
  }

  // ugliest func ever
  _checkRange (value, key) {
    if (key === 'min') {
      if (value < 0)
        return 0;
      else if (value > this._state.max)
        return this._state.max - 1;
      else
        return value;
    }
    else if (key === 'max') {
      if (value > this._state.range) {
        return this._gBCR.width;
      }
      else if (value < this._state.min)
        return this._state.min + 1;
      else
        return value;
    }
    else
      return value;
  }
}