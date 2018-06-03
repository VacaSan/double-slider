import template from './template';

/**
 * DoubleSlider component
 */
class DoubleSlider {
  /**
   * @param {Element} root Root node that holds the slider
   */
  constructor(root) {
    this.root = root;
    this.root.innerHTML = template;

    this._animate = this._animate.bind(this);
    this._checkRange = this._checkRange.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onStart = this._onStart.bind(this);
    this._addEventListeners = this._addEventListeners.bind(this);
    this._removeEventListeners = this._removeEventListeners.bind(this);

    this._cacheDOM();
    this._bindEvents();
    this._setInitialState();
  }

  /**
   * Bind necessary event handlers.
   * @return {void}
   */
  _bindEvents() {
    window.addEventListener('resize', this._onResize);
    this.root.addEventListener('touchstart', this._onStart);
    this.root.addEventListener('mousedown', this._onStart);
  }

  /**
   * Normalizes the number.
   * @param {number} value Number to be normalized.
   * @return {number} Normalized value.
   */
  normalize(value) {
    return (value / this._range);
  }

  /**
   * Denoramlizes the number.
   * @param {number} value Number to be denormalized.
   * @return {number} Denormalized value.
   */
  denormalize(value) {
    return Math.round(value * this._range);
  }

  /**
   * Set the initial state of the component
   * @return {void}
   */
  _setInitialState() {
    this._state = {};
    this._gBCR = this.root.getBoundingClientRect();
    const {min, max, range} = this.root.dataset;

    this._range = parseInt(range);

    this.setState({
      min: this.normalize(parseInt(min)),
      max: this.normalize(parseInt(max)),
    });
  }

  /**
   * Stores the references to the dom elements
   * @return {void}
   */
  _cacheDOM() {
    this.track = this.root.querySelector('.js-double-slider_track');
    this.controls = {};
    Array.from(this.root.querySelectorAll('[data-controls]'))
      .forEach((knob) => {
        this.controls[knob.dataset.name] = knob;
      });
  }

  /**
   * Attaches the event listeners
   * @return {void}
   */
  _addEventListeners() {
    document.addEventListener('touchmove', this._onMove);
    document.addEventListener('touchend', this._onEnd);
    document.addEventListener('touchcancel', this._onEnd);

    document.addEventListener('mousemove', this._onMove);
    document.addEventListener('mouseup', this._onEnd);
  }

  /**
   * Removes the event listeners.
   * @return {void}
   */
  _removeEventListeners() {
    document.removeEventListener('touchmove', this._onMove);
    document.removeEventListener('touchend', this._onEnd);
    document.removeEventListener('touchcancel', this._onEnd);

    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('mouseup', this._onEnd);
  }

  /**
   * Touchstart event handler.
   * @param {Event} evt
   * @return {void}
   */
  _onStart(evt) {
    if (this._eventTarget) {
      return;
    }

    if (!evt.target.classList.contains('js-knob')) {
      return;
    }

    this._addEventListeners();

    this._knob = evt.target.getAttribute('data-controls');
    this._eventTarget = this.controls[this._knob];
    this._gBCR = this.root.getBoundingClientRect();

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._left = this._eventTarget.offsetLeft;
    this._currentX = pageX - this._gBCR.left;

    this._rAF = requestAnimationFrame(this._animate);

    evt.preventDefault();
  }

  /**
   * Touchmove event handler.
   * @param {Event} evt
   * @return {void}
   */
  _onMove(evt) {
    if (!this._eventTarget) {
      return;
    }

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._currentX = pageX - this._gBCR.left;
  }

    /**
   * Touchend event handler.
   * @param {Event} evt
   * @return {void}
   */
  _onEnd(evt) {
    if (!this._eventTarget) {
      return;
    }

    this._eventTarget = null;
    cancelAnimationFrame(this._rAF);

    this._removeEventListeners();
  }

  /**
   * Resize handler.
   * @return {void}
   */
  _onResize() {
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(() => {
      this._gBCR = this.root.getBoundingClientRect();
      this._render();
    }, 250);
  }

  /**
   * Updates the state with the current position
   * @return {void}
   */
  _animate() {
    this._rAF = requestAnimationFrame(this._animate);

    if (!this._eventTarget) {
      return;
    }

    this.setState({
      [this._knob]: this._currentX / this._gBCR.width,
    });
  }

  /**
   * Updates the component
   * @return {void}
   */
  _render() {
    const {width} = this._gBCR;
    const {max, min, range} = this._state;

    this.root.dataset.min = this.denormalize(min);
    this.root.dataset.max = this.denormalize(max);
    this.root.dataset.range = range;

    this.controls.max.style.transform =
      `translateX(${max * width}px) translate(-50%, -50%)`;
    this.controls.min.style.transform =
      `translateX(${min * width}px) translate(-50%, -50%)`;
    this.track.style.transform =
      `translateX(${min * width}px) scaleX(${max - min})`;
  }

  /**
   * Updates the current state of the component
   * @param {Object} data State object
   * @param {number} data.min Min value.
   * @param {number} data.max Max value.
   * @param {number} data.range Range value.
   */
  setState(data) {
    let nextState = DoubleSlider.map(data, this._checkRange);
    this._state = Object.assign({}, this._state, nextState);
    this._render();
  }

  /**
   * Mapping function.
   * Checks if value is in range
   * @param {number} value Property value
   * @param {string} key Property name
   * @return {number}
   */
  _checkRange(value, key) {
    const range = {
      min: {
        MINIMUM: 0,
        MAXIMUM: this._state.max || 1,
      },
      max: {
        MINIMUM: this._state.min || 0,
        MAXIMUM: 1,
      },
    };

    return Math.max(range[key].MINIMUM,
      Math.min(value, range[key].MAXIMUM));
  }

  /**
   * Maps over object properties
   * @param {Object} obj Object to iterate over.
   * @param {Function} fn Mapping function.
   * @return {Object}
   */
  static map(obj, fn) {
    const res = {};
    Object.keys(obj).forEach((key) => {
      res[key] = fn(obj[key], key);
    });
    return res;
  }
}

export default DoubleSlider;
