const events = {};

const on = (name, fn) => {
  events[name] = events[name] || [];
  events[name].push(fn);
}

const off = (name, fn) => {
  if (events[name]) {
    events[name] = events[name].filter(cb => cb !== fn);
  }
}

const emit = (name, data) => {
  if (events[name])
    events[name].forEach(fn => fn(data));
}

export default {
  on,
  off,
  emit
}