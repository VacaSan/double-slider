function createStore<T extends {}>(initialState: T) {
  let state: T = initialState;
  let listeners: Array<(state: T) => void> = [];

  function setState(partial: Partial<T> | ((state: T) => Partial<T>)) {
    const update = typeof partial === "function" ? partial(state) : partial;

    const shouldUpdate = Object.keys(update).reduce((acc, key) => {
      return (
        acc ||
        update[key as keyof typeof update] !== state[key as keyof typeof update]
      );
    }, false);

    if (!shouldUpdate) return;

    const prevState = Object.assign({}, state);
    state = Object.assign({}, state, update);

    listeners.forEach(fn => fn(state));
  }

  function getState() {
    return state;
  }

  function forceUpdate() {
    listeners.forEach(fn => fn(state));
  }

  function connect(fn: (state: T) => void) {
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
