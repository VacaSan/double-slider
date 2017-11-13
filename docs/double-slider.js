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


var _doubleSlider = __webpack_require__(1);

var _doubleSlider2 = _interopRequireDefault(_doubleSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.DoubleSlider = _doubleSlider2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DoubleSlider = function () {
  _createClass(DoubleSlider, null, [{
    key: 'template',
    value: function template(color, inverse) {
      return '\n      <div class="range">\n        <div\n          class="range__track-wrap"\n          ' + (inverse && 'style="background-color: rgba(255, 255, 255, .5);"') + '\n        >\n          <div\n            class="range__track js-range__track"\n            ' + (color && 'style="background-color: ' + color + ';"') + '\n          ></div>\n        </div>\n        <div class="range__control js-knob" data-controls="min">\n          <div\n            class="range__control-knob"\n            ' + (color && 'style="background-color: ' + color + ';"') + '\n          ></div>\n        </div>\n        <div class="range__control js-knob" data-controls="max">\n          <div\n            class="range__control-knob"\n            ' + (color && 'style="background-color: ' + color + ';"') + '\n          ></div>\n        </div>\n      </div>\n    ';
    }
  }, {
    key: 'styles',
    get: function get() {
      return '\n      .range {\n        position: relative;\n        width: 100%;\n        height: 48px;\n      }\n      .range__track-wrap {\n        position: absolute;\n        top: 50%;\n        width: 100%;\n        height: 2px;\n        background-color: rgba(0, 0, 0, .26);\n        transform: translateY(-50%);\n        overflow: hidden;\n      }\n      .range__track {\n        position: absolute;\n        width: 100%;\n        height: 100%;\n        transform-origin: left top;\n        background-color: #3F51B5;\n        transform: scaleX(0) translateX(0);\n      }\n      .range__control {\n        position: absolute;\n        display: -webkit-box;\n        display: -moz-box;\n        display: -ms-flexbox;\n        display: -webkit-flex;\n        display: flex;\n        -webkit-box-pack: center;\n        -moz-box-pack: center;\n        -webkit-justify-content: center;\n        -ms-flex-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        -moz-box-align: center;\n        -ms-flex-align: center;\n        -webkit-align-items: center;\n        align-items: center;\n        top: 50%;\n        left: 0;\n        width: 42px;\n        height: 42px;\n        background-color: transparent;\n        transform: translateX(0) translate(-50%, -50%);\n        cursor: pointer;\n        user-select: none;\n      }\n      .range__control-knob {\n        width: 21px;\n        height: 21px;\n        border-radius: 50%;\n        background-color: #3F51B5;\n        transform: scale(0.571);\n        transition: transform 100ms ease-out;\n        pointer-events: none;\n        will-change: transform;\n      }\n      .range__control--active .range__control-knob {\n        transform: scale(1);\n      }\n    ';
    }
  }]);

  function DoubleSlider(props) {
    _classCallCheck(this, DoubleSlider);

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

  _createClass(DoubleSlider, [{
    key: '_init',
    value: function _init(_ref) {
      var id = _ref.id,
          color = _ref.color,
          inverse = _ref.inverse;

      this.component = document.getElementById(id);
      this.component.innerHTML = DoubleSlider.template(color, inverse);

      window.addEventListener('resize', this._onResize);
      this.component.addEventListener('touchstart', this._onStart);
      this.component.addEventListener('mousedown', this._onStart);

      var hasStyles = document.getElementById('js-range-styles');

      if (hasStyles) return;

      var style = document.createElement('style');
      style.id = 'js-range-styles';
      style.innerHTML = DoubleSlider.styles;
      document.head.appendChild(style);
    }
  }, {
    key: '_setInitialState',
    value: function _setInitialState() {
      this._gBCR = this.component.getBoundingClientRect();

      this._state = {
        min: 0,
        max: this._gBCR.width,
        range: this._gBCR.width
      };
    }
  }, {
    key: '_cacheDOM',
    value: function _cacheDOM() {
      this.track = this.component.querySelector('.js-range__track');
      this.controls = {
        min: this.component.querySelector('[data-controls="min"]'),
        max: this.component.querySelector('[data-controls="max"]')
      };
    }
  }, {
    key: '_addEventListeners',
    value: function _addEventListeners() {
      document.addEventListener('touchmove', this._onMove);
      document.addEventListener('touchend', this._onEnd);
      document.addEventListener('touchcancel', this._onEnd);

      document.addEventListener('mousemove', this._onMove);
      document.addEventListener('mouseup', this._onEnd);
    }
  }, {
    key: '_removeEventListeners',
    value: function _removeEventListeners() {
      document.removeEventListener('touchmove', this._onMove);
      document.removeEventListener('touchend', this._onEnd);
      document.removeEventListener('touchcancel', this._onEnd);

      document.removeEventListener('mousemove', this._onMove);
      document.removeEventListener('mouseup', this._onEnd);
    }

    // getters/setters

  }, {
    key: '_onStart',


    // event handlerse
    value: function _onStart(evt) {
      if (this._eventTarget) return;

      if (!evt.target.classList.contains('js-knob')) return;

      this._addEventListeners();

      var pageX = evt.pageX || evt.touches[0].pageX;
      this._currentX = pageX - this._gBCR.left;
      this._knob = evt.target.getAttribute('data-controls');
      this._eventTarget = this.controls[this._knob];
      this._state[this._knob] = evt.pageX - this._gBCR.left;
      this._rAF = requestAnimationFrame(this._animate);

      this._eventTarget.classList.add('range__control--active');

      evt.preventDefault();

      if (this.props.onStart !== undefined) this.props.onStart(this.value);
    }
  }, {
    key: '_onMove',
    value: function _onMove(evt) {
      if (!this._eventTarget) return;

      var pageX = evt.pageX || evt.touches[0].pageX;
      this._currentX = pageX - this._gBCR.left;

      if (this.props.onMove !== undefined) this.props.onMove(this.value);
    }
  }, {
    key: '_onEnd',
    value: function _onEnd(evt) {
      if (!this._eventTarget) return;

      this._eventTarget.classList.remove('range__control--active');
      this._eventTarget = null;
      cancelAnimationFrame(this._rAF);

      this._removeEventListeners();

      if (this.props.onEnd !== undefined) this.props.onEnd(this.value);
    }

    // utils

  }, {
    key: '_onResize',
    value: function _onResize() {
      var _this = this;

      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(function (_) {
        _this._gBCR = _this.component.getBoundingClientRect();
      }, 250);
    }
  }, {
    key: '_animate',
    value: function _animate() {
      this._rAF = requestAnimationFrame(this._animate);

      if (!this._eventTarget) return;

      this._setState(_defineProperty({}, this._knob, this._currentX));
    }
  }, {
    key: '_render',
    value: function _render() {
      var _state = this._state,
          max = _state.max,
          min = _state.min;

      var trackWidth = (max - min) / this._gBCR.width;

      this.controls.max.style.transform = 'translateX(' + max + 'px) translate(-50%, -50%)';
      this.controls.min.style.transform = 'translateX(' + min + 'px) translate(-50%, -50%)';
      this.track.style.transform = 'translateX(' + min + 'px) scaleX(' + trackWidth + ')';
    }
  }, {
    key: '_toPx',
    value: function _toPx(val, range) {
      return val / range * this._gBCR.width; //px
    }
  }, {
    key: '_toValue',
    value: function _toValue(val) {
      return this._state.range * val / this._gBCR.width;
    }
  }, {
    key: '_setState',
    value: function _setState(obj) {
      var nextState = DoubleSlider.map(obj, this._checkRange);
      this._state = Object.assign({}, this._state, nextState);
      this._render();
    }

    // ugliest func ever

  }, {
    key: '_checkRange',
    value: function _checkRange(value, key) {
      if (key === 'min') {
        if (value < 0) return 0;else if (value > this._state.max) return this._state.max;else return value;
      } else if (key === 'max') {
        if (value > this._gBCR.width) {
          return this._gBCR.width;
        } else if (value < this._state.min) return this._state.min;else return value;
      } else return value;
    }
  }, {
    key: 'value',
    get: function get() {
      return {
        min: Math.round(this._toValue(this._state.min)),
        max: Math.round(this._toValue(this._state.max)),
        range: this._state.range
      };
    },
    set: function set(data) {
      var range = data.range || this._state.range;
      var min = DoubleSlider.hasValue(data.min) ? this._toPx(data.min, range) : this._state.min;
      var max = data.max ? this._toPx(data.max, range) : this._state.max;

      this._setState({
        range: range,
        min: min,
        max: max
      });
    }
  }], [{
    key: 'map',
    value: function map(obj, fn) {
      var res = {};
      Object.keys(obj).forEach(function (key) {
        res[key] = fn(obj[key], key);
      });
      return res;
    }
  }, {
    key: 'hasValue',
    value: function hasValue(value) {
      return value !== null && value !== undefined;
    }
  }]);

  return DoubleSlider;
}();

exports.default = DoubleSlider;
module.exports = exports['default'];

/***/ })
/******/ ]);