/******/ (function(modules) { // webpackBootstrap
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


var DoubleSlider = __webpack_require__(1);

window.DoubleSlider = DoubleSlider;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _template = __webpack_require__(2);

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * DoubleSlider component
 */
var DoubleSlider = function () {
  _createClass(DoubleSlider, [{
    key: 'range',

    /**
     * @return {Number}
     */
    get: function get() {
      var range = this.root.dataset.range;
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
    ,
    set: function set(value) {
      var range = parseInt(value);
      this.root.dataset.range = range;
      this._init();
    }

    /**
     * Creates new DoubleSlider instance.
     *
     * @param {HTMLElement} root - Host element.
     */

  }]);

  function DoubleSlider(root) {
    var _this = this;

    _classCallCheck(this, DoubleSlider);

    this.root = root;
    this.root.innerHTML = _template2.default;

    // Bind methods to the instance.
    this._animate = this._animate.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onStart = this._onStart.bind(this);

    // Cache DOM, and bind event handlers.
    this.track = this.root.querySelector('.js-track');
    this.knob = {};
    Array.from(this.root.querySelectorAll('.js-knob')).forEach(function (knob) {
      // Hold a ref to the knob.
      _this.knob[knob.dataset.controls] = knob;
      // Attach event handler to each knob.
      knob.addEventListener('mousedown', _this._onStart);
    });
    window.addEventListener('resize', this._onResize);

    this._state = {};
    this._target = null;

    this._init();
  }

  /**
   * Sets initial state.
   */


  _createClass(DoubleSlider, [{
    key: '_init',
    value: function _init() {
      var _root$dataset = this.root.dataset,
          min = _root$dataset.min,
          max = _root$dataset.max;

      this._gBCR = this.root.getBoundingClientRect();
      this.setState({
        min: min,
        max: max
      });
    }

    /**
     * Touchstart/mousedown event handler.
     *
     * @param {Event} evt
     */

  }, {
    key: '_onStart',
    value: function _onStart(evt) {
      if (this._target) {
        return;
      }

      var name = evt.target.dataset.controls;
      this._target = this.knob[name];
      // In firefox element doesn't get focus on click, hence this.
      // https://bugzilla.mozilla.org/show_bug.cgi?id=606011
      this._target.classList.add('active');

      var pageX = evt.pageX || evt.touches[0].pageX;
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

  }, {
    key: '_onMove',
    value: function _onMove(evt) {
      if (!this._target) {
        return;
      }

      var pageX = evt.pageX || evt.touches[0].pageX;
      this._currentX = pageX - this._gBCR.left;
    }

    /**
     * Touchend/touchcance/mouseup event handler.
     *
     * @param {Event} evt
     */

  }, {
    key: '_onEnd',
    value: function _onEnd(evt) {
      if (!this._target) {
        return;
      }

      this._target.classList.remove('active');
      this._target = null;
      this._removeEventListeners();
    }

    /**
     * Resize event handler. Fires after the resize has finished.
     * https://css-tricks.com/snippets/jquery/done-resizing-event/
     */

  }, {
    key: '_onResize',
    value: function _onResize() {
      var _this2 = this;

      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(function () {
        _this2._init();
      }, 250);
    }

    /**
     * Normalizes the value.
     *
     * @param {number} value - Number to be normalized.
     * @return {number} - Normalized value.
     */

  }, {
    key: 'normalize',
    value: function normalize(value) {
      return value / this.range;
    }

    /**
     * Denoramlizes the value.
     *
     * @param {number} value - Number to be denormalized.
     * @return {number} - Denormalized value.
     */

  }, {
    key: 'denormalize',
    value: function denormalize(value) {
      return Math.round(value * this.range);
    }

    /**
     * Updates the state based on the current position of the knob.
     */

  }, {
    key: '_animate',
    value: function _animate() {
      if (!this._target) {
        return;
      }

      window.requestAnimationFrame(this._animate);
      var name = this._target.dataset.controls;
      this._setState(_defineProperty({}, name, this._currentX / this._gBCR.width));
    }

    /**
     * Updates the components view.
     *
     * @return {void}
     */

  }, {
    key: '_render',
    value: function _render() {
      var _state = this._state,
          min = _state.min,
          max = _state.max;
      var width = this._gBCR.width;

      // Update data attributes.

      this.root.dataset.min = this.denormalize(min);
      this.root.dataset.max = this.denormalize(max);

      this.knob.max.style.transform = 'translateX(' + max * width + 'px) translate(-50%, -50%)';
      this.knob.min.style.transform = 'translateX(' + min * width + 'px) translate(-50%, -50%)';
      this.track.style.transform = 'translateX(' + min * width + 'px) scaleX(' + (max - min) + ')';
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

  }, {
    key: '_setState',
    value: function _setState(partialState) {
      var validState = this._validateState(partialState);
      this._state = Object.assign({}, this._state, validState);
      this._render();
    }

    /**
     * Normalizes the passed object, and updates the local state.
     *
     * @public
     * @param {Object} partialState
     */

  }, {
    key: 'setState',
    value: function setState(partialState) {
      var _this3 = this;

      var _partialState = {};
      Object.keys(partialState).forEach(function (key) {
        var value = partialState[key];
        _partialState[key] = _this3.normalize(parseInt(value));
      });
      this._setState(_partialState);
    }

    /**
     * Clamps the values to fit the range.
     *
     * @param {Object} partialState - State to check.
     * @return {Object} - valid state.
     */

  }, {
    key: '_validateState',
    value: function _validateState(partialState) {
      var _this4 = this;

      var validState = {};
      Object.keys(partialState).forEach(function (key) {
        var value = partialState[key];
        validState[key] = _this4._checkRange(value, key);
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

  }, {
    key: '_checkRange',
    value: function _checkRange(value, key) {
      var range = {
        min: {
          MINIMUM: 0,
          MAXIMUM: this._state.max || 1
        },
        max: {
          MINIMUM: this._state.min || 0,
          MAXIMUM: 1
        }
      };

      return Math.max(range[key].MINIMUM, Math.min(value, range[key].MAXIMUM));
    }

    /**
     * Convinience method for attaching event handlers to the document object.
     */

  }, {
    key: '_addEventListeners',
    value: function _addEventListeners() {
      document.addEventListener('mousemove', this._onMove);
      document.addEventListener('mouseup', this._onEnd);
    }

    /**
     * Convinience method for removing event handlers from the document.
     */

  }, {
    key: '_removeEventListeners',
    value: function _removeEventListeners() {
      document.removeEventListener('mousemove', this._onMove);
      document.removeEventListener('mouseup', this._onEnd);
    }
  }]);

  return DoubleSlider;
}();

exports.default = DoubleSlider;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _style = __webpack_require__(3);

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <div class="' + _style2.default + '">\n    <div class="' + _style2.default.trackWrap + '">\n      <div class="' + _style2.default.track + ' js-track"></div>\n    </div>\n    <div class="' + _style2.default.control + ' js-knob"\n      data-controls="min"\n      tabindex="0"\n      >\n      <div class="' + _style2.default.controlKnob + '"></div>\n    </div>\n    <div class="' + _style2.default.control + ' js-knob"\n      data-controls="max"\n      tabindex="0"\n      >\n      <div class="' + _style2.default.controlKnob + '"></div>\n    </div>\n  </div>\n';

exports.default = template;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _injectedCss = __webpack_require__(4);

var style = _injectedCss.css.inject({
  _css: '.c-src{ position: relative; width: 100%; height: 48px } .c-src-trackWrap { position: absolute; top: 50%; width: 100%; height: 2px; background-color: rgba(0, 0, 0, .26); -webkit-transform: translateY(-50%); transform: translateY(-50%); overflow: hidden } .inverse .c-src-trackWrap { background-color: rgba(255, 255, 255, .26); } .c-src-track { position: absolute; width: 100%; height: 100%; -webkit-transform-origin: left top; transform-origin: left top; background-color: currentColor; -webkit-transform: scaleX(0) translateX(0); transform: scaleX(0) translateX(0); will-change: transform; } .c-src-control { position: absolute; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; -webkit-box-align: center; -ms-flex-align: center; align-items: center; top: 50%; left: 0; width: 42px; height: 42px; background-color: transparent; -webkit-transform: translateX(0) translate(-50%, -50%); transform: translateX(0) translate(-50%, -50%); cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; outline: none; } .c-src-controlKnob { width: 21px; height: 21px; border-radius: 50%; background-color: currentColor; -webkit-transform: scale(0.571); transform: scale(0.571); -webkit-transition: -webkit-transform 100ms ease-out; transition: -webkit-transform 100ms ease-out; transition: transform 100ms ease-out; transition: transform 100ms ease-out, -webkit-transform 100ms ease-out; pointer-events: none; will-change: transform; } .c-src-control.active .c-src-controlKnob { -webkit-transform: scale(1); transform: scale(1); }',
  _hash: "1613996-1",
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
/* 4 */
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