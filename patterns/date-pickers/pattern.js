// Date pickers: presets first, live range preview on hover, click to lock, drag to refine,
// two months side by side, full keyboard, and a full-screen sheet on mobile.

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const fmt = (d, opts = { month: 'short', day: 'numeric' }) => d.toLocaleDateString('en-US', opts);
export const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();
export const firstDow = (y, m) => new Date(y, m, 1).getDay();

// Render one month grid. `marks` decorates cells by day number or by grid index:
//   in: [fromIdx, toIdx]     dim range fill across grid cells (index = firstDow + day - 1), padding cells included
//   bright: [days]           endpoints (bright fill, rounded)
//   sel: day                 single selection (pink)
//   focus: day               keyboard focus ring
//   hover: [fromDay, toDay]  dashed hover preview
// Returns the HTML string; the caller sets the grid's --pitch / --cell tokens in CSS.
export function monthGrid({ year, month, first, days, rows, marks = {}, head = true, title = null } = {}) {
  first = first ?? firstDow(year, month); days = days ?? daysIn(year, month);
  const total = rows ? rows * 7 : Math.ceil((first + days) / 7) * 7;
  let html = '';
  if (title) html += `<div class="dp-month__title">${title}</div>`;
  if (head) html += `<div class="dp-dow">${DOW.map(d => `<span>${d}</span>`).join('')}</div>`;
  html += '<div class="dp-days">';
  for (let i = 0; i < total; i++) {
    const day = i - first + 1, empty = day < 1 || day > days;
    const cls = ['dp-d'];
    if (empty) cls.push('is-empty');
    if (marks.in && i >= marks.in[0] && i <= marks.in[1]) cls.push('is-in');
    if (!empty) {
      if (marks.bright?.includes(day)) cls.push('is-bright');
      if (marks.sel === day) cls.push('is-sel');
      if (marks.focus === day) cls.push('is-focus');
      if (marks.hover && day >= marks.hover[0] && day <= marks.hover[1]) cls.push('is-hover');
      if (marks.dim?.includes(day)) cls.push('is-dim');
    }
    html += `<span class="${cls.join(' ')}" data-day="${empty ? '' : day}"><i>${empty ? '' : day}</i></span>`;
  }
  return html + '</div>';
}

// Presets cover ~90% of cases. Each returns [start, end] relative to `today`.
export const PRESETS = {
  'Today': t => [t, t],
  'Yesterday': t => { const d = shift(t, -1); return [d, d]; },
  'Last 7 days': t => [shift(t, -7), t],
  'Last 30 days': t => [shift(t, -30), t],
  'Last quarter': t => { const q = Math.floor(t.getMonth() / 3) - 1, y = t.getFullYear() + (q < 0 ? -1 : 0), m = ((q + 4) % 4) * 3; return [new Date(y, m, 1), new Date(y, m + 3, 0)]; },
  'Custom range': null
};
const shift = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const same = (a, b) => a && b && a.toDateString() === b.toDateString();

// Range picker over one or more month grids rendered by monthGrid. Hover paints a preview, first click
// locks the start, second locks the end, the edges stay draggable, and the keyboard does everything.
export function RangePicker(root, { year, month, months = 2, today = new Date(), onChange } = {}) {
  let start = null, end = null, hover = null, focus = new Date(year, month, 1), dragging = null;
  const state = () => ({ start, end });
  const render = () => {
    root.innerHTML = '';
    for (let k = 0; k < months; k++) {
      const y = year + Math.floor((month + k) / 12), m = (month + k) % 12;
      const first = firstDow(y, m), n = daysIn(y, m);
      const lo = start, hi = end || (start && hover) || null;
      const [a, b] = lo && hi && hi < lo ? [hi, lo] : [lo, hi];
      const idx = d => (d.getFullYear() === y && d.getMonth() === m) ? first + d.getDate() - 1 : (d < new Date(y, m, 1) ? 0 : first + n - 1);
      const marks = {};
      if (a && b && !(b < new Date(y, m, 1)) && !(a > new Date(y, m + 1, 0))) marks.in = [idx(a), idx(b)];
      marks.bright = [a, b].filter(d => d && d.getFullYear() === y && d.getMonth() === m).map(d => d.getDate());
      if (focus.getFullYear() === y && focus.getMonth() === m) marks.focus = focus.getDate();
      const wrap = document.createElement('div'); wrap.className = 'dp-month'; wrap.dataset.y = y; wrap.dataset.m = m;
      wrap.innerHTML = monthGrid({ year: y, month: m, marks, title: `${MONTHS[m]} ${y}` });
      root.appendChild(wrap);
    }
    root.dispatchEvent(new CustomEvent('dp:change', { detail: state() }));
    onChange?.(state());
  };
  const dateOf = el => { const c = el.closest('.dp-d'); if (!c || !c.dataset.day) return null; const w = c.closest('.dp-month'); return new Date(+w.dataset.y, +w.dataset.m, +c.dataset.day); };
  root.addEventListener('mousemove', e => { const d = dateOf(e.target); if (!d) return; if (dragging) { if (dragging === 'start') start = d; else end = d; if (end < start) [start, end] = [end, start]; render(); } else if (start && !end && !same(d, hover)) { hover = d; render(); } });
  root.addEventListener('mousedown', e => { const d = dateOf(e.target); if (!d || !start || !end) return; if (same(d, start)) dragging = 'start'; if (same(d, end)) dragging = 'end'; if (dragging) e.preventDefault(); });
  window.addEventListener('mouseup', () => { dragging = null; });
  root.addEventListener('click', e => { const d = dateOf(e.target); if (!d || dragging) return; if (!start || end) { start = d; end = null; hover = null; } else { end = d; if (end < start) [start, end] = [end, start]; } focus = d; render(); });
  root.tabIndex = 0;
  root.addEventListener('keydown', e => {
    const k = e.key, f = new Date(focus);
    if (k === 'ArrowLeft') f.setDate(f.getDate() - 1); else if (k === 'ArrowRight') f.setDate(f.getDate() + 1);
    else if (k === 'ArrowUp') f.setDate(f.getDate() - 7); else if (k === 'ArrowDown') f.setDate(f.getDate() + 7);
    else if (k === 'Home') f.setDate(f.getDate() - f.getDay()); else if (k === 'End') f.setDate(f.getDate() + 6 - f.getDay());
    else if (k === 'PageUp') { if (e.shiftKey) f.setFullYear(f.getFullYear() - 1); else f.setMonth(f.getMonth() - 1); }
    else if (k === 'PageDown') { if (e.shiftKey) f.setFullYear(f.getFullYear() + 1); else f.setMonth(f.getMonth() + 1); }
    else if (k === 'Enter' || k === ' ') { if (!start || end) { start = f; end = null; } else { end = f; if (end < start) [start, end] = [end, start]; } }
    else if (k === 'Escape') { start = end = hover = null; root.dispatchEvent(new CustomEvent('dp:close')); }
    else return;
    e.preventDefault(); focus = f;
    if (f < new Date(year, month, 1) || f > new Date(year, month + months, 0)) { year = f.getFullYear(); month = f.getMonth(); }
    render();
  });
  render();
  return {
    get value() { return state(); },
    set(a, b) { start = a; end = b; hover = null; render(); },
    preset(name) { const p = PRESETS[name]; if (p) { [start, end] = p(today); render(); } },
    go(delta) { month += delta; year += Math.floor(month / 12); month = ((month % 12) + 12) % 12; render(); },
    summary() { if (!start) return 'Pick a date'; const n = end ? Math.round((end - start) / 864e5) + 1 : null; return `${fmt(start)} → ${end ? fmt(end) : '—'}${n ? ` · ${n} day${n > 1 ? 's' : ''}` : ''}`; }
  };
}

// Typed input: MM/DD/YYYY mask, validates as you type, keeps the picker in sync.
export function DateInput(input, picker) {
  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
    input.value = parts.join('/');
    input.classList.toggle('is-invalid', digits.length === 8 && !valid(digits));
    if (digits.length === 8 && valid(digits)) { const d = new Date(+digits.slice(4), +digits.slice(0, 2) - 1, +digits.slice(2, 4)); picker?.set(d, d); }
  });
  const valid = s => { const m = +s.slice(0, 2), d = +s.slice(2, 4), y = +s.slice(4); return m >= 1 && m <= 12 && d >= 1 && d <= daysIn(y, m - 1); };
}
