// Radius Spectrum: one CSS property (border-radius) sets the whole personality of a UI.
//  - RadiusSpectrum(root): drives a preview card + slider from a single radius value (0..40px).
//  - SPECTRUM: the four named stops the reel uses, with who they suit.
//  - SpectrumStepper(root): steps a card through those stops (0px, 8px, 20px, 50%).

export const SPECTRUM = [
  { step: 0, radius: '0px', label: '0px', name: 'Authority', who: 'Banks • Law firms', accent: '#7a7f8c' },
  { step: 1, radius: '8px', label: '8px', name: 'Professional', who: 'SaaS • Enterprise', accent: '#4580ea' },
  { step: 2, radius: '20px', label: '20px', name: 'Friendly', who: 'Consumer apps', accent: '#f17215' },
  { step: 3, radius: '999px', label: '50%', name: 'Playful', who: 'Social • Gen Z', accent: '#ed4896' },
];

// Feeling for a radius in px: 0-6 corporate/sharp, 7-16 professional, 17-32 friendly, 33+ playful.
export function feelingFor(px) {
  if (px <= 6) return { text: 'Feels corporate', accent: '#4580ea' };
  if (px <= 16) return { text: 'Feels professional', accent: '#4580ea' };
  if (px <= 32) return { text: 'Feels friendly', accent: '#f17215' };
  return { text: 'Feels friendly', accent: '#f17215' };
}

// root holds a .rs-preview, a .rs-slider and optionally a .rs-feel chip. All read --rs-r / --rs-accent.
// Usage: const rs = RadiusSpectrum(root, { max: 40 }); rs.set(20); rs.animateTo(40, 1200);
export function RadiusSpectrum(root, opts = {}) {
  const max = opts.max ?? 40;
  const value = root.querySelector('.rs-slider__value'), feel = root.querySelector('.rs-feel'), preview = root.querySelector('.rs-preview');
  const input = root.querySelector('input[type="range"]');
  let px = opts.value ?? 2, raf = 0;
  const set = v => {
    px = Math.max(0, Math.min(max, Math.round(v)));
    const f = feelingFor(px);
    root.style.setProperty('--rs-r', `${px}px`); root.style.setProperty('--rs-accent', f.accent); root.style.setProperty('--rs-pct', `${(px / max) * 100}%`);
    if (value) value.textContent = `${px}px`;
    if (feel) feel.textContent = f.text;
    if (preview) preview.classList.toggle('is-warm', px > 16);
    if (input && Number(input.value) !== px) input.value = px;
    root.dispatchEvent(new CustomEvent('rs:change', { detail: { px, ...f } }));
  };
  const animateTo = (target, ms = 1000) => new Promise(res => {
    cancelAnimationFrame(raf); const from = px, t0 = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = now => { const t = Math.min(1, (now - t0) / ms); set(from + (target - from) * ease(t)); if (t < 1) raf = requestAnimationFrame(tick); else res(); };
    raf = requestAnimationFrame(tick);
  });
  if (input) { input.max = max; input.addEventListener('input', () => set(Number(input.value))); }
  set(px);
  return { set, animateTo, get px() { return px; } };
}

// Steps a .rs-spec block through SPECTRUM. Updates the value, name, who, dots and progress bar.
export function SpectrumStepper(root, opts = {}) {
  const value = root.querySelector('.rs-spec__value'), name = root.querySelector('.rs-spec__name'), who = root.querySelector('.rs-spec__who');
  const dots = opts.dots ? [...opts.dots.querySelectorAll('i')] : [], progress = opts.progress;
  let i = Number(root.dataset.step) || 0;
  const set = step => {
    i = ((step % SPECTRUM.length) + SPECTRUM.length) % SPECTRUM.length; const s = SPECTRUM[i];
    root.dataset.step = i; if (value) value.textContent = s.label; if (name) name.textContent = s.name; if (who) who.textContent = s.who;
    dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    if (progress) progress.style.setProperty('--rs-pct', `${((i + 1) / SPECTRUM.length) * 100 - 12}%`);
    root.dispatchEvent(new CustomEvent('rs:step', { detail: s }));
  };
  set(i);
  return { set, next: () => set(i + 1), prev: () => set(i - 1), get step() { return i; } };
}
