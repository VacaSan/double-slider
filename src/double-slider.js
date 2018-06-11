import template from './template';

/**
 * @typedef {Object} State
 * @property {number} min - The min value.
 * @property {number} max - The max value.
 */

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
   * @return {State} - Denormalized state.
   */
  get value() {
    const {min, max} = this._state;
    return {
      min: this.denormalize(min),
      max: this.denormalize(max),
    };
  }

  /**
   * Normalizes the passed object, and updates the local state.
   *
   * @param {State} partialState
   */
  set value(partialState) {
    let _partialState = {};
    Object.keys(partialState)
      .forEach((key) => {
        const value = partialState[key];
        _partialState[key] = this.normalize(parseInt(value));
      });
    this._setState(_partialState);
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

    this._target = null;
    this._state = {
      min: 0,
      max: 1,
    };


    this._init();
  }

  /**
   * Sets initial state.
   */
  _init() {
    const {min, max} = this.root.dataset;
    this._gBCR = this.root.getBoundingClientRect();
    this.value = {min,max};
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
    // In firefox element doesn't get focus on click, hence this.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=606011
    this._target.classList.add('active');

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._currentX = pageX - this._gBCR.left;
    this._addEventListeners();
    window.requestAnimationFrame(this._animate);
    evt.preventDefault();
    // Dispatch sliderstart event.
    this._dispatch('sliderstart');
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
    // Dispatch slidermove event.
    this._dispatch('slidermove');
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

    this._target.classList.remove('active');
    this._target = null;
    this._removeEventListeners();
    // Dispatch sliderend event.
    this._dispatch('sliderend');
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
   * @param {State} partialState
   */
  _setState(partialState) {
    const validState = this._validateState(partialState);
    this._state = Object.assign({}, this._state, validState);
    this._render();
  }

  /**
   * Clamps the values to fit the range.
   *
   * @param {State} partialState - State to check.
   * @return {State} - valid state.
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
    const {min, max} = this._state;
    const range = {
      min: {
        MINIMUM: 0,
        MAXIMUM: max || 1,
      },
      max: {
        MINIMUM: min || 0,
        MAXIMUM: 1,
      },
    };

    return Math.max(range[key].MINIMUM,
      Math.min(value, range[key].MAXIMUM));
  }

  /**
   * Convinience method for dispatching event.
   *
   * @param {String} typeArg - A DOMString representing the name of the event.
   */
  _dispatch(typeArg) {
    const evt = new CustomEvent(typeArg, {bubbles: true, detail: this.value});
    this.root.dispatchEvent(evt);
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

  /**
   * Convinience methdo for attaching the event handler to the root element.
   */
  addEventListener() {
    const args = Array.from(arguments);
    this.root.addEventListener(...args);
  }

  /**
   * Convinience methdo for removing the event handler from the root element.
   */
  removeEventListener() {
    const args = Array.from(arguments);
    this.root.removeEventListener(...args);
  }
}

export default DoubleSlider;
