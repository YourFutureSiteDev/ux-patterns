// Bulk actions: selection lives in application state (a Set of ids), not in the DOM.
// The header checkbox derives its tri-state from that Set; shift-click picks a range; the ids survive paging.
// Usage: const sel = SelectionModel(allIds); sel.toggle(id); sel.state() -> 'none' | 'some' | 'all'
export function SelectionModel(allIds = []) {
  const ids = new Set(); let all = [...allIds], anchor = null, total = all.length;
  const listeners = new Set(); const emit = () => listeners.forEach(f => f(api));
  const api = {
    has: id => ids.has(id), get size() { return ids.size; }, get ids() { return [...ids]; },
    add(id) { ids.add(id); anchor = id; emit(); }, remove(id) { ids.delete(id); emit(); },
    toggle(id, shift = false) {                                   // shift-click: range from the anchor
      if (shift && anchor !== null) { const a = all.indexOf(anchor), b = all.indexOf(id); if (a >= 0 && b >= 0) { for (let i = Math.min(a, b); i <= Math.max(a, b); i++) ids.add(all[i]); emit(); return; } }
      ids.has(id) ? ids.delete(id) : ids.add(id); anchor = id; emit();
    },
    setMatching(n) { total = n; emit(); },                        // the true count behind "Select all N matching"
    selectAll() { all.forEach(id => ids.add(id)); emit(); },      // partial always resolves to select-all, never to clear
    selectAllMatching() { all.forEach(id => ids.add(id)); api.allMatching = true; emit(); },
    clear() { ids.clear(); api.allMatching = false; emit(); },
    state(visible = all) { const n = visible.filter(id => ids.has(id)).length; return n === 0 ? 'none' : n === visible.length ? 'all' : 'some'; },
    headerClick(visible = all) { api.state(visible) === 'all' ? visible.forEach(id => ids.delete(id)) : visible.forEach(id => ids.add(id)); emit(); },
    setPage(pageIds) { pageIds.forEach(id => { if (!all.includes(id)) all.push(id); }); emit(); }, // ids from other pages stay selected
    count() { return api.allMatching ? total : ids.size; },
    onChange(f) { listeners.add(f); return () => listeners.delete(f); },
  };
  return api;
}

// Render member rows into a container. opts: { selected: [1-based row numbers], dim: [...], range: [...] }
export function renderRows(el, members, opts = {}) {
  const sel = new Set(opts.selected || []), dim = new Set(opts.dim || []), range = new Set(opts.range || []);
  el.innerHTML = members.map((m, i) => {
    const n = i + 1, on = sel.has(n);
    const cls = 'ba-row' + (on ? ' is-selected' : '') + (range.has(n) ? ' is-range' : '') + (dim.has(n) ? ' is-dim' : '');
    const initials = m.name.split(' ').map(w => w[0]).join('');
    return `<div class="${cls}" data-id="${m.id}"><button class="ba-check${on ? ' is-checked' : ''}" aria-label="Select ${m.name}"><svg class="ba-check__tick"><use href="#ck-tick"/></svg><svg class="ba-check__dash"><use href="#ck-dash"/></svg></button><div class="ba-row__avatar">${initials}</div><div class="ba-row__who"><div class="ba-row__name">${m.name}</div><div class="ba-row__mail">${m.mail}</div></div><div class="ba-row__plan"><span class="ba-pill ba-pill--${m.plan.toLowerCase()}">${m.plan}</span></div><div class="ba-row__seen">${m.seen}</div></div>`;
  }).join('');
}

// Wire a rendered table to a SelectionModel: row clicks toggle (shift for range), header click resolves tri-state.
export function bindTable(tableEl, model, members) {
  const head = tableEl.querySelector('.ba-thead .ba-check'), ids = members.map(m => m.id);
  const paint = () => {
    tableEl.querySelectorAll('.ba-row').forEach(r => { const on = model.has(r.dataset.id); r.classList.toggle('is-selected', on); r.querySelector('.ba-check').classList.toggle('is-checked', on); });
    const s = model.state(ids); head.classList.toggle('is-checked', s === 'all'); head.classList.toggle('is-partial', s === 'some');
    head.setAttribute('aria-checked', s === 'all' ? 'true' : s === 'some' ? 'mixed' : 'false');
  };
  tableEl.addEventListener('click', e => { const row = e.target.closest('.ba-row'); if (row) model.toggle(row.dataset.id, e.shiftKey); });
  head.addEventListener('click', () => model.headerClick(ids));
  model.onChange(paint); paint();
}

// Undo countdown: writes the seconds remaining into el, starting from `elapsed` seconds in. Returns a cancel function.
export function UndoCountdown(el, seconds = 10, elapsed = 0, frozen = false, onExpire) {
  let left = Math.max(0, Math.ceil(seconds - elapsed)); el.textContent = left;
  if (frozen) return () => {};
  const iv = setInterval(() => { left -= 1; el.textContent = Math.max(0, left); if (left <= 0) { clearInterval(iv); onExpire && onExpire(); } }, 1000);
  return () => clearInterval(iv);
}

// Destructive bulk action without a confirm modal: run it now, echo the count, keep the ids for `seconds` so it can be undone.
export function bulkDelete(model, { run, undo, seconds = 10 } = {}) {
  const ids = model.ids, count = model.count();
  run && run(ids); model.clear();
  let timer = setTimeout(() => { timer = null; }, seconds * 1000);
  return { count, ids, undo() { if (!timer) return false; clearTimeout(timer); timer = null; undo && undo(ids); ids.forEach(id => model.add(id)); return true; } };
}
