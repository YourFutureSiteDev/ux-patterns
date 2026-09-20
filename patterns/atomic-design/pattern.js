// Atomic design system: one token file feeds colours, type, spacing, components and motion.
// The reel's argument is "replace hard-coded values with tokens", so this module is the token
// source plus the small behaviours the demo needs (field states, easing playback).

export const tokens = {
  color: { 'bg-primary': '#09090B', surface: '#111116', border: '#1f1e26', brand: '#6366F1', success: '#22C55E', error: '#EF4444', muted: '#7c7c88' },
  scale: { 900: '#312e81', 800: '#3730a3', 700: '#4338ca', 600: '#4f46e5', 500: '#6366f1', 400: '#818cf8', 300: '#a5b4fc', 200: '#c7d2fe', 100: '#e0e7ff' },
  type: [
    { name: 'text-5xl', size: 48, weight: 800 }, { name: 'text-4xl', size: 36, weight: 700 }, { name: 'text-3xl', size: 28, weight: 700 },
    { name: 'text-2xl', size: 22, weight: 600 }, { name: 'text-lg', size: 24, weight: 400 }, { name: 'text-base', size: 20, weight: 400 },
  ],
  weight: { Regular: 400, Medium: 500, Bold: 700, Extrabold: 800 },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 },
  duration: { 100: 'Micro — hover, toggle', 200: 'Small — button press', 300: 'Medium — modal, dropdown', 400: 'Large — page transition', 500: 'XL — complex' },
  maxDuration: 300,
  easing: { 'ease-out': 'Enter / appear', 'ease-in-out': 'Move / resize', 'ease-in': 'Exit / leave' },
};

// Writes every token as a CSS custom property (--color-brand, --space-4, --duration-300 …) on `el`.
export function applyTokens(el = document.documentElement, t = tokens) {
  for (const [k, v] of Object.entries(t.color)) el.style.setProperty(`--color-${k}`, v);
  for (const [k, v] of Object.entries(t.scale)) el.style.setProperty(`--brand-${k}`, v);
  for (const [k, v] of Object.entries(t.space)) el.style.setProperty(`--space-${k}`, `${v}px`);
  for (const k of Object.keys(t.duration)) el.style.setProperty(`--duration-${k}`, `${k}ms`);
  for (const s of t.type) { el.style.setProperty(`--${s.name}`, `${s.size}px`); el.style.setProperty(`--${s.name}-weight`, s.weight); }
  return el;
}

// Form field states: 'default' | 'focus' | 'error' | 'disabled'. The .ad-field reads data-state.
export function FieldState(field, state, message) {
  field.dataset.state = state;
  const input = field.querySelector('input'); const hint = field.querySelector('.ad-field__hint'); const tag = field.querySelector('.ad-field__state');
  if (input) { input.disabled = state === 'disabled'; input.setAttribute('aria-invalid', state === 'error'); if (state === 'focus') input.focus(); else input.blur(); }
  if (hint) hint.textContent = state === 'error' ? (message || 'Required field') : '';
  if (tag) tag.textContent = state;
  return field;
}
export function cycleFieldStates(field, states = ['default', 'focus', 'error', 'disabled'], interval = 1500) {
  let i = 0; FieldState(field, states[0]); const iv = setInterval(() => { i = (i + 1) % states.length; FieldState(field, states[i]); }, interval);
  return { stop: () => clearInterval(iv) };
}

// Restarts the easing/preset demos in a panel so the boxes replay from their first keyframe.
export function replay(panel) {
  panel.querySelectorAll('[class*="ad-ease"], [class*="ad-preset"]').forEach(el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
}
