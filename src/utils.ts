function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function interpolate(
  x: number,
  [x0, x1]: [x0: number, x1: number],
  [y0, y1]: [y0: number, y1: number]
) {
  return y0 + (x - x0) * ((y1 - y0) / (x1 - x0));
}

function quantize(value: number, step: number) {
  if (step) {
    const numSteps = Math.round(value / step);
    return numSteps * step;
  } else {
    return value;
  }
}

export { clamp, interpolate, quantize };
