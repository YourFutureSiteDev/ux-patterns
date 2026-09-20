// Settings System: instant toggles, explicit save for identity, grouped sections, search, modified state
// with per-setting reset, and a danger zone gated behind typing the resource name.

// Low-stakes toggle: flips on click, commits at once, fires ss:saved (wire a fetch in `commit`).
export function InstantToggle(btn, opts = {}) {
  const commit = opts.commit || (() => Promise.resolve());
  btn.setAttribute('role', 'switch'); btn.setAttribute('aria-checked', btn.classList.contains('is-on'));
  btn.addEventListener('click', async () => {
    const on = btn.classList.toggle('is-on'); btn.setAttribute('aria-checked', on);
    await commit(on); btn.dispatchEvent(new CustomEvent('ss:saved', { detail: { on }, bubbles: true }));
  });
  return { get on() { return btn.classList.contains('is-on'); } };
}

// Identity field: edits are staged, an unsaved bar appears, and only an explicit Save (or Cancel) resolves it.
export function ExplicitForm({ input, initial, bar, dot, save, cancel, commit }) {
  let saved = initial ?? input.value;
  const dirty = () => input.value !== saved;
  const render = () => { const d = dirty(); bar?.classList.toggle('is-open', d); if (bar) bar.style.opacity = d ? 1 : 0; if (dot) dot.style.opacity = d ? 1 : 0; };
  input.addEventListener('input', render);
  save?.addEventListener('click', async () => { await (commit || (() => Promise.resolve()))(input.value); saved = input.value; render(); input.dispatchEvent(new CustomEvent('ss:saved', { bubbles: true })); });
  cancel?.addEventListener('click', () => { input.value = saved; render(); });
  render();
  return { get dirty() { return dirty(); } };
}

// Advanced section: one click reveals the depth, the common path stays short.
export function Collapsible(trigger, body, opts = {}) {
  let open = !!opts.open;
  const render = () => { body.hidden = !open; trigger.setAttribute('aria-expanded', open); const chev = trigger.querySelector('.ss-row__chev svg use'); if (chev) chev.setAttribute('href', open ? '#i-chevd' : '#i-chev'); };
  trigger.addEventListener('click', () => { open = !open; render(); });
  render();
  return { get open() { return open; }, set(v) { open = v; render(); } };
}

// Search: filters rows by query, highlights the match, hides the rest, Enter opens the first hit.
// `rows` is optional: a list of { el, label, section } to filter; the demo only wires the highlight.
export function SettingsSearch(input, { rows = [], name, label, onOpen } = {}) {
  const mark = (text, q) => { if (!q) return text; const i = text.toLowerCase().indexOf(q.toLowerCase()); return i < 0 ? text : `${text.slice(0, i)}<span class="ss-mark">${text.slice(i, i + q.length)}</span>${text.slice(i + q.length)}`; };
  const render = () => {
    const q = input.value.trim();
    if (name && label) name.innerHTML = mark(label, q);
    let hits = 0;
    for (const r of rows) { const hit = !q || r.label.toLowerCase().includes(q.toLowerCase()); r.el.hidden = !hit; if (hit) hits++; const n = r.el.querySelector('.ss-row__name'); if (n) n.innerHTML = mark(r.label, q); }
    input.dispatchEvent(new CustomEvent('ss:filter', { detail: { query: q, hits, hidden: rows.length - hits }, bubbles: true }));
  };
  input.addEventListener('input', render);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { const first = rows.find(r => !r.el.hidden); onOpen?.(first); } });
  render();
  return { render };
}

// Modified state: each changed value gets a dot, a reset button and a place in the "N modified" count.
export function ModifiedSettings(root, { count, defaults, values, render = {} }) {
  const state = { ...values };
  const paint = () => {
    let n = 0;
    for (const key of Object.keys(defaults)) {
      const mod = state[key] !== defaults[key]; if (mod) n++;
      const row = root.querySelector(`[data-key="${key}"]`); if (!row) continue;
      row.querySelector('.ss-row__name')?.classList.toggle('is-mod', mod);
      row.querySelector('.ss-reset')?.classList.toggle('is-on', mod);
      render[key]?.(state[key]);
    }
    if (count) count.textContent = `${n} modified`;
  };
  root.addEventListener('click', e => { const b = e.target.closest('[data-reset]'); if (!b) return; state[b.dataset.reset] = defaults[b.dataset.reset]; paint(); root.dispatchEvent(new CustomEvent('ss:reset', { detail: { key: b.dataset.reset }, bubbles: true })); });
  paint();
  return { set(key, v) { state[key] = v; paint(); }, get state() { return { ...state }; } };
}

// Danger zone: the delete button only arms once the typed name matches exactly.
export function DangerConfirm({ input, name, fill, counter, button, onConfirm }) {
  const render = () => {
    const v = input.value, ok = v === name;
    let match = 0; while (match < v.length && match < name.length && v[match] === name[match]) match++;
    if (fill) fill.style.setProperty('--p', `${(match / name.length) * 100}%`);
    if (counter) counter.textContent = `${match}/${name.length}`;
    button.disabled = !ok;
  };
  input.addEventListener('input', render);
  button.addEventListener('click', () => { if (input.value === name) onConfirm?.(name); });
  render();
  return { get armed() { return input.value === name; } };
}
