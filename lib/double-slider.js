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


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _template = __webpack_require__(1);

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    this.root.innerHTML = _template2.default;

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
      return value / this._range;
    }

    /**
     * Denoramlizes the number.
     * @param {number} value Number to be denormalized.
     * @return {number} Denormalized value.
     */

  }, {
    key: 'denormalize',
    value: function denormalize(value) {
      return Math.round(value * this._range);
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


      this._range = range;

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
      var _this = this;

      this.track = this.root.querySelector('.js-double-slider_track');
      this.controls = {};
      Array.from(this.root.querySelectorAll('[data-controls]')).forEach(function (knob) {
        _this.controls[knob.dataset.name] = knob;
      });
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
      this._gBCR = this.root.getBoundingClientRect();

      var pageX = evt.pageX || evt.touches[0].pageX;
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
      var _this2 = this;

      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(function () {
        _this2._gBCR = _this2.root.getBoundingClientRect();
        _this2._render();
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

exports.default = DoubleSlider;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _style = __webpack_require__(2);

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <div class="' + _style2.default + '">\n    <div class="' + _style2.default.trackWrap + '">\n      <div class="' + _style2.default.track + ' js-double-slider_track"></div>\n    </div>\n    <div class="' + _style2.default.control + ' js-knob"\n      data-controls="min"\n      data-name="min"\n      tabindex="0"\n      >\n      <div class="' + _style2.default.controlKnob + '"></div>\n    </div>\n    <div class="' + _style2.default.control + ' js-knob"\n      data-controls="max"\n      data-name="max"\n      tabindex="0"\n      >\n      <div class="' + _style2.default.controlKnob + '"></div>\n    </div>\n  </div>\n';

exports.default = template;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _injectedCss = __webpack_require__(3);

var style = _injectedCss.css.inject({
  _css: '.c-src{ position: relative; width: 100%; height: 48px } .c-src-trackWrap { position: absolute; top: 50%; width: 100%; height: 2px; background-color: rgba(0, 0, 0, .26); -webkit-transform: translateY(-50%); transform: translateY(-50%); overflow: hidden; } .c-src-track { position: absolute; width: 100%; height: 100%; -webkit-transform-origin: left top; transform-origin: left top; background-color: #3F51B5; -webkit-transform: scaleX(0) translateX(0); transform: scaleX(0) translateX(0); } .c-src-control { position: absolute; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; -webkit-box-align: center; -ms-flex-align: center; align-items: center; top: 50%; left: 0; width: 42px; height: 42px; background-color: transparent; -webkit-transform: translateX(0) translate(-50%, -50%); transform: translateX(0) translate(-50%, -50%); cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; outline: none; } .c-src-controlKnob { width: 21px; height: 21px; border-radius: 50%; background-color: #3F51B5; -webkit-transform: scale(0.571); transform: scale(0.571); -webkit-transition: -webkit-transform 100ms ease-out; transition: -webkit-transform 100ms ease-out; transition: transform 100ms ease-out; transition: transform 100ms ease-out, -webkit-transform 100ms ease-out; pointer-events: none; will-change: transform; } .c-src-control:active .c-src-controlKnob, .c-src-control:focus .c-src-controlKnob { -webkit-transform: scale(1); transform: scale(1); }',
  _hash: "955004979-1",
  toString: function toString() {
    return "c-src";
  },
  "trackWrap": "c-src-trackWrap",
  "track": "c-src-track",
  "control": "c-src-control",
  "controlKnob": "c-src-controlKnob"
});

exports.default = style;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inject = inject;
exports.css = css;
/**
 * Detect server render.
 */

var isServer = typeof window === 'undefined';
var styles = {};
var flush = exports.flush = function flush() {
  var ret = Object.keys(styles).map(function (key) {
    return styles[key];
  });
  styles = {};
  return ret;
};

/**
 * Cache style tags to avoid double injection.
 */

var styleTags = {};

/**
 * Inject css object (result of babel compilation) to dom.
 *
 * @param {Object|string} obj
 * @return {Object|string}
 */

function inject(obj) {
  var str = typeof obj === 'string' ? obj : obj._css;
  var hash = typeof obj === 'string' ? stringHash(str) : obj._hash;

  if (isServer) {
    return new Proxy(obj, {
      get: function get(target, prop, receiver) {
        if (prop !== '_css' && !styles[hash]) styles[hash] = str;
        return target[prop];
      }
    });
  }

  if (styleTags[hash]) {
    var tag = styleTags[hash];
    tag.innerHTML = str;
  } else {
    var _tag = document.createElement('style');
    _tag.appendChild(document.createTextNode(str));
    styleTags[hash] = _tag;

    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(_tag);
  }

  return obj;
}

/**
 * Placeholder for babel compiler.
 */

function css() {
  throw new Error('Please transform your code with "injected-css/babel"');
}
css.inject = inject;

/**
 * A fast string hashing function,
 * copied from https://github.com/darkskyapp/string-hash
 *
 * @param {string} str
 * @return {number} 0..4294967295
 */

function stringHash(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = hash * 33 ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

/***/ })
/******/ ]);
});