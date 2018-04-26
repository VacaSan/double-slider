class DoubleSlider {
  constructor (root) {
    this.root = root;

    this._animate = this._animate.bind(this);
    this._checkRange = this._checkRange.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onStart = this._onStart.bind(this);
    this._addEventListeners = this._addEventListeners.bind(this);
    this._removeEventListeners = this._removeEventListeners.bind(this);

    this._init();
    this._setInitialState();
    this._cacheDOM();
    this._render();
  }

  _init () {
    window.addEventListener('resize', this._onResize);
    this.root.addEventListener('touchstart', this._onStart);
    this.root.addEventListener('mousedown', this._onStart);
  }

  _setInitialState () {
    this._gBCR = this.root.getBoundingClientRect();

    this._state = {
      min: 0,
      max: 1,
      range: 10
    }
  }

  _cacheDOM () {
    this.track = this.root.querySelector('.js-double-slider_track');
    this.controls = {
      min: this.root.querySelector('[data-controls="min"]'),
      max: this.root.querySelector('[data-controls="max"]')
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
    const { min, max, range } = this._state;

    return {
      min: Math.round(range * min),
      max: Math.round(range * max),
      range
    }
  }

  set value (data) {
    const { width } = this._gBCR;

    const range = data.range || this._state.range;
    const min = DoubleSlider.hasValue(data.min)
      ? (data.min / range)
      : this._state.min;
    const max = data.max ? (data.max / range) : this._state.max;

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

    this._knob = evt.target.getAttribute('data-controls');
    this._eventTarget = this.controls[this._knob];
    this._gBCR = this.root.getBoundingClientRect();

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._left = this._eventTarget.offsetLeft;
    this._currentX = pageX - this._gBCR.left;

    this._rAF = requestAnimationFrame(this._animate);

    this._eventTarget.classList.add('double-slider_control--active');

    evt.preventDefault();
  }

  _onMove (evt) {
    if (!this._eventTarget)
      return;

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._currentX = pageX - this._gBCR.left;
  }

  _onEnd (evt) {
    if (!this._eventTarget)
      return;

    this._eventTarget.classList.remove('double-slider_control--active');
    this._eventTarget = null;
    cancelAnimationFrame(this._rAF);

    this._removeEventListeners();
  }

  // utils
  _onResize () {
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(_ => {
      this._gBCR = this.root.getBoundingClientRect();
      this._render();
    }, 250);
  }

  _animate () {
    this._rAF = requestAnimationFrame(this._animate);

    if (!this._eventTarget)
      return;

    this._setState({
      [this._knob]: this._currentX / this._gBCR.width
    });
  }

  _render () {
    const { width } = this._gBCR;
    const { max, min } = this._state;

    this.controls.max.style.transform =
      `translateX(${max * width}px) translate(-50%, -50%)`;
    this.controls.min.style.transform =
      `translateX(${min * width}px) translate(-50%, -50%)`;
    this.track.style.transform =
      `translateX(${min * width}px) scaleX(${max - min})`;
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
      if (value > 1) {
        return 1;
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