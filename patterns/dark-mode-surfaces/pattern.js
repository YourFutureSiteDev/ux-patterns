// Dark Mode Surfaces: six rules as tokens. Near-black page, lightness for elevation, three alphas of
// white for text, a calmed accent (same hue, lighter, softer), alpha hairlines, dimmed photos.

const hexToRgb = hex => { const n = parseInt(hex.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgbToHex = rgb => '#' + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
export const toHsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255; const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > .5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
};
export const fromHsl = ([h, s, l]) => { const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l); const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0) * 255, f(8) * 255, f(4) * 255]; };

// 01 Surface + 02 Elevation: page 5% L, card 9%, menu 12%, modal 16%. Lightness is elevation; shadows are not.
export function surfaces({ hue = 220, sat = .18 } = {}) {
  const at = l => rgbToHex(fromHsl([hue, sat, l]));
  return { page: at(.05), card: at(.09), menu: at(.12), modal: at(.16) };
}

// 03 Text: one colour, three alphas.
export const textTiers = (rgb = '255 255 255') => ({ primary: `rgb(${rgb} / .87)`, secondary: `rgb(${rgb} / .6)`, disabled: `rgb(${rgb} / .38)` });

// 04 Accent: keep the hue, drop saturation, raise lightness. calmAccent('#2563eb') -> '#7fa6e8'
export function calmAccent(hex, { sat = .45, light = .70 } = {}) {
  const [h] = toHsl(hexToRgb(hex));
  return rgbToHex(fromHsl([h, sat, light]));
}
export const hsl = hex => { const [h, s, l] = toHsl(hexToRgb(hex)); return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }; };

// 05 Hairline: alpha adapts to whatever surface it sits on; a fixed grey does not.
export const hairline = (alpha = .08) => `1px solid rgb(255 255 255 / ${alpha})`;

// 06 Images: photos get dimmed, illustrations get redrawn.
export const photoFilter = (brightness = .9) => `brightness(${brightness})`;

// DarkSystem(rootEl, { hue, accent }) writes every token above onto an element as custom properties.
export function DarkSystem(root, { hue = 220, accent = '#2563eb' } = {}) {
  const s = surfaces({ hue }), t = textTiers();
  const vars = { '--ds-page': s.page, '--ds-card': s.card, '--ds-menu': s.menu, '--ds-modal': s.modal, '--ds-text-1': t.primary, '--ds-text-2': t.secondary, '--ds-text-3': t.disabled, '--ds-accent': accent, '--ds-accent-calm': calmAccent(accent), '--ds-hairline': `rgb(255 255 255 / .08)`, '--ds-photo-filter': photoFilter() };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  return vars;
}

// Typewriter(el, 'dark-mode --invert', { cps: 14 }): types into el; play(elapsed) freezes at a moment.
export function Typewriter(el, text, { cps = 14, delay = 0 } = {}) {
  let raf = 0;
  const at = e => { const n = Math.max(0, Math.min(text.length, Math.floor((e - delay) * cps))); el.textContent = text.slice(0, n); };
  return { play(elapsed) { cancelAnimationFrame(raf); if (elapsed !== undefined) return at(elapsed); const t0 = performance.now(); const step = now => { const e = (now - t0) / 1000; at(e); if (e < delay + text.length / cps) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); } };
}
