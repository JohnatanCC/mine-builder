export function easeOutBack(x: number, k = 0.50) {
  const c1 = k * 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
