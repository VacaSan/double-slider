function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function interpolate(x, [x0, x1], [y0, y1]) {
  return y0 + (x - x0) * ((y1 - y0) / (x1 - x0));
}

function quantize(value, step) {
  if (step) {
    const numSteps = Math.round(value / step);
    return numSteps * step;
  } else {
    return value;
  }
}

const PAGE_FACTOR = 4;

function getValueForKeyId({ keyId, value, min, max, step }) {
  const delta = step || (max - min) / 100;

  switch (keyId) {
    case "ArrowLeft":
    case "ArrowDown":
      return value - delta;
    case "ArrowRight":
    case "ArrowUp":
      return value + delta;
    case "PageUp":
      return value + delta * PAGE_FACTOR;
    case "PageDown":
      return value - delta * PAGE_FACTOR;
    case "Home":
      return min;
    case "End":
      return max;
    default:
      return NaN;
  }
}

export { clamp, interpolate, quantize, getValueForKeyId };
