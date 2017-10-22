export function map (obj, fn) {
  const res = {};
  Object.keys(obj).forEach(key => {
    res[key] = fn(obj[key], key);
  });
  return res;
}

export function hasValue (value) {
  return value !== null && value !== undefined;
}