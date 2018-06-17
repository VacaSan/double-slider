import template from './template';

const KEY_IDS = {
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
};

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
    this.layout();
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
    this._onKeydown = this._onKeydown.bind(this);
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
        knob.addEventListener('touchstart', this._onStart);
        knob.addEventListener('keydown', this._onKeydown);
      });
    window.addEventListener('resize', this._onResize);

    this._target = null;
    this._state = {};

    this.layout();
  }

  /**
   * Recomputes the dimensions and re-lays out the component.
   */
  layout() {
    const {min, max} = this.root.dataset;
    this._gBCR = this.root.getBoundingClientRect();
    this.value = {
      min: min || 0,
      max: max || this.range,
    };
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
    this._target.classList.add('active');

    const pageX = evt.pageX || evt.touches[0].pageX;
    this._currentX = pageX - this._gBCR.left;
    this._addEventListeners();
    window.requestAnimationFrame(this._animate);
    // We don't want user to be able to scroll while using the slider.
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
    // Dispatch slider:input event.
    this._dispatch('slider:input');
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
    // Dispatch slider:change event.
    this._dispatch('slider:change');
  }

  /**
   * Resize event handler. Fires after the resize has finished.
   * https://css-tricks.com/snippets/jquery/done-resizing-event/
   */
  _onResize() {
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(() => {
      this.layout();
    }, 250);
  }

  /**
   * Keydown event handler.
   *
   * @param {Event} evt
   */
  _onKeydown(evt) {
    const keyId = KEY_IDS[evt.key];

    if (!keyId) {
      return;
    }

    // Prevent page from scrolling due to key presses that would normally
    // scroll the page
    evt.preventDefault();
    const name = evt.target.dataset.controls;
    const value = this._getValueForKey(keyId, name);
    this._setState({
      [name]: value,
    });
    // Dispatch events.
    this._dispatch('slider:input');
    this._dispatch('slider:change');
  }

  /**
   * Computes a value for the given name, based on a keyboard key ID.
   *
   * @param {String} keyId
   * @param {String} name
   * @return {Number}
   */
  _getValueForKey(keyId, name) {
    const value = this._state[name];

    switch (keyId) {
      case KEY_IDS.ArrowLeft:
      case KEY_IDS.ArrowDown:
        return value - 0.01;
      case KEY_IDS.ArrowRight:
      case KEY_IDS.ArrowUp:
        return value + 0.01;
      case KEY_IDS.PageDown:
        return value - 0.1;
      case KEY_IDS.PageUp:
        return value + 0.1;
      case KEY_IDS.Home:
        return 0;
      case KEY_IDS.End:
        return 1;
      default:
        return value;
    }
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
    this._setAriaAttributes();

    this.knob.max.style.transform =
      `translateX(${max * width}px) translate(-50%, -50%)`;
    this.knob.min.style.transform =
      `translateX(${min * width}px) translate(-50%, -50%)`;
    this.track.style.transform =
      `translateX(${min * width}px) scaleX(${max - min})`;
  }

  /**
   * Convinience method for setting the aria attributes.
   * https://www.w3.org/TR/wai-aria-practices-1.1/#slidertwothumb
   */
  _setAriaAttributes() {
    const {min, max} = this.value;
    const range = this.range;

    this.knob.max.setAttribute('aria-valuemin', min);
    this.knob.max.setAttribute('aria-valuenow', max);
    this.knob.max.setAttribute('aria-valuemax', range);
    this.knob.min.setAttribute('aria-valuemin', 0);
    this.knob.min.setAttribute('aria-valuenow', min);
    this.knob.min.setAttribute('aria-valuemax', max);
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
    const evt = new CustomEvent(typeArg, {bubbles: true, detail: this});
    this.root.dispatchEvent(evt);
  }

  /**
   * Convinience method for attaching event handlers to the document object.
   */
  _addEventListeners() {
    document.addEventListener('mousemove', this._onMove);
    document.addEventListener('mouseup', this._onEnd);
    // touch event handlers
    document.addEventListener('touchmove', this._onMove);
    document.addEventListener('touchend', this._onEnd);
    document.addEventListener('touchcancel', this._onEnd);
  }

  /**
   * Convinience method for removing event handlers from the document.
   */
  _removeEventListeners() {
    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('mouseup', this._onEnd);
    // touch event handlers
    document.removeEventListener('touchmove', this._onMove);
    document.removeEventListener('touchend', this._onEnd);
    document.removeEventListener('touchcancel', this._onEnd);
  }

  /**
   * Convinience methdo for attaching the event handler to the root element.
   */
  addEventListener(...args) {
    this.root.addEventListener(...args);
  }

  /**
   * Convinience methdo for removing the event handler from the root element.
   */
  removeEventListener(...args) {
    this.root.removeEventListener(...args);
  }
}

export default DoubleSlider;
