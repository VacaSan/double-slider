class Mediator {
  constructor () {
    this.events = {};
  }

  subscribe (name, callback) {
    this.events[name] = this.events[name] || [];
    this.events[name].push(callback);
  }

  unsubsribe (name, callback) {
    if (this.events[name]) {
      this.events[name] = this.events[name].filter(fn => {
        fn !== callback;
      });
    }
  }

  publish (name, data) {
    if (this.events[name]) {
      this.events[name].forEach(fn => fn(data));
    }
  }
}

export default Mediator;