// Color Accessibility: WCAG contrast maths, colour-vision simulation and the small motion helpers the reel uses.

// ---- WCAG 2.x contrast ------------------------------------------------------
const hexToRgb = hex => { const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgbToHex = ([r, g, b]) => '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const unlin = v => { v = Math.max(0, Math.min(1, v)); return 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055); };
export const luminance = hex => { const [r, g, b] = hexToRgb(hex); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };

// contrastRatio('#F0F0F0', '#241a3e') -> 7.2
export function contrastRatio(fg, bg) {
  const a = luminance(fg), b = luminance(bg);
  return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 10) / 10;
}

// wcagLevel(4.5) -> 'AA'; wcagLevel(7) -> 'AAA'; wcagLevel(3, { large: true }) -> 'AA'; wcagLevel(1.5) -> 'fail'
export function wcagLevel(ratio, { large = false } = {}) {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return large ? 'AAA' : 'AA';
  if (ratio >= 3 && large) return 'AA';
  return 'fail';
}

// ---- Colour-vision deficiency simulation (Machado, Oliveira & Fernandes 2009, severity 1.0) -----
const CVD = {
  protanopia:   [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritanopia:   [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};
// simulateCVD('#e5304f', 'deuteranopia') -> what a deuteranope sees, as hex
export function simulateCVD(hex, type) {
  const m = CVD[type]; if (!m) throw new Error(`unknown CVD type ${type}`);
  const L = hexToRgb(hex).map(lin);
  return rgbToHex(m.map(row => unlin(row[0] * L[0] + row[1] * L[1] + row[2] * L[2])));
}

// ---- Audit: annotate every [data-ca-check] element with its ratio ---------------------------------
// Each element needs data-fg and data-bg hex values; it gets data-ratio and data-level set and a
// 'ca:checked' event so the UI can render the badge however it likes.
export function ContrastAudit(root = document) {
  const results = [];
  root.querySelectorAll('[data-ca-check]').forEach(el => {
    const ratio = contrastRatio(el.dataset.fg, el.dataset.bg), level = wcagLevel(ratio, { large: el.dataset.large === 'true' });
    el.dataset.ratio = ratio; el.dataset.level = level;
    el.dispatchEvent(new CustomEvent('ca:checked', { detail: { ratio, level }, bubbles: true }));
    results.push({ el, ratio, level });
  });
  return results;
}

// ---- Motion helpers -----------------------------------------------------------------------------
// Drives a value from `from` to `to` over `duration` s. play(elapsed) renders the frame at `elapsed` s
// (used by the stage to freeze a screenshot); play() with no argument animates live.
function tween({ from, to, duration, render }) {
  let raf = 0;
  const at = e => { const k = Math.min(1, Math.max(0, e / duration)); render(from + (to - from) * k, k); };
  return { play(elapsed) {
    cancelAnimationFrame(raf);
    if (elapsed !== undefined) return at(elapsed);
    const t0 = performance.now(); const step = now => { const e = (now - t0) / 1000; at(e); if (e < duration) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step);
  }, set(v) { cancelAnimationFrame(raf); render(v, 1); } };
}

// CountUp(el, { to: 300, duration: 1, format: v => `${Math.round(v)}M` })
export function CountUp(el, { from = 0, to, duration = 1, format = v => String(Math.round(v)) } = {}) {
  return tween({ from, to, duration, render: v => { el.textContent = format(v); } });
}

// RatioMeter(el, { from: 3.2, to: 7.1, duration: 2, target: copyEl }): "3.2 : 1" in red, green from 4.5, tick at the end.
// `target` gets --k (0..1) so its text colour can be tied to the ratio with color-mix.
export function RatioMeter(el, { from = 3.2, to = 7.1, duration = 2, pass = 4.5, target = null } = {}) {
  const num = el.querySelector('b') || el;
  return tween({ from, to, duration, render: (v, k) => {
    if (target) target.style.setProperty('--k', k); // the text it measures brightens with it
    const r = Math.round(v * 10) / 10;
    num.textContent = `${r.toFixed(1)} : 1${k >= 1 ? ' ✓' : ''}`;
    el.classList.toggle('is-pass', r >= pass);
  } });
}

// CompareSlider(dashEl): the "after" layer is clipped at x px and the divider follows it.
export function CompareSlider(root) {
  const after = root.querySelector('.ca-dash__layer--after'), line = root.querySelector('.ca-dash__divider');
  const w = root.offsetWidth || 600;
  return {
    set(x) { root.classList.remove('is-sweeping'); after.style.clipPath = `inset(0 ${Math.max(0, w - x)}px 0 0)`; if (line) line.style.left = `${Math.min(w - 2, x)}px`; },
    sweep() { after.style.clipPath = ''; if (line) line.style.left = ''; root.classList.add('is-sweeping'); },
  };
}
