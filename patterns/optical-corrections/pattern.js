// Optical corrections: five places where the mathematically centred / equal / matching value is wrong to the eye.
// Each export is the rule as a function, plus small helpers that apply it to DOM.

// #1 Play button: shift the triangle right by 8% of the box it sits in so its visual centroid lands on the centre.
export const opticalShift = (boxWidth, ratio = 0.08) => Math.round(boxWidth * ratio);
export function OpticalPlay(root, opts = {}) {
  const icon = root.querySelector('.oc-play__icon'), box = opts.box ?? root.clientWidth, ratio = opts.ratio ?? 0.08;
  const api = { shift: opticalShift(box, ratio), correct(on = true) { icon.style.setProperty('--shift', on ? `${api.shift}px` : '0px'); root.classList.toggle('is-corrected', !!on); return api; } };
  return api;
}

// #2 Shape sizing: a circle needs ~13% more diameter than a square's side to read as the same size (area, not pixels).
export const opticalCircle = (squareSize, k = 1.13) => Math.round(squareSize * k);

// #3 Border radius: nested corners stay concentric when inner = outer - padding.
export const innerRadius = (outer, padding) => Math.max(0, outer - padding);
export function NestedRadius(outerEl, innerEl, { outer, gap, scale = 1 } = {}) {
  outerEl.style.borderRadius = `${outer * scale}px`; outerEl.style.padding = `${gap * scale}px`;
  innerEl.style.borderRadius = `${innerRadius(outer, gap) * scale}px`;
  return { outer, gap, inner: innerRadius(outer, gap) };
}

// #4 Dark mode weight: light text on dark bleeds outward (irradiation), so drop one weight step in dark mode.
export const darkModeWeight = (weight, step = 100) => weight - step;
export function applyDarkModeWeight(el, weight, dark = matchMedia('(prefers-color-scheme: dark)').matches) { el.style.fontWeight = dark ? darkModeWeight(weight) : weight; }

// #5 Text centering: CSS centres the line box (which includes descender space); the eye centres the cap height.
// Nudge the glyphs up by ~2px: extra padding on the descender side (the reel labels the same fix "padding-top: +2px" on the text's top offset).
export function capHeightCenter(el, px = 2) { el.style.paddingBottom = `${px}px`; el.classList.add('is-cap-aligned'); }

// Demo helpers: a seekable count-up for "200px -> 226px" style readouts.
export function CountUp(el, from, to, { ms = 800, suffix = 'px' } = {}) {
  const ease = x => 1 - Math.pow(1 - x, 3);
  const seek = t => { const k = ease(Math.max(0, Math.min(1, t / (ms / 1000)))); el.textContent = Math.round(from + (to - from) * k) + suffix; return k; };
  const play = () => { const t0 = performance.now(); const tick = now => { if (seek((now - t0) / 1000) < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
  return { seek, play };
}
