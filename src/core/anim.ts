// NEW FILE: src/core/anim.ts
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Easing leves e baratas
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Relógio simples para loops de animação
export function normTime(t0: number, durMs: number) {
  return clamp((performance.now() - t0) / durMs, 0, 1);
}
