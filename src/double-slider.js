class DoubleSlider {
  static get styles () {
    return `
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
        background-color: #3F51B5;
        transform: scaleX(0) translateX(0);
      }
      .range__control {
        position: absolute;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -moz-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -moz-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
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
        background-color: #3F51B5;
        transform: scale(0.571);
        transition: transform 100ms ease-out;
        pointer-events: none;
        will-change: transform;
      }
      .range__control--active .range__control-knob {
        transform: scale(1);
      }
    `;
  }

  static template (color, inverse) {
    return `
      <div class="range">
        <div
          class="range__track-wrap"
          ${inverse && `style="background-color: rgba(255, 255, 255, .5);"`}
        >
          <div
            class="range__track js-range__track"
            ${color && `style="background-color: ${color};"`}
          ></div>
        </div>
        <div class="range__control js-knob" data-controls="min">
          <div
            class="range__control-knob"
            ${color && `style="background-color: ${color};"`}
          ></div>
        </div>
        <div class="range__control js-knob" data-controls="max">
          <div
            class="range__control-knob"
            ${color && `style="background-color: ${color};"`}
          ></div>
        </div>
      </div>
    `;
  }

  constructor (props) {
    this.props = props;

    this._animate = this._animate.bind(this);
    this._checkRange = this._checkRange.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onStart = this._onStart.bind(this);
    this._addEventListeners = this._addEventListeners.bind(this);
    this._removeEventListeners = this._removeEventListeners.bind(this);

    this._init(props);
    this._setInitialState();
    this._cacheDOM();
    this._render();
  }

  _init ({ id, color, inverse }) {
    this.component = document.getElementById(id);
    this.component.innerHTML = DoubleSlider.template(color, inverse);

    window.addEventListener('resize', this._onResize);
    this.component.addEventListener('touchstart', this._onStart);
    this.component.addEventListener('mousedown', this._onStart);

    const hasStyles = document.getElementById('js-range-styles');

    if (hasStyles)
      return;

    const style = document.createElement('style');
    style.id = 'js-range-styles';
    style.innerHTML = DoubleSlider.styles;
    document.head.appendChild(style);
  }

  _setInitialState () {
    this._gBCR = this.component.getBoundingClientRect();

    this._state = {
      min: 0,
      max: this._gBCR.width,
      range: this._gBCR.width
    }
  }

  _cacheDOM () {
    this.track = this.component.querySelector('.js-range__track');
    this.controls = {
      min: this.component.querySelector('[data-controls="min"]'),
      max: this.component.querySelector('[data-controls="max"]')
    }
  }

  _addEventListeners () {
    document.addEventListener('touchmove', this._onMove);
    document.addEventListener('touchend', this._onEnd);
    document.addEventListener('touchcancel', this._onEnd);

    document.addEventListener('mousemove', this._onMove);
    document.addEventListener('mouseup', this._onEnd);
  }

  _removeEventListeners () {
    document.removeEventListener('touchmove', this._onMove);
    document.removeEventListener('touchend', this._onEnd);
    document.removeEventListener('touchcancel', this._onEnd);

    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('mouseup', this._onEnd);
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
    const min = DoubleSlider.hasValue(data.min)
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

    this._addEventListeners();

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._currentX = pageX - this._gBCR.left;
    this._knob = evt.target.getAttribute('data-controls');
    this._eventTarget = this.controls[this._knob];
    this._state[this._knob] = evt.pageX - this._gBCR.left;
    this._rAF = requestAnimationFrame(this._animate);

    this._eventTarget.classList.add('range__control--active');

    if (this.props.onStart !== undefined)
      this.props.onStart(this.value);
  }

  _onMove (evt) {
    if (!this._eventTarget)
      return;

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._currentX = pageX - this._gBCR.left;

    if (this.props.onMove !== undefined)
      this.props.onMove(this.value);
  }

  _onEnd (evt) {
    if (!this._eventTarget)
      return;

    this._eventTarget.classList.remove('range__control--active');
    this._eventTarget = null;
    cancelAnimationFrame(this._rAF);

    this._removeEventListeners();

    if (this.props.onEnd !== undefined)
      this.props.onEnd(this.value);
  }

  // utils
  _onResize () {
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(_ => {
      this._gBCR = this.component.getBoundingClientRect();
    }, 250);
  }

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
    let nextState = DoubleSlider.map(obj, this._checkRange);
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

  static map (obj, fn) {
    const res = {};
    Object.keys(obj).forEach(key => {
      res[key] = fn(obj[key], key);
    });
    return res;
  }

  static hasValue (value) {
    return value !== null && value !== undefined;
  }
}

export default DoubleSlider;