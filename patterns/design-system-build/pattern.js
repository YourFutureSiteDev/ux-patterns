// Build a Design System: colours (harmonies on a 12-hue wheel), a modular type scale, an 8px spacing unit
// and atomic composition (atoms -> molecules -> organisms). The reel's four chapters as reusable functions.

// ---- 01 · Colors ------------------------------------------------------------
// Twelve hues, clockwise from the top (0 = red), as the reel draws them.
export const WHEEL = ['#ee3a4a', '#f0862b', '#e9c722', '#b5e21f', '#4ade80', '#2dd4bf', '#2ecfd6', '#3b82f6', '#4f5fe0', '#8b5cf6', '#c026d3', '#ec4899'];

// A harmony picks indexes on the wheel. Monochromatic keeps one hue and varies lightness.
export const HARMONIES = {
  monochromatic: base => [base],
  complementary: base => [base, (base + 6) % 12],
  analogous: base => [(base + 11) % 12, base, (base + 1) % 12]
};

// Monochromatic swatches: one hue, four lightness steps.
export function monoSwatches(hue = '#4f5fe0') {
  const [r, g, b] = hex(hue);
  const mix = (t, to = 255) => '#' + [r, g, b].map(c => Math.round(c + (to - c) * t).toString(16).padStart(2, '0')).join('');
  return [mix(-.35, 0), mix(0), mix(.3), mix(.55)];
}
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

// Draws the wheel into an <svg viewBox="0 0 300 300">: 12 dots on a circle, the harmony's dots lit.
export function ColorWheel(svgEl, { mode = 'monochromatic', base = 8, r = 100, dot = 13, lit = 18 } = {}) {
  const NS = 'http://www.w3.org/2000/svg', cx = 150, cy = 150;
  const pos = i => { const a = (i / 12) * Math.PI * 2; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; };
  const paint = () => {
    const on = new Set(HARMONIES[mode](base));
    svgEl.innerHTML = '';
    if (mode === 'complementary') { const [a, b] = on; const [x1, y1] = pos(a), [x2, y2] = pos(b); const l = document.createElementNS(NS, 'line'); l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2); l.setAttribute('class', 'ds-wheel__link'); svgEl.appendChild(l); }
    if (mode === 'analogous') { const [x1, y1] = pos(0), [x2, y2] = pos(2); const p = document.createElementNS(NS, 'path'); p.setAttribute('d', `M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`); p.setAttribute('class', 'ds-wheel__arc'); svgEl.appendChild(p); }
    WHEEL.forEach((c, i) => { const [x, y] = pos(i); const el = document.createElementNS(NS, 'circle'); el.setAttribute('cx', x); el.setAttribute('cy', y); el.setAttribute('r', on.has(i) ? lit : dot); el.setAttribute('fill', c); el.setAttribute('class', 'ds-wheel__dot' + (on.has(i) ? ' is-on' : '')); svgEl.appendChild(el); });
  };
  paint();
  return { set(m, b = base) { mode = m; base = b; paint(); }, get colors() { return HARMONIES[mode](base).map(i => WHEEL[i]); } };
}

// ---- 02 · Typography --------------------------------------------------------
// Modular scale: every step is base x ratio^n. The reel: 14 / 18 / 32 / 48 (0.875x, base, 1.78x, 2.67x).
export function typeScale(base = 18, steps = { caption: -1, body: 0, heading: 2, display: 3 }, ratio = 1.333) {
  const out = {};
  for (const [k, n] of Object.entries(steps)) { const px = Math.round(base * Math.pow(ratio, n)); out[k] = { px, ratio: n === 0 ? 'base' : (px / base).toFixed(n < 0 ? 3 : 2) + '×' }; }
  return out;
}
export const REEL_SCALE = { caption: { px: 14, ratio: '0.875×' }, body: { px: 18, ratio: 'base' }, heading: { px: 32, ratio: '1.78×' }, display: { px: 48, ratio: '2.67×' } };

// ---- 03 · Spacing --------------------------------------------------------------
// One unit, stacked: 8 / 16 / 24 / 32 / 48.
export function spacingScale(unit = 8, multiples = { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }) {
  return Object.fromEntries(Object.entries(multiples).map(([k, m]) => [k, unit * m]));
}
export const onGrid = (px, unit = 8) => px % unit === 0;

// Builds the stacked-block chart the reel shows: one 32px block per unit.
export function SpacingChart(root, { unit = 8, scale = spacingScale(unit) } = {}) {
  root.innerHTML = Object.entries(scale).map(([k, px]) => `<div class="ds-bar"><div class="ds-bar__stack">${'<i></i>'.repeat(px / unit)}</div><b>${px}px</b><span>${k}</span></div>`).join('');
}

// ---- 04 · Atomic components ------------------------------------------------------
export const TOKENS = { color: { primary: '#6366f1' }, type: { button: 'Inter 700' }, space: { button: '16 × 28', card: '24px pad' }, radius: { button: 12 } };
export function atomsOf(molecule) { return Object.values(TOKENS).map(t => Object.values(t)).flat(); }
