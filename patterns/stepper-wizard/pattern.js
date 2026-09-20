// Stepper Wizard: chunk a long form into steps, show progress, validate inside each step, persist state.

// Wizard: steps are the .sw-step children of `root` (or opts.steps). Renders a linear bar, numbered dots and
// step labels if you hand it those nodes, blocks Next while the current step is invalid, and persists to storage.
export function Wizard(root, opts = {}) {
  const steps = opts.steps || [...root.querySelectorAll('.sw-step')];
  const total = steps.length; let i = Math.min(opts.step ?? 0, total - 1);
  const store = opts.storageKey ? WizardState(root, { key: opts.storageKey, step: i }) : null;
  const validate = opts.validate || (() => true);
  const render = () => {
    steps.forEach((s, k) => { s.hidden = k !== i; });
    const pct = Math.round(((i + 1) / total) * 100);
    if (opts.bar) { opts.bar.querySelector('.sw-bar__fill')?.style.setProperty('--p', pct + '%'); const t = opts.bar.querySelector('.sw-bar span'), b = opts.bar.querySelector('.sw-bar b'); if (t) t.textContent = `Step ${i + 1} of ${total}`; if (b) b.textContent = pct + '%'; }
    if (opts.dots) opts.dots.querySelectorAll('.sw-dot').forEach((d, k) => { d.classList.toggle('is-done', k < i); d.classList.toggle('is-on', k === i); }), opts.dots.querySelectorAll('.sw-dots__line').forEach((l, k) => l.classList.toggle('is-done', k < i));
    if (opts.labels) opts.labels.querySelectorAll('span').forEach((l, k) => { l.classList.toggle('is-done', k < i); l.classList.toggle('is-on', k === i); });
    if (opts.next) { const ok = validate(i, steps[i]); opts.next.disabled = !ok; opts.next.textContent = i === total - 1 ? 'Submit' : 'Next'; }
    if (opts.back) opts.back.disabled = i === 0;
    store?.save(i);
    root.dispatchEvent(new CustomEvent('sw:step', { detail: { step: i, total }, bubbles: true }));
  };
  const go = k => { i = Math.max(0, Math.min(total - 1, k)); render(); };
  opts.next?.addEventListener('click', () => { if (validate(i, steps[i])) go(i + 1); });
  opts.back?.addEventListener('click', () => go(i - 1));
  root.addEventListener('input', () => { if (opts.next) opts.next.disabled = !validate(i, steps[i]); store?.save(i); });
  if (store) { const saved = store.restore(); if (saved?.step != null) i = saved.step; }
  render();
  return { go, next: () => go(i + 1), back: () => go(i - 1), get step() { return i; }, get total() { return total; } };
}

// Inline validation for one field: red border + message while invalid, Next disabled until it passes.
export function StepValidator(field, { input, error, hint, next, test, message }) {
  const render = () => {
    const ok = test(input.value);
    field.classList.toggle('is-error', !ok);
    if (error) { error.hidden = ok; if (message) error.lastChild.textContent = message; }
    if (hint) hint.hidden = ok;
    if (next) next.disabled = !ok;
    field.dispatchEvent(new CustomEvent('sw:validate', { detail: { valid: ok, value: input.value }, bubbles: true }));
  };
  input.addEventListener('input', render);
  render();
  return { get valid() { return test(input.value); } };
}

// Persist every field on every change so Back and a page refresh never wipe what was typed.
export function WizardState(root, { key = 'wizardState', step = 0, storage = globalThis.localStorage } = {}) {
  const fields = () => [...root.querySelectorAll('input[name], select[name], textarea[name]')];
  const read = () => { try { return JSON.parse(storage?.getItem(key) || 'null'); } catch { return null; } };
  const save = (s = step) => { step = s; const data = { step, fields: Object.fromEntries(fields().map(f => [f.name, f.value])) }; try { storage?.setItem(key, JSON.stringify(data)); } catch {} return data; };
  const restore = () => { const data = read(); if (!data) return null; for (const f of fields()) if (data.fields && f.name in data.fields) f.value = data.fields[f.name]; root.dispatchEvent(new CustomEvent('sw:restored', { detail: data, bubbles: true })); return data; };
  root.addEventListener('input', () => save());
  save();
  return { save, restore, read, clear: () => storage?.removeItem(key) };
}

// Rough cognitive-load score for a step: fields count against it, grouped short steps stay cheap.
export function cognitiveLoad(fieldCount) { return Math.min(100, Math.round(6 + fieldCount * fieldCount * 0.62)); }
