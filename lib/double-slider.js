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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DoubleSlider = function () {
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

    this._init();
    this._setInitialState();
    this._cacheDOM();
    this._render();
  }

  _createClass(DoubleSlider, [{
    key: '_init',
    value: function _init() {
      window.addEventListener('resize', this._onResize);
      this.root.addEventListener('touchstart', this._onStart);
      this.root.addEventListener('mousedown', this._onStart);
    }
  }, {
    key: '_setInitialState',
    value: function _setInitialState() {
      this._gBCR = this.root.getBoundingClientRect();

      this._state = {
        min: 0,
        max: 1,
        range: 10
      };
    }
  }, {
    key: '_cacheDOM',
    value: function _cacheDOM() {
      this.track = this.root.querySelector('.js-double-slider_track');
      this.controls = {
        min: this.root.querySelector('[data-controls="min"]'),
        max: this.root.querySelector('[data-controls="max"]')
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

      this._knob = evt.target.getAttribute('data-controls');
      this._eventTarget = this.controls[this._knob];
      this._gBCR = this.root.getBoundingClientRect();

      var pageX = evt.pageX || evt.touches[0].pageX;
      this._left = this._eventTarget.offsetLeft;
      this._currentX = pageX - this._gBCR.left;

      this._rAF = requestAnimationFrame(this._animate);

      this._eventTarget.classList.add('double-slider_control--active');

      evt.preventDefault();
    }
  }, {
    key: '_onMove',
    value: function _onMove(evt) {
      if (!this._eventTarget) return;

      var pageX = evt.pageX || evt.touches[0].pageX;
      this._currentX = pageX - this._gBCR.left;
    }
  }, {
    key: '_onEnd',
    value: function _onEnd(evt) {
      if (!this._eventTarget) return;

      this._eventTarget.classList.remove('double-slider_control--active');
      this._eventTarget = null;
      cancelAnimationFrame(this._rAF);

      this._removeEventListeners();
    }

    // utils

  }, {
    key: '_onResize',
    value: function _onResize() {
      var _this = this;

      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(function (_) {
        _this._gBCR = _this.root.getBoundingClientRect();
        _this._render();
      }, 250);
    }
  }, {
    key: '_animate',
    value: function _animate() {
      this._rAF = requestAnimationFrame(this._animate);

      if (!this._eventTarget) return;

      this._setState(_defineProperty({}, this._knob, this._currentX / this._gBCR.width));
    }
  }, {
    key: '_render',
    value: function _render() {
      var width = this._gBCR.width;
      var _state = this._state,
          max = _state.max,
          min = _state.min;


      this.controls.max.style.transform = 'translateX(' + max * width + 'px) translate(-50%, -50%)';
      this.controls.min.style.transform = 'translateX(' + min * width + 'px) translate(-50%, -50%)';
      this.track.style.transform = 'translateX(' + min * width + 'px) scaleX(' + (max - min) + ')';
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
        if (value > 1) {
          return 1;
        } else if (value < this._state.min) return this._state.min;else return value;
      } else return value;
    }
  }, {
    key: 'value',
    get: function get() {
      var _state2 = this._state,
          min = _state2.min,
          max = _state2.max,
          range = _state2.range;


      return {
        min: Math.round(range * min),
        max: Math.round(range * max),
        range: range
      };
    },
    set: function set(data) {
      var width = this._gBCR.width;


      var range = data.range || this._state.range;
      var min = DoubleSlider.hasValue(data.min) ? data.min / range : this._state.min;
      var max = data.max ? data.max / range : this._state.max;

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
});