import Range from '../range';
import Input from '../input';
import { map } from '../utils';

class ComponentWrapper {
  constructor () {
    this.range = new Range('js-range', {
      onChange: this._handleChange.bind(this)
    });
    this.min = new Input('js-input__min', {
      name: 'min',
      onChange: this._handleChange.bind(this)
    });
    this.max = new Input('js-input__max', {
      name: 'max',
      onChange: this._handleChange.bind(this)
    });

    // TMP
    this.update(450);
  }

  // interface
  update (range) {
    const rangeNum = parseInt(range, 10);

    this._setState({
      min: 0,
      max: rangeNum,
      range: rangeNum
    });
  }

  _handleChange (data) {
    let nextState = map(data, this._checkRange.bind(this));
    this._setState(nextState);
  }

  _setState (obj) {
    this._state = Object.assign({}, this._state, obj);
    this._render();
  }

  _render () {
    this.range.value = this._state;
    this.min.value = this._state.min;
    this.max.value = this._state.max;
  }

  // TODO figure out how to do this better
  _checkRange (value, key) {
    if (key === 'min') {
      if (value < 0)
        return 0;
      else if (value > this._state.max)
        return this._state.max;
      else
        return value;
    }
    else if (key === 'max') {
      if (value > this._state.range) {
        return this._state.range;
      }
      else if (value < this._state.min)
        return this._state.min;
      else
        return value;
    }
    else
      return value;
  }
}

export default ComponentWrapper;