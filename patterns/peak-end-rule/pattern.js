// Peak-end rule: what a user remembers is the peak moment plus the final moment, not the average.
// peakEndScore(steps) scores a flow the way memory does; curvePath() draws a satisfaction curve;
// MemoryMeter animates a 0..100 counter and bar; FlowPeak drops a delight step into a flow.

// Score a flow from its per-step satisfaction (0..100). Memory = weighted peak + end, average barely counts.
export function peakEndScore(steps, w = { peak: 0.45, end: 0.45, avg: 0.10 }) {
  if (!steps.length) return 0;
  const peak = Math.max(...steps), end = steps[steps.length - 1], avg = steps.reduce((a, b) => a + b, 0) / steps.length;
  return Math.round(peak * w.peak + end * w.end + avg * w.avg);
}

// Smooth path through points [[x,y],...] with flat-ish plateaus (Catmull-Rom to cubic Bézier, tension 0.5).
export function curvePath(pts, t = 0.5) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * t * 2, p1[1] + (p2[1] - p0[1]) / 6 * t * 2];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6 * t * 2, p2[1] - (p3[1] - p1[1]) / 6 * t * 2];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

// Area under a curve path, closed to a baseline y.
export function areaPath(pts, baseY, t) { const last = pts[pts.length - 1], first = pts[0]; return `${curvePath(pts, t)} L${last[0]} ${baseY} L${first[0]} ${baseY} Z`; }

// Memory meter: counts a number and fills a bar to `value` over `ms`.
export function MemoryMeter(root, opts = {}) {
  const num = root.querySelector('[data-num]'), bar = root.querySelector('[data-bar]');
  let raf = 0;
  return { set(value, ms = 900) {
    cancelAnimationFrame(raf); const start = performance.now(); const from = Number(num.textContent) || 0;
    const tick = now => { const k = Math.min(1, (now - start) / ms), e = 1 - Math.pow(1 - k, 3); const v = Math.round(from + (value - from) * e); num.textContent = v; if (bar) bar.style.width = v + '%'; if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
  } };
}

// Plant one delight step in an otherwise neutral flow and report the memory before and after.
export function FlowPeak(steps, peak = { label: 'Surprise upgrade', detail: '+ Free express shipping', score: 95 }, at = steps.length) {
  const before = peakEndScore(steps.map(s => s.score));
  const next = [...steps.slice(0, at), { ...peak, peak: true }, ...steps.slice(at)];
  return { steps: next, before, after: peakEndScore(next.map(s => s.score)) };
}
