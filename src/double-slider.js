import template from './template';

/**
 * DoubleSlider component
 */
class DoubleSlider {
  /**
   * @return {Number}
   */
  get range() {
    const range = this.root.dataset.range;
    if (!range) {
      throw new Error('Range must be defined');
    }
    return parseInt(range);
  }

  /**
   * Should be only set from outside.
   *
   * @param {Number|String} value
   */
  set range(value) {
    const range = parseInt(value);
    this.root.dataset.range = range;
    this._init();
  }

  /**
   * Creates new DoubleSlider instance.
   *
   * @param {HTMLElement} root - Host element.
   */
  constructor(root) {
    this.root = root;
    this.root.innerHTML = template;

    // Bind methods to the instance.
    this._animate = this._animate.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onStart = this._onStart.bind(this);

    // Cache DOM, and bind event handlers.
    this.track = this.root.querySelector('.js-track');
    this.knob = {};
    Array.from(this.root.querySelectorAll('.js-knob'))
    .forEach((knob) => {
      // Hold a ref to the knob.
      this.knob[knob.dataset.controls] = knob;
      // Attach event handler to each knob.
      knob.addEventListener('mousedown', this._onStart);
    });
    window.addEventListener('resize', this._onResize);

    this._state = {};
    this._target = null;

    this._init();
  }

  /**
   * Sets initial state.
   */
  _init() {
    const {min, max} = this.root.dataset;
    this._gBCR = this.root.getBoundingClientRect();
    this.setState({
      min,
      max,
    });
  }

  /**
   * Touchstart/mousedown event handler.
   *
   * @param {Event} evt
   */
  _onStart(evt) {
    if (this._target) {
      return;
    }

    const name = evt.target.dataset.controls;
    this._target = this.knob[name];

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._currentX = pageX - this._gBCR.left;
    this._addEventListeners();
    window.requestAnimationFrame(this._animate);
    evt.preventDefault();
  }

  /**
   * Touchmove/mousemove event handler.
   *
   * @param {Event} evt
   */
  _onMove(evt) {
    if (!this._target) {
      return;
    }

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._currentX = pageX - this._gBCR.left;
  }

  /**
   * Touchend/touchcance/mouseup event handler.
   *
   * @param {Event} evt
   */
  _onEnd(evt) {
    if (!this._target) {
      return;
    }

    this._target = null;
    this._removeEventListeners();
  }

  /**
   * Resize event handler. Fires after the resize has finished.
   * https://css-tricks.com/snippets/jquery/done-resizing-event/
   */
  _onResize() {
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(() => {
      this._init();
    }, 250);
  }

  /**
   * Normalizes the value.
   *
   * @param {number} value - Number to be normalized.
   * @return {number} - Normalized value.
   */
  normalize(value) {
    return (value / this.range);
  }

  /**
   * Denoramlizes the value.
   *
   * @param {number} value - Number to be denormalized.
   * @return {number} - Denormalized value.
   */
  denormalize(value) {
    return Math.round(value * this.range);
  }

  /**
   * Updates the state based on the current position of the knob.
   */
  _animate() {
    if (!this._target) {
      return;
    }

    window.requestAnimationFrame(this._animate);
    const name = this._target.dataset.controls;
    this._setState({
      [name]: this._currentX / this._gBCR.width,
    });
  }

  /**
   * Updates the components view.
   *
   * @return {void}
   */
  _render() {
    const {min, max} = this._state;
    const {width} = this._gBCR;

    // Update data attributes.
    this.root.dataset.min = this.denormalize(min);
    this.root.dataset.max = this.denormalize(max);

    this.knob.max.style.transform =
      `translateX(${max * width}px) translate(-50%, -50%)`;
    this.knob.min.style.transform =
      `translateX(${min * width}px) translate(-50%, -50%)`;
    this.track.style.transform =
      `translateX(${min * width}px) scaleX(${max - min})`;
  }

  /**
   * Updates the current state of the component.
   * partialState is normalized.
   *
   * @private
   * @param {Object} partialState State object
   * @param {number} partialState.min Min value.
   * @param {number} partialState.max Max value.
   */
  _setState(partialState) {
    const validState = this._validateState(partialState);
    this._state = Object.assign({}, this._state, validState);
    this._render();
  }

  /**
   * Normalizes the passed object, and updates the local state.
   *
   * @public
   * @param {Object} partialState
   */
  setState(partialState) {
    let _partialState = {};
    Object.keys(partialState)
      .forEach((key) => {
        const value = partialState[key];
        _partialState[key] = this.normalize(parseInt(value));
      });
    this._setState(_partialState);
  }

  /**
   * Clamps the values to fit the range.
   *
   * @param {Object} partialState - State to check.
   * @return {Object} - valid state.
   */
  _validateState(partialState) {
    let validState = {};
    Object.keys(partialState)
      .forEach((key) => {
        const value = partialState[key];
        validState[key] = this._checkRange(value, key);
      });
    return validState;
  }

  /**
   * Checks if value is in range.
   *
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
   * Convinience method for attaching event handlers to the document object.
   */
  _addEventListeners() {
    document.addEventListener('mousemove', this._onMove);
    document.addEventListener('mouseup', this._onEnd);
  }

  /**
   * Convinience method for removing event handlers from the document.
   */
  _removeEventListeners() {
    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('mouseup', this._onEnd);
  }
}

export default DoubleSlider;
