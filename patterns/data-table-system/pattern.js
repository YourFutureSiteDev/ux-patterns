// Data table as a system of six decisions: align, rows, density, sticky, cells, actions.
// Works on the .ds-app markup from pattern.css. Usage: const t = TableSystem(appEl); t.density(40); t.sort('Amount')

export const DENSITY = { compact: 40, default: 48, comfortable: 56 };

export function TableSystem(app, opts = {}) {
  if (!app) return null;
  const bus = new EventTarget();
  const grid = app.querySelector('.ds-grid'), head = app.querySelector('.ds-head'), body = app.querySelector('.ds-body');
  const rows = () => [...body.querySelectorAll('.ds-row')];

  // 03 Rows: one hairline, hover does the rest. The hovered row gets a tint and an accent bar (and, 07, its actions).
  body.addEventListener('pointerover', e => { const r = e.target.closest('.ds-row'); if (!r) return; rows().forEach(x => x.classList.toggle('is-hover', x === r)); });
  body.addEventListener('pointerleave', () => rows().forEach(x => x.classList.remove('is-hover')));
  body.addEventListener('focusin', e => { const r = e.target.closest('.ds-row'); if (r) rows().forEach(x => x.classList.toggle('is-hover', x === r)); });
  rows().forEach(r => { r.tabIndex = 0; });

  // 04 Density: one token drives every row height.
  function density(level) {
    const px = typeof level === 'number' ? level : DENSITY[level] ?? 48;
    app.style.setProperty('--ds-row', px + 'px');
    bus.dispatchEvent(new CustomEvent('density', { detail: { px } }));
    return px;
  }

  // 07 Actions: sort arrow on the active column only. Click a header to make it the active column (asc, then desc).
  let active = null, dir = 'asc';
  head.addEventListener('click', e => {
    const h = e.target.closest('span'); if (!h || h.classList.contains('is-act')) return;
    const label = h.firstChild?.textContent?.trim() || h.textContent.trim();
    sort(label);
  });
  function sort(label) {
    const cols = [...head.querySelectorAll(':scope > span')];
    const idx = cols.findIndex(c => c.textContent.trim().startsWith(label)); if (idx < 0) return;
    dir = active === label && dir === 'asc' ? 'desc' : 'asc'; active = label;
    cols.forEach((c, i) => { c.classList.toggle('is-active', i === idx); const s = c.querySelector('svg'); if (s) s.style.display = i === idx ? '' : 'none'; });
    const val = r => { const cell = r.children[idx]; const t = cell?.textContent.trim() || ''; const n = Number(t.replace(/[^0-9.-]/g, '')); return Number.isFinite(n) && /\d/.test(t) ? n : t.toLowerCase(); };
    const sorted = rows().sort((a, b) => { const x = val(a), y = val(b); return (x < y ? -1 : x > y ? 1 : 0) * (dir === 'asc' ? 1 : -1); });
    sorted.forEach(r => body.appendChild(r));
    bus.dispatchEvent(new CustomEvent('sort', { detail: { column: label, dir } }));
  }

  // 05 Sticky: pin the identity columns and the header. Uses real sticky positioning on a scrollable frame.
  function makeSticky({ columns = 2, header = true } = {}) {
    const scroll = app.querySelector('.ds-scroll'); scroll.style.overflow = 'auto';
    const pinCells = el => [...el.children].slice(0, columns).forEach((c, i) => { c.style.position = 'sticky'; c.style.left = (i ? el.children[0].offsetWidth : 0) + 'px'; c.style.background = 'inherit'; c.style.zIndex = 2; });
    pinCells(head); rows().forEach(pinCells);
    if (header) { head.style.position = 'sticky'; head.style.top = '0'; head.style.background = 'var(--ds-panel)'; head.style.zIndex = 3; }
    return scroll;
  }

  // 06 Cells: missing gets a dash, long text truncates with a tooltip, numbers never truncate.
  function setCell(row, field, value) {
    const r = typeof row === 'string' ? body.querySelector(`[data-id="${row}"]`) : row; if (!r) return;
    const map = { due: '.ds-date', name: '.ds-cust span', amount: '.ds-num' }; const el = r.querySelector(map[field]); if (!el) return;
    if (value === null || value === undefined || value === '') { el.textContent = '–'; el.classList.remove('is-q'); return; }
    el.textContent = value; if (field === 'name') el.title = value; // tooltip on hover, one line per row
  }

  return { density, sort, makeSticky, setCell, on: (t, f) => bus.addEventListener(t, f), el: app, get rows() { return rows(); } };
}
