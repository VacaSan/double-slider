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

export { clamp, interpolate, quantize };
