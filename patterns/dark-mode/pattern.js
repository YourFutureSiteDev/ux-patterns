// Dark Mode: the three rules as code. Layered surfaces (never pure black), desaturated accents (-20%),
// calibrated text (never pure white, hierarchy by opacity).

const hexToRgb = hex => { const n = parseInt(hex.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgbToHex = rgb => '#' + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const toHsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255; const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > .5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
};
const fromHsl = ([h, s, l]) => { const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l); const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0) * 255, f(8) * 255, f(4) * 255]; };

// desaturate('#ff3366', .2) -> '#eb4770'-ish: pull saturation down by 20% and lift lightness a touch so it stays readable.
export function desaturate(hex, amount = .2) {
  const [h, s, l] = toHsl(hexToRgb(hex));
  return rgbToHex(fromHsl([h, s * (1 - amount), Math.min(.72, l + amount * .3)]));
}

// surfaces('#121212') -> { base: '#121212', surface: '#1e1e1e', elevated: '#2c2c2c' }: each step up is lighter, never black.
export function surfaces(base = '#121212', step = 12) {
  const [r, g, b] = hexToRgb(base);
  const lift = n => rgbToHex([r + n, g + n, b + n]);
  return { base, surface: lift(step), elevated: lift(step * 2 + 2) };
}

// textTiers() -> the opacity ladder for white text on dark surfaces.
export const textTiers = () => ({ high: 'rgba(255,255,255,.9)', medium: 'rgba(255,255,255,.7)', disabled: 'rgba(255,255,255,.38)' });

// DarkTheme(rootEl, { base: '#121212', accent: '#ff3366' }) writes the whole system onto an element as custom properties.
export function DarkTheme(root, { base = '#121212', accent = '#8b5cf6', desat = .2 } = {}) {
  const s = surfaces(base), t = textTiers();
  const vars = { '--dm-base': s.base, '--dm-surface': s.surface, '--dm-elevated': s.elevated, '--dm-accent': desaturate(accent, desat), '--dm-text-hi': t.high, '--dm-text-md': t.medium, '--dm-text-lo': t.disabled };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  return vars;
}

// Reveal(items, { every: .8 }) staggers a list of elements in; play(elapsed) freezes at a moment for screenshots.
export function Reveal(items, { every = .8, delay = 0 } = {}) {
  const els = [...items];
  els.forEach((el, i) => { el.style.animationDelay = `${delay + i * every}s`; el.classList.add('dm-in'); });
  return { play(elapsed) { if (elapsed === undefined) return; els.forEach((el, i) => { const t = (elapsed - delay - i * every) * 1000; el.getAnimations().forEach(a => { a.currentTime = Math.max(0, t); a.pause(); }); }); } };
}
