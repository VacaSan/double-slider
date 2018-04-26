(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("double-slider", [], factory);
	else if(typeof exports === 'object')
		exports["double-slider"] = factory();
	else
		root["double-slider"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * DoubleSlider component
 */
var DoubleSlider = function () {
  /**
   * @param {Element} root Root node that holds the slider
   */
  function DoubleSlider(root) {
    _classCallCheck(this, DoubleSlider);

    this.root = root;

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


  _createClass(DoubleSlider, [{
    key: '_bindEvents',
    value: function _bindEvents() {
      window.addEventListener('resize', this._onResize);
      this.root.addEventListener('touchstart', this._onStart);
      this.root.addEventListener('mousedown', this._onStart);
    }

    /**
     * Normalizes the number.
     * @param {number} value Number to be normalized.
     * @return {number} Normalized value.
     */

  }, {
    key: 'normalize',
    value: function normalize(value) {
      return value / this._state.range;
    }

    /**
     * Denoramlizes the number.
     * @param {number} value Number to be denormalized.
     * @return {number} Denormalized value.
     */

  }, {
    key: 'denormalize',
    value: function denormalize(value) {
      return Math.round(value * this._state.range);
    }

    /**
     * Set the initial state of the component
     * @return {void}
     */

  }, {
    key: '_setInitialState',
    value: function _setInitialState() {
      this._state = {};
      this._gBCR = this.root.getBoundingClientRect();
      var _root$dataset = this.root.dataset,
          min = _root$dataset.min,
          max = _root$dataset.max,
          range = _root$dataset.range;


      this._state.range = range;

      this.setState({
        min: this.normalize(parseInt(min)),
        max: this.normalize(parseInt(max))
      });
    }

    /**
     * Stores the references to the dom elements
     * @return {void}
     */

  }, {
    key: '_cacheDOM',
    value: function _cacheDOM() {
      this.track = this.root.querySelector('.js-double-slider_track');
      this.controls = {
        min: this.root.querySelector('[data-controls="min"]'),
        max: this.root.querySelector('[data-controls="max"]')
      };
    }

    /**
     * Attaches the event listeners
     * @return {void}
     */

  }, {
    key: '_addEventListeners',
    value: function _addEventListeners() {
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

  }, {
    key: '_removeEventListeners',
    value: function _removeEventListeners() {
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

  }, {
    key: '_onStart',
    value: function _onStart(evt) {
      if (this._eventTarget) {
        return;
      }

      if (!evt.target.classList.contains('js-knob')) {
        return;
      }

      this._addEventListeners();

      this._knob = evt.target.getAttribute('data-controls');
      this._eventTarget = this.controls[this._knob];
      // this._gBCR = this.root.getBoundingClientRect();

      var pageX = evt.pageX || evt.touches[0].pageX;
      this._left = this._eventTarget.offsetLeft;
      this._currentX = pageX - this._gBCR.left;

      this._rAF = requestAnimationFrame(this._animate);

      this._eventTarget.classList.add('double-slider_control--active');

      evt.preventDefault();
    }

    /**
     * Touchmove event handler.
     * @param {Event} evt
     * @return {void}
     */

  }, {
    key: '_onMove',
    value: function _onMove(evt) {
      if (!this._eventTarget) {
        return;
      }

      var pageX = evt.pageX || evt.touches[0].pageX;
      this._currentX = pageX - this._gBCR.left;
    }

    /**
    * Touchend event handler.
    * @param {Event} evt
    * @return {void}
    */

  }, {
    key: '_onEnd',
    value: function _onEnd(evt) {
      if (!this._eventTarget) {
        return;
      }

      this._eventTarget.classList.remove('double-slider_control--active');
      this._eventTarget = null;
      cancelAnimationFrame(this._rAF);

      this._removeEventListeners();
    }

    /**
     * Resize handler.
     * @return {void}
     */

  }, {
    key: '_onResize',
    value: function _onResize() {
      var _this = this;

      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(function () {
        _this._gBCR = _this.root.getBoundingClientRect();
        _this._render();
      }, 250);
    }

    /**
     * Updates the state with the current position
     * @return {void}
     */

  }, {
    key: '_animate',
    value: function _animate() {
      this._rAF = requestAnimationFrame(this._animate);

      if (!this._eventTarget) {
        return;
      }

      this.setState(_defineProperty({}, this._knob, this._currentX / this._gBCR.width));
    }

    /**
     * Updates the component
     * @return {void}
     */

  }, {
    key: '_render',
    value: function _render() {
      var width = this._gBCR.width;
      var _state = this._state,
          max = _state.max,
          min = _state.min,
          range = _state.range;


      this.root.dataset.min = this.denormalize(min);
      this.root.dataset.max = this.denormalize(max);
      this.root.dataset.range = range;

      this.controls.max.style.transform = 'translateX(' + max * width + 'px) translate(-50%, -50%)';
      this.controls.min.style.transform = 'translateX(' + min * width + 'px) translate(-50%, -50%)';
      this.track.style.transform = 'translateX(' + min * width + 'px) scaleX(' + (max - min) + ')';
    }

    /**
     * Updates the current state of the component
     * @param {Object} data State object
     * @param {number} data.min Min value.
     * @param {number} data.max Max value.
     * @param {number} data.range Range value.
     */

  }, {
    key: 'setState',
    value: function setState(data) {
      var nextState = DoubleSlider.map(data, this._checkRange);
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

  }, {
    key: '_checkRange',
    value: function _checkRange(value, key) {
      var range = {
        min: {
          MINIMUM: 0,
          MAXIMUM: this._state.max
        },
        max: {
          MINIMUM: this._state.min,
          MAXIMUM: 1
        }
      };

      if (key === 'range') {
        return value;
      }

      if (value < range[key].MINIMUM) {
        return range[key].MINIMUM;
      } else if (value > range[key].MAXIMUM) {
        return range[key].MAXIMUM;
      }
      return value;
    }

    /**
     * Maps over object properties
     * @param {Object} obj Object to iterate over.
     * @param {Function} fn Mapping function.
     * @return {Object}
     */

  }], [{
    key: 'map',
    value: function map(obj, fn) {
      var res = {};
      Object.keys(obj).forEach(function (key) {
        res[key] = fn(obj[key], key);
      });
      return res;
    }
  }]);

  return DoubleSlider;
}();

module.exports = DoubleSlider;

/***/ })
/******/ ]);
});