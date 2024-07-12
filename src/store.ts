function createStore<T extends {}>(initialState: T) {
  const state: T = initialState;
  const listeners: Array<(s: T) => void> = [];

  function setState(partial: Partial<T> | ((s: T) => Partial<T>)) {
    const update = typeof partial === "function" ? partial(state) : partial;

    const shouldUpdate = Object.keys(update).reduce(
      (acc, key) =>
        acc ||
        update[key as keyof typeof update] !==
          state[key as keyof typeof update],
      false
    );

    if (!shouldUpdate) return;

    Object.assign(state, update);

    listeners.forEach(fn => fn(state));
  }

  function getState() {
    return state;
  }

  function connect(fn: (s: T) => void) {
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
    connect,
  });
}

export { createStore };
