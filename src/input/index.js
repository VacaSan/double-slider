class Input {
  constructor (id, props) {
    this.component = document.getElementById(id);
    this.props = props;

    this._handleInput = this._handleInput.bind(this);

    this._addEventListeners();
  }

  _addEventListeners () {
    this.component.addEventListener('input', this._handleInput);
  }

  set value (val) {
    this.component.value = val;
  }

  get value () {
    return this.component.value;
  }

  _handleInput (evt) {
    const value = parseInt(evt.target.value);

    if (Number.isNaN(value))
      return;

    this.props.onChange({
      [this.props.name]: evt.target.value
    });
  }
}

export default Input;