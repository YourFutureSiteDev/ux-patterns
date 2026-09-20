// Design Tokens: three layers (primitive → semantic → component), a 4-point scale to snap to,
// and alias sets that swap a whole theme by changing values, never names.

// Resolve a token through the layers until it hits a raw value. resolve('card-bg') → '#f3f4f6'.
export function TokenGraph(layers) {
  const all = Object.assign({}, ...Object.values(layers));
  const resolve = name => { let v = all[name], seen = 0; while (v in all && seen++ < 10) v = all[v]; return v; };
  // Every token that points (directly or through others) at `name`: the cascade of one change.
  const dependents = name => Object.keys(all).filter(k => { let v = all[k], seen = 0; while (v in all && seen++ < 10) { if (v === name) return true; v = all[v]; } return v === name; });
  return { all, resolve, dependents, set(name, value) { all[name] = value; return dependents(name); } };
}

export const scale4 = [4, 8, 12, 16, 24, 32, 48];
// Snap any value to the nearest step on the 4-point scale: 13 → 12, 17 → 16, 23 → 24, 15 → 16.
export const snap = (px, scale = scale4) => scale.reduce((b, v) => Math.abs(v - px) < Math.abs(b - px) ? v : b, scale[0]);

// Alias tokens: the same three names, two value sets. Theme(root).set('dark') swaps them on the element.
export const themes = {
  light: { surface: '#ffffff', 'on-surface': '#111111', primary: '#8b5cf6' },
  dark: { surface: '#12121a', 'on-surface': '#ffffff', primary: '#a78bfa' },
};
export function Theme(root, sets = themes) {
  const set = name => { Object.entries(sets[name]).forEach(([k, v]) => root.style.setProperty(`--${k}`, v)); root.classList.toggle('is-dark', name === 'dark'); root.classList.toggle('is-light', name === 'light'); root.dataset.theme = name; };
  return { set, toggle: () => set(root.dataset.theme === 'dark' ? 'light' : 'dark') };
}

// Spec panel: snap every property to the scale, mark which ones changed. Returns [{name, from, to, ok}].
export function snapSpec(props, scale = scale4) {
  return props.map(([name, from]) => { const to = snap(from, scale); return { name, from, to, ok: from === to }; });
}
