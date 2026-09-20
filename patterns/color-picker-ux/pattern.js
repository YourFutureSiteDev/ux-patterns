// Color picker UX: the picker is a decision tool. Every pick cascades into the UI, reads as OKLCH, remembers
// the last five, checks contrast live, previews alpha on both worlds and expands into ten tokens.

// ---- colour maths -----------------------------------------------------------------------------------------
export const hexToRgb = hex => { const h = hex.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
export const rgbToHex = (r, g, b) => '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
export function hsvToRgb(h, s, v) { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)].map(x => x * 255); }
export function rgbToHsv(r, g, b) { r /= 255; g /= 255; b /= 255; const M = Math.max(r, g, b), m = Math.min(r, g, b), d = M - m; let h = 0; if (d) h = M === r ? ((g - b) / d) % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360; return [h, M ? d / M : 0, M]; }
const lin = c => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
export function luminance(hex) { const [r, g, b] = hexToRgb(hex); return .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b); }
// WCAG contrast ratio; 4.5 passes AA for body text, 7 passes AAA.
export function contrastRatio(a, b) { const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + .05) / (Math.min(la, lb) + .05); }
export const grade = ratio => ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL';
// OKLCH from sRGB (Björn Ottosson's OKLab). Lightness, chroma and hue are the three numbers a human can reason about.
export function toOklch(hex) {
  const [r, g, b] = hexToRgb(hex).map(lin);
  const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
  const L = .2104542553 * l + .7936177850 * m - .0040720468 * s, A = 1.9779984951 * l - 2.4285922050 * m + .4505937099 * s, B = .0259040371 * l + .7827717662 * m - .8086757660 * s;
  return { l: +L.toFixed(2), c: +Math.hypot(A, B).toFixed(2), h: Math.round((Math.atan2(B, A) * 180 / Math.PI + 360) % 360) };
}
export const formats = hex => { const [r, g, b] = hexToRgb(hex), [h, s, v] = rgbToHsv(r, g, b), o = toOklch(hex); const l = v * (1 - s / 2), sl = l && l < 1 ? (v - l) / Math.min(l, 1 - l) : 0; return { hex: hex.toUpperCase(), rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${Math.round(h)}, ${Math.round(sl * 100)}%, ${Math.round(l * 100)}%)`, oklch: `oklch(${o.l} ${o.c} ${o.h})` }; };

// Ten tokens from one pick: tints towards white above the base, shades towards black below it (Tailwind-style 50..900).
export function tintsAndShades(hex, name = 'blue') {
  const [r, g, b] = hexToRgb(hex), mix = (t, to) => rgbToHex(r + (to - r) * t, g + (to - g) * t, b + (to - b) * t);
  const steps = [['50', .93, 255], ['100', .85, 255], ['200', .7, 255], ['300', .5, 255], ['400', .25, 255], ['500', 0, 255], ['600', .18, 0], ['700', .34, 0], ['800', .48, 0], ['900', .58, 0]];
  return steps.map(([k, t, to]) => ({ token: `${name}-${k}`, hex: mix(t, to) }));
}

// ---- components -----------------------------------------------------------------------------------------
// Saturation/value area + hue bar. Pointer drags move the thumbs, recompute the hex, and call onChange(hex).
export function ColorPicker(root, { onChange } = {}) {
  const area = root.querySelector('.cp-area'), hue = root.querySelector('.cp-hue'), at = area.querySelector('.cp-thumb'), ht = hue.querySelector('.cp-thumb');
  let h = 230, s = .6, v = .8;
  const paint = () => { const hex = rgbToHex(...hsvToRgb(h, s, v)); root.style.setProperty('--cp-color', hex); root.style.setProperty('--cp-pure', rgbToHex(...hsvToRgb(h, 1, 1))); at.style.left = `${s * area.clientWidth}px`; at.style.top = `${(1 - v) * area.clientHeight}px`; ht.style.left = `${h / 360 * hue.clientWidth}px`; onChange && onChange(hex); return hex; };
  const drag = (el, fn) => el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); const move = ev => { const r = el.getBoundingClientRect(); fn(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (ev.clientY - r.top) / r.height))); paint(); }; move(e); el.addEventListener('pointermove', move); el.addEventListener('pointerup', () => el.removeEventListener('pointermove', move), { once: true }); });
  drag(area, (x, y) => { s = x; v = 1 - y; }); drag(hue, x => { h = x * 360; });
  return { set(hex) { [h, s, v] = rgbToHsv(...hexToRgb(hex)); return paint(); }, get hex() { return rgbToHex(...hsvToRgb(h, s, v)); } };
}

// Recent swatches: the last five picks, newest first, restored in one tap.
export function RecentSwatches(el, onPick, max = 5) {
  const list = [...el.querySelectorAll('[data-hex]')].map(i => i.dataset.hex);
  const render = () => { el.innerHTML = list.slice(0, max).map(hx => `<i data-hex="${hx}" style="background:${hx}"></i>`).join('') + '<i></i>'.repeat(Math.max(0, max - list.length)); };
  el.addEventListener('click', e => { const i = e.target.closest('[data-hex]'); if (!i) return; el.querySelectorAll('.is-on').forEach(x => x.classList.remove('is-on')); i.classList.add('is-on'); onPick && onPick(i.dataset.hex); });
  return { push(hex) { const k = list.indexOf(hex); if (k >= 0) list.splice(k, 1); list.unshift(hex); render(); }, get list() { return [...list]; } };
}

// Live contrast badge: writes "4.8 : 1" and FAIL / AA / AAA into a .cp-ratio element.
export function ContrastBadge(el, fg, bg) {
  const r = contrastRatio(fg, bg), g = grade(r);
  el.classList.toggle('is-pass', g !== 'FAIL'); el.innerHTML = `${r.toFixed(1)} : 1<b>${g === 'FAIL' ? '✕ FAIL' : '✓ ' + g}</b>`;
  return { ratio: r, grade: g };
}
