/**
 * Knob helper class defintion.
 */
class Knob {
  /**
   * @param {Number} value
   */
  set x(value) {
    this._x = value;
    this._render();
  }

  /**
   * @type {Number}
   */
  get x() {
    return this._x;
  }

  /**
   * Creates new Knob instance.
   *
   * @param {HTMLElement} host - knob element.
   */
  constructor(host) {
    this.host = host;
    this.name = host.dataset.name;
    this._callbacks = [];

    this._onFocus = this._onFocus.bind(this);

    this.host.addEventListener('pointerdown', this._onFocus);
  }

  /**
   * Focus event handler.
   *
   * @param {Event} evt
   */
  _onFocus(evt) {
    evt.preventDefault();
    this._callbacks.forEach((fn) => {
      fn(this);
    });
  }

  /**
   * Binds callback function to knob.
   *
   * @param {Function} callback - callback function that will
   * fire on knob use.
   */
  onUse(callback=function() {}) {
    this._callbacks.push(callback);
  }

  /**
   * Updates the knobs position.
   */
  _render() {
    this.host.style.transform = `translateX(${this.x}px) translate(-50%, -50%)`;
  }
}

export default Knob;
