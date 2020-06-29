function createStore(initialState = {}) {
  let state = initialState;
  let listeners = [];

  function setState(partial, callback) {
    const update = typeof partial === "function" ? partial(state) : partial;

    const shouldUpdate = Object.keys(update).reduce((acc, key) => {
      return acc || update[key] !== state[key];
    }, false);

    if (!shouldUpdate) return;

    const prevState = Object.assign({}, state);
    state = Object.assign({}, state, update);

    listeners.forEach(fn => fn && fn(state));

    callback && callback(state, prevState);
  }

  function getState() {
    return state;
  }

  function forceUpdate() {
    listeners.forEach(fn => fn && fn(state));
  }

  function connect(fn) {
    listeners.push(fn);

    fn(state);

    return () => {
      const index = listeners.indexOf(fn);
      listeners.splice(index, 1);
    };
  }

  return Object.freeze({
    setState,
    getState,
    forceUpdate,
    connect,
  });
}

export { createStore };
