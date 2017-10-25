import { map, hasValue } from '../utils';

class Range {
  static _template (color = '#3F51B5') {
    return `
      <style>
        .range {
          position: relative;
          width: 100%;
          height: 48px;
        }
        .range__track-wrap {
          position: absolute;
          top: 50%;
          width: 100%;
          height: 2px;
          background-color: rgba(0, 0, 0, .26);
          transform: translateY(-50%);
          overflow: hidden;
        }
        .range__track {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-origin: left top;
          background-color: ${color};
          transform: scaleX(0) translateX(0);
        }
        .range__control {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          top: 50%;
          left: 0;
          width: 42px;
          height: 42px;
          background-color: transparent;
          transform: translateX(0) translate(-50%, -50%);
          cursor: pointer;
          user-select: none;
        }
        .range__control-knob {
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background-color: ${color};
          transform: scale(0.571);
          transition: transform 100ms ease-out;
          pointer-events: none;
          will-change: transfrom;
        }
        .range__control--active .range__control-knob {
          transform: scale(1);
        }
      </style>
      <div class="range">
        <div class="range__track-wrap">
          <div class="range__track js-range__track"></div>
        </div>
        <div class="range__control js-knob" data-controls="min">
          <div class="range__control-knob"></div>
        </div>
        <div class="range__control js-knob" data-controls="max">
          <div class="range__control-knob"></div>
        </div>
      </div>
    `;
  }

  constructor (id, mediator, color) {
    this.mediator = mediator;
    // init
    this.component = document.getElementById(id);
    this.component.innerHTML = Range._template(color);

    this._animate = this._animate.bind(this);
    this._checkRange = this._checkRange.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onStart = this._onStart.bind(this);

    this._gBCR = this.component.getBoundingClientRect();
    this._eventTarget = null;
    this._knob = '';
    this._currentX = 0;

    this._state = {
      min: 0,
      max: this._gBCR.width,
      range: this._gBCR.width
    }

    this._cacheDOM();
    this._addEventListeners();
    this._render();
  }

  _cacheDOM () {
    this.track = this.component.querySelector('.js-range__track');
    this.controls = {
      min: this.component.querySelector('[data-controls="min"]'),
      max: this.component.querySelector('[data-controls="max"]')
    }
  }

  _addEventListeners () {
    window.addEventListener('resize', this._onResize);

    document.addEventListener('touchstart', this._onStart);
    document.addEventListener('touchmove', this._onMove);
    document.addEventListener('touchend', this._onEnd);

    document.addEventListener('mousedown', this._onStart);
    document.addEventListener('mousemove', this._onMove);
    document.addEventListener('mouseup', this._onEnd);
  }

  // getters/setters
  get value () {
    return {
      min: Math.round(this._toValue(this._state.min)),
      max: Math.round(this._toValue(this._state.max)),
      range: this._state.range
    }
  }

  set value (data) {
    const range = data.range || this._state.range;
    const min = hasValue(data.min)
      ? this._toPx(data.min, range)
      : this._state.min;
    const max = data.max ? this._toPx(data.max, range) : this._state.max;

    this._setState({
      range,
      min,
      max
    });
  }

  // event handlerse
  _onStart (evt) {
    if (this._eventTarget)
      return;

    if (!evt.target.classList.contains('js-knob'))
      return;

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._currentX = pageX - this._gBCR.left;
    this._knob = evt.target.getAttribute('data-controls');
    this._eventTarget = this.controls[this._knob];
    this._state[this._knob] = evt.pageX - this._gBCR.left;
    this._rAF = requestAnimationFrame(this._animate);

    this._eventTarget.classList.add('range__control--active');
    this.mediator.publish('onstart', this.value);
  }

  _onMove (evt) {
    if (!this._eventTarget)
      return;

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._currentX = pageX - this._gBCR.left;
    // this.mediator.publish('onmove', this.value);
  }

  _onEnd (evt) {
    if (!this._eventTarget)
      return;

    this._eventTarget.classList.remove('range__control--active');
    this._eventTarget = null;
    cancelAnimationFrame(this._rAF);
    //TODO check when to call, here or in setState
    this.mediator.publish('onend', this.value);
  }

  _onResize () {
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(_ => {
      this._gBCR = this.component.getBoundingClientRect();
    }, 250);
  }

  // utils
  _animate () {
    this._rAF = requestAnimationFrame(this._animate);

    if (!this._eventTarget)
      return;

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
        return this._state.max;
      else
        return value;
    }
    else if (key === 'max') {
      if (value > this._gBCR.width) {
        return this._gBCR.width;
      }
      else if (value < this._state.min)
        return this._state.min;
      else
        return value;
    }
    else
      return value;
  }
}

export default Range;