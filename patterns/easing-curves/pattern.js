// Easing Curves: same distance, same duration, different curve. spring > ease > linear.
// Three curves as CSS easing strings, the JS functions behind them, and helpers to draw and apply them.

// A damped spring sampled into a CSS linear() easing (overshoots slightly, then settles).
export function springEasing({ stiffness = 170, damping = 14, mass = 1, steps = 40, duration = 1 } = {}) {
  const f = springFn({ stiffness, damping, mass, duration });
  return `linear(${Array.from({ length: steps + 1 }, (_, i) => f(i / steps).toFixed(4)).join(', ')})`;
}
export function springFn({ stiffness = 170, damping = 14, mass = 1, duration = 1 } = {}) {
  const w0 = Math.sqrt(stiffness / mass), zeta = damping / (2 * Math.sqrt(stiffness * mass)), wd = w0 * Math.sqrt(1 - zeta * zeta);
  return t => { const s = t * duration; return 1 - Math.exp(-zeta * w0 * s) * (Math.cos(wd * s) + (zeta * w0 / wd) * Math.sin(wd * s)); };
}
// Cubic bezier as a JS function (Newton iteration on x), so the graph and the CSS curve agree.
export function bezierFn(x1, y1, x2, y2) {
  const A = (a, b) => 1 - 3 * b + 3 * a, B = (a, b) => 3 * b - 6 * a, C = a => 3 * a;
  const calc = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
  return x => { let t = x; for (let i = 0; i < 6; i++) { const s = slope(t, x1, x2); if (!s) break; t -= (calc(t, x1, x2) - x) / s; } return calc(t, y1, y2); };
}

export const EASE = {
  linear: { css: 'linear', fn: t => t, color: '#64748b' },
  easeOut: { css: 'cubic-bezier(.16,1,.3,1)', fn: bezierFn(.16, 1, .3, 1), color: '#3b82f6' },
  spring: { css: springEasing({ stiffness: 300, damping: 22 }), fn: springFn({ stiffness: 300, damping: 22 }), color: '#22c55e' },
};

// SVG path of an easing function inside a w × h box (origin bottom-left). Values above 1 overshoot the top edge.
export function curvePath(fn, w, h, samples = 60) {
  return Array.from({ length: samples + 1 }, (_, i) => { const t = i / samples; return `${i ? 'L' : 'M'}${(t * w).toFixed(1)} ${(h - fn(t) * h).toFixed(1)}`; }).join(' ');
}

// Move an element the same distance with a given curve. Returns the animation.
export function slide(el, { x = 0, y = 0, duration = 1200, easing = EASE.easeOut.css, iterations = 1 } = {}) {
  return el.animate([{ transform: 'none' }, { transform: `translate(${x}px, ${y}px)` }], { duration, easing, iterations, fill: 'forwards' });
}

// Press feedback: scale down and back with the chosen curve (spring makes the release bounce).
export function press(el, { easing = EASE.spring.css, duration = 500, scale = .94 } = {}) {
  return el.animate([{ transform: 'none' }, { transform: `scale(${scale})`, offset: .3 }, { transform: 'none' }], { duration, easing });
}
