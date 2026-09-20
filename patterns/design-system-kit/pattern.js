// Design System Kit: the token values behind the reel, plus the helpers that apply them.
// Everything is a named token; components read the tokens instead of hardcoding values.

export const tokens = {
  color: {
    primary: { 900: '#312e81', 800: '#3730a3', 700: '#4338ca', 600: '#4f46e5', 500: '#6366f1', 400: '#818cf8', 300: '#a5b4fc', 200: '#c7d2fe', 100: '#e0e7ff' },
    semantic: { 'bg-primary': '#09090B', brand: '#6366F1', success: '#22C55E', error: '#EF4444' },
  },
  type: [
    { name: 'text-5xl', size: 48, weight: 800 }, { name: 'text-4xl', size: 36, weight: 700 }, { name: 'text-3xl', size: 28, weight: 700 },
    { name: 'text-2xl', size: 22, weight: 600 }, { name: 'text-lg', size: 24, weight: 400 }, { name: 'text-base', size: 20, weight: 400 },
  ],
  weight: { Regular: 400, Medium: 500, Bold: 700, Extrabold: 800 },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 },
  easing: { 'ease-out': 'Enter / appear', 'ease-in-out': 'Move / resize', 'ease-in': 'Exit / leave' },
  duration: [
    { ms: 100, use: 'Micro — hover, toggle' }, { ms: 200, use: 'Small — button press' }, { ms: 300, use: 'Medium — modal, dropdown', max: true },
    { ms: 400, use: 'Large — page transition' }, { ms: 500, use: 'XL — complex' },
  ],
};

// Write every token onto an element (default :root) as CSS custom properties: --primary-500, --brand, --space-4, --text-5xl…
export function applyTokens(el = document.documentElement, t = tokens) {
  const s = el.style;
  for (const [k, v] of Object.entries(t.color.primary)) s.setProperty(`--primary-${k}`, v);
  for (const [k, v] of Object.entries(t.color.semantic)) s.setProperty(`--${k}`, v);
  for (const [k, v] of Object.entries(t.space)) s.setProperty(`--space-${k}`, `${v}px`);
  for (const step of t.type) { s.setProperty(`--${step.name}`, `${step.size}px`); s.setProperty(`--${step.name}-weight`, step.weight); }
  for (const d of t.duration) s.setProperty(`--duration-${d.ms}`, `${d.ms}ms`);
}

// Snap an arbitrary pixel value to the nearest step of the spacing scale (7 → 8, 23 → 24, 11 → 12).
export function snapSpace(px, scale = Object.values(tokens.space)) {
  return scale.reduce((best, v) => Math.abs(v - px) < Math.abs(best - px) ? v : best, scale[0]);
}

// Input field with the four states from the reel. FieldStates(root, { cycle: 1500 }) loops default → focus → error → disabled.
export function FieldStates(root, opts = {}) {
  const input = root.querySelector('.dk-field__input'), label = root.querySelector('.dk-state');
  const states = ['default', 'focus', 'error', 'disabled'];
  const set = state => {
    states.forEach(s => root.classList.toggle(`is-${s}`, s === state));
    input.disabled = state === 'disabled'; input.setAttribute('aria-invalid', state === 'error');
    if (label) label.textContent = state;
  };
  set(opts.state || 'default');
  let iv = null;
  if (opts.cycle) { let i = 0; iv = setInterval(() => set(states[i = (i + 1) % states.length]), opts.cycle); }
  return { set, stop: () => clearInterval(iv) };
}

// Duration scale: highlight the recommended maximum for a given interaction size.
export function DurationScale(root, maxMs = 300) {
  root.querySelectorAll('.dk-dur').forEach(row => {
    const ms = Number(row.dataset.ms);
    row.classList.toggle('is-max', ms === maxMs);
    let tag = row.querySelector('.dk-dur__max');
    if (ms === maxMs && !tag) { tag = document.createElement('span'); tag.className = 'dk-dur__max'; tag.textContent = 'MAX'; row.appendChild(tag); }
    if (ms !== maxMs && tag) tag.remove();
  });
}
