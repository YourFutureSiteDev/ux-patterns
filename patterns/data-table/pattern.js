// Data table as a system: tri-state sort (asc → desc → natural), whole-row selection with a select-all that
// morphs empty → indeterminate → checked, and density as one token. Works on the .dt-table markup from pattern.css.
// Usage: const t = DataTable(tableEl); t.sort('amount'); t.density('compact'); t.on('select', e => e.detail.selected)

const NEXT = { none: 'asc', asc: 'desc', desc: 'none' };
const DENSITY = { compact: 36, comfortable: 48, spacious: 60 };

export function DataTable(root, opts = {}) {
  if (!root) return null;
  const bus = new EventTarget();
  const body = root.querySelector('.dt-body'), head = root.querySelector('.dt-head');
  const natural = [...body.querySelectorAll('.dt-row')]; // remember the original order so the third click can restore it
  let state = head.querySelector('.is-sort.is-none') ? 'none' : head.querySelector('.is-sort') ? (head.querySelector('.is-sort use')?.getAttribute('href') === '#i-up' ? 'asc' : 'desc') : 'none';

  const value = row => { const t = row.querySelector('.dt-num')?.textContent || ''; return Number(t.replace(/[^0-9.-]/g, '')) || 0; };
  const sortIcon = s => s === 'asc' ? '#i-up' : s === 'desc' ? '#i-down' : '#i-updown';

  // Tri-state sort. A binary toggle would lose the natural order forever; this cycles back to it.
  function sort(next = NEXT[state]) {
    state = next;
    const rows = state === 'none' ? natural : [...natural].sort((a, b) => state === 'asc' ? value(a) - value(b) : value(b) - value(a));
    rows.forEach(r => body.appendChild(r));
    const h = head.querySelector('.is-sort'); if (h) { h.classList.toggle('is-none', state === 'none'); h.querySelector('use')?.setAttribute('href', sortIcon(state)); }
    bus.dispatchEvent(new CustomEvent('sort', { detail: { state } }));
    return state;
  }

  // Whole-row selection: the row is the hit target, the checkbox just reflects it.
  const rows = () => [...body.querySelectorAll('.dt-row')];
  const selected = () => rows().filter(r => r.classList.contains('is-selected')).map(r => r.dataset.name);
  function setRow(row, on) { row.classList.toggle('is-selected', on); row.querySelector('.dt-check')?.classList.toggle('is-on', on); }
  function syncAll() {
    const n = selected().length, all = rows().length, box = head.querySelector('.dt-check');
    if (box) { box.classList.toggle('is-on', n === all && all > 0); box.classList.toggle('is-mixed', n > 0 && n < all); }
    bus.dispatchEvent(new CustomEvent('select', { detail: { selected: selected(), count: n, total: all } }));
  }
  function toggle(row) { setRow(row, !row.classList.contains('is-selected')); syncAll(); }
  function selectAll(on = selected().length !== rows().length) { rows().forEach(r => setRow(r, on)); syncAll(); }

  // Density as a token: one control, one variable.
  function density(level) {
    root.classList.remove('is-compact', 'is-comfortable', 'is-spacious');
    if (DENSITY[level]) root.classList.add('is-' + level);
    root.style.setProperty('--dt-row-token', DENSITY[level] + 'px');
    bus.dispatchEvent(new CustomEvent('density', { detail: { level, px: DENSITY[level] } }));
  }

  head.addEventListener('click', e => { if (e.target.closest('.is-sort')) sort(); else if (e.target.closest('.dt-check')) selectAll(); });
  body.addEventListener('click', e => { const row = e.target.closest('.dt-row'); if (row && row.querySelector('.dt-check')) toggle(row); });
  body.addEventListener('keydown', e => { const row = e.target.closest('.dt-row'); if (row && (e.key === ' ' || e.key === 'Enter')) { toggle(row); e.preventDefault(); } });
  rows().forEach(r => { if (r.querySelector('.dt-check')) { r.tabIndex = 0; r.setAttribute('role', 'row'); r.setAttribute('aria-selected', r.classList.contains('is-selected')); } });

  return { sort, toggle, selectAll, density, get state() { return state; }, get selected() { return selected(); }, on: (t, f) => bus.addEventListener(t, f), el: root };
}

// Sticky header + frozen first column for a scrolling frame: adds the depth shadow once the body has scrolled.
export function freezeFrame(frame) {
  const scroller = frame.querySelector('.dt-scroll') || frame;
  const head = frame.querySelector('.dt-head');
  const update = () => { head?.classList.toggle('is-sticky', frame.scrollTop > 0); frame.classList.toggle('is-scrolled-x', frame.scrollLeft > 0); };
  frame.addEventListener('scroll', update, { passive: true }); update();
  return update;
}
