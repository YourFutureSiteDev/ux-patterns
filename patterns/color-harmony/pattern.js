// Color Harmony: the 60 : 30 : 10 rule as code. One dark base covers 60% of the screen, the same hue
// slightly lighter covers 30% (cards, nav, containers), one warm high-contrast accent covers 10% (CTAs).

const hexToRgb = hex => { const n = parseInt(hex.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgbToHex = rgb => '#' + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
export function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255; const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > .5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
export function hslToRgb([h, s, l]) {
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

// harmonize('#0f172a') -> { base: '#0f172a', cards: '#1e293b', accent: '#f59e0b' }
// cards: same hue, +6% lightness. accent: the warm complement, pushed to full saturation for max contrast.
export function harmonize(base, { lift = .06, accentHue = null } = {}) {
  const [h, s, l] = rgbToHsl(hexToRgb(base));
  const cards = rgbToHex(hslToRgb([h, s, Math.min(1, l + lift)]));
  const hue = accentHue ?? (h + 180 + 45) % 360;                 // complement, nudged warm
  const accent = rgbToHex(hslToRgb([hue, .92, .5]));
  return { base, cards, accent };
}

// SixtyThirtyTen(rootEl, '#0f172a') writes --ch-base / --ch-card / --ch-accent onto the element.
export function SixtyThirtyTen(root, base, opts) {
  const p = harmonize(base, opts);
  root.style.setProperty('--ch-base', p.base); root.style.setProperty('--ch-card', p.cards); root.style.setProperty('--ch-accent', p.accent);
  return p;
}

// RatioRing(el): three arcs on one circle; set('60') lights that segment and collapses the others to dots.
export function RatioRing(el, { segments = [60, 30, 10] } = {}) {
  const r = Number(el.querySelector('circle')?.getAttribute('r')) || 70, C = 2 * Math.PI * r; let start = 0;
  const arcs = [...el.querySelectorAll('.ch-ring__seg')];
  arcs.forEach((a, i) => { const len = C * segments[i] / 100; a.style.setProperty('--len', len); a.style.setProperty('--start', start); start += len; });
  return { set(pct) { arcs.forEach((a, i) => a.classList.toggle('is-off', segments[i] !== Number(pct))); el.classList.add('is-drawing'); } };
}

// SplitCompare(el): the "no system" layer is clipped at x px, the orange line follows.
export function SplitCompare(el) {
  return { set(x) { el.classList.remove('is-sweeping'); el.style.setProperty('--x', `${x}px`); }, sweep() { el.classList.add('is-sweeping'); } };
}
