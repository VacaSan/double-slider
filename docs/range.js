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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = map;
function map(obj, fn) {
  var res = {};
  Object.keys(obj).forEach(function (key) {
    res[key] = fn(obj[key], key);
  });
  return res;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _componentWrapper = __webpack_require__(2);

var _componentWrapper2 = _interopRequireDefault(_componentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.slider = new _componentWrapper2.default();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _range = __webpack_require__(3);

var _range2 = _interopRequireDefault(_range);

var _input = __webpack_require__(4);

var _input2 = _interopRequireDefault(_input);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentWrapper = function () {
  function ComponentWrapper() {
    _classCallCheck(this, ComponentWrapper);

    this.range = new _range2.default('js-range', {
      onChange: this._handleChange.bind(this)
    });
    this.min = new _input2.default('js-input__min', {
      name: 'min',
      onChange: this._handleChange.bind(this)
    });
    this.max = new _input2.default('js-input__max', {
      name: 'max',
      onChange: this._handleChange.bind(this)
    });

    // TMP
    this.update(450);
  }

  // interface


  _createClass(ComponentWrapper, [{
    key: 'update',
    value: function update(range) {
      var rangeNum = parseInt(range, 10);

      this._setState({
        min: 0,
        max: rangeNum,
        range: rangeNum
      });
    }
  }, {
    key: '_handleChange',
    value: function _handleChange(data) {
      var nextState = (0, _utils.map)(data, this._checkRange.bind(this));
      this._setState(nextState);
    }
  }, {
    key: '_setState',
    value: function _setState(obj) {
      this._state = Object.assign({}, this._state, obj);
      this._render();
    }
  }, {
    key: '_render',
    value: function _render() {
      this.range.value = this._state;
      this.min.value = this._state.min;
      this.max.value = this._state.max;
    }

    // TODO figure out how to do this better

  }, {
    key: '_checkRange',
    value: function _checkRange(value, key) {
      if (key === 'min') {
        if (value < 0) return 0;else if (value > this._state.max) return this._state.max;else return value;
      } else if (key === 'max') {
        if (value > this._state.range) {
          return this._state.range;
        } else if (value < this._state.min) return this._state.min;else return value;
      } else return value;
    }
  }]);

  return ComponentWrapper;
}();

exports.default = ComponentWrapper;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Range = function () {
  function Range(id, props) {
    _classCallCheck(this, Range);

    this.props = props;
    // cache DOM
    this.component = document.getElementById(id);
    this.track = this.component.querySelector('.js-range__track');
    this.controls = {
      min: this.component.querySelector('[data-controls="min"]'),
      max: this.component.querySelector('[data-controls="max"]')
    };

    this._onStart = this._onStart.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._animate = this._animate.bind(this);
    this._checkRange = this._checkRange.bind(this);

    // TODO update on resize
    this._gBCR = this.component.getBoundingClientRect();
    this._eventTarget = null;
    this._knob = '';
    this._currentX = 0;
    this._state = {
      min: 0,
      max: this._gBCR.width,
      range: this._gBCR.width
    };

    this._addEventListeners();
    this._render();
  }

  // getters/setters


  _createClass(Range, [{
    key: '_addEventListeners',
    value: function _addEventListeners() {
      document.addEventListener('touchstart', this._onStart);
      document.addEventListener('touchmove', this._onMove);
      document.addEventListener('touchend', this._onEnd);

      document.addEventListener('mousedown', this._onStart);
      document.addEventListener('mousemove', this._onMove);
      document.addEventListener('mouseup', this._onEnd);
    }
  }, {
    key: '_onStart',
    value: function _onStart(evt) {
      if (this._eventTarget) return;

      if (!evt.target.classList.contains('js-knob')) return;

      var pageX = evt.pageX || evt.touches[0].pageX;
      this._currentX = pageX - this._gBCR.left;
      this._knob = evt.target.getAttribute('data-controls');
      this._eventTarget = this.controls[this._knob];
      this._state[this._knob] = evt.pageX - this._gBCR.left;
      this._rAF = requestAnimationFrame(this._animate);

      this._eventTarget.classList.add('range__control--active');
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

      this._eventTarget.classList.remove('range__control--active');
      this._eventTarget = null;
      cancelAnimationFrame(this._rAF);
      //TODO check when to call, here or in setState
      this.props.onChange(this.value);
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
      var nextState = (0, _utils.map)(obj, this._checkRange);
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
      var min = data.min ? this._toPx(data.min, range) : this._state.min;
      var max = data.max ? this._toPx(data.max, range) : this._state.max;

      this._setState({
        range: range,
        min: min,
        max: max
      });
    }
  }]);

  return Range;
}();

exports.default = Range;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Input = function () {
  function Input(id, props) {
    _classCallCheck(this, Input);

    this.component = document.getElementById(id);
    this.props = props;

    this._handleInput = this._handleInput.bind(this);

    this._addEventListeners();
  }

  _createClass(Input, [{
    key: '_addEventListeners',
    value: function _addEventListeners() {
      this.component.addEventListener('input', this._handleInput);
    }
  }, {
    key: '_handleInput',
    value: function _handleInput(evt) {
      var value = parseInt(evt.target.value);

      if (Number.isNaN(value)) return;

      this.props.onChange(_defineProperty({}, this.props.name, evt.target.value));
    }
  }, {
    key: 'value',
    set: function set(val) {
      this.component.value = val;
    },
    get: function get() {
      return this.component.value;
    }
  }]);

  return Input;
}();

exports.default = Input;

/***/ })
/******/ ]);