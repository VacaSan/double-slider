import Range from '../range';

class ComponentWrapper {
  constructor () {
    this.range = new Range('js-range', {
      onChange: this._handleChange.bind(this)
    });
  }

  // interface
  updata (data) {
    this.range.value = data;
  }

  _handleChange (data) {
    console.log(data);
  }
}

export default ComponentWrapper;