// Glassmorphism: four lines of CSS (transparency, blur, border, shadow), each one a live token on the card.
// Usage: const g = Glass(cardEl); g.set('opacity', .35); g.step(2)

export const recipe = [
  { key: 'opacity', label: 'Pour in transparency', prop: '--gm-glass', css: v => `background: rgba(255,255,255, ${v});`, value: v => `rgba(255,255,255,${v})`, min: 0, max: 1, default: .35 },
  { key: 'blur', label: 'Mix in the blur', prop: '--gm-blur', css: v => `backdrop-filter: blur(${v}px);`, value: v => `${v}px`, min: 0, max: 40, default: 20 },
  { key: 'border', label: 'A pinch of border', prop: '--gm-edge', css: v => `border: 1px solid rgba(255,255,255, ${v});`, value: v => `rgba(255,255,255,${v})`, min: 0, max: 1, default: .5 },
  { key: 'shadow', label: 'Finish with shadow', prop: '--gm-shadow', css: v => `box-shadow: 0 8px 32px rgba(0,0,0,${v});`, value: v => `rgba(0,0,0,${v})`, min: 0, max: 1, default: .15 },
];

export function Glass(el, opts = {}) {
  const values = Object.fromEntries(recipe.map(r => [r.key, opts[r.key] ?? r.default]));
  const set = (key, v) => { const r = recipe.find(r => r.key === key); values[key] = v; el.style.setProperty(r.prop, r.value(v)); return r.css(v); };
  // step(n): apply only the first n lines of the recipe (0 = solid card, 4 = full glass).
  const step = n => { recipe.forEach((r, i) => el.classList.toggle(`is-step-${i}`, i === n)); if (n >= 4) recipe.forEach((_, i) => el.classList.remove(`is-step-${i}`)); };
  recipe.forEach(r => set(r.key, values[r.key]));
  return { set, step, values, css: () => `.glass-card {\n${recipe.map(r => '  ' + r.css(values[r.key])).join('\n')}\n}` };
}

// Wire a .gm-slider to one recipe line: drag moves the fill/knob and updates the glass and the code line.
export function GlassSlider(root, glass, key, opts = {}, onCss) {
  if (typeof opts === 'function') { onCss = opts; opts = {}; }
  const r = recipe.find(r => r.key === key), fill = root.querySelector('.gm-slider__fill'), knob = root.querySelector('.gm-slider__knob'), val = root.querySelector('.gm-slider__val'), track = root.querySelector('.gm-slider__track');
  const render = v => { const p = ((v - r.min) / (r.max - r.min)) * 100; fill.style.setProperty('--p', `${p}%`); knob.style.setProperty('--p', `${p}%`); val.textContent = key === 'blur' ? `${v}px` : v.toFixed(2); onCss?.(glass.set(key, v)); };
  const fromEvent = e => { const b = track.getBoundingClientRect(); const t = Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)); const v = r.min + t * (r.max - r.min); render(key === 'blur' ? Math.round(v) : Math.round(v * 100) / 100); };
  track.addEventListener('pointerdown', e => { fromEvent(e); const mv = ev => fromEvent(ev); window.addEventListener('pointermove', mv); window.addEventListener('pointerup', () => window.removeEventListener('pointermove', mv), { once: true }); });
  render(glass.values[key]);
  if (opts.p != null) { fill.style.setProperty('--p', `${opts.p}%`); knob.style.setProperty('--p', `${opts.p}%`); } // reel shows the knob at the end for the default
  return { set: render };
}
