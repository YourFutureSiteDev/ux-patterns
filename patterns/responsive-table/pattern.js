// Responsive table, rebuilt from the @designmotionhq reel "Your table doesn't fit a phone".
// Six moves: rank columns by use (identity, value, state), stack two lines per row, keep one slot for the
// amount, label the ambiguous, reveal hidden columns in an expand or a sheet, and let the table own its
// breakpoint with a container query.

export const INVOICES = [
  { id: 'INV-2041', ini: 'AL', name: 'Ada Lindqvist',   short: 'Ada Lindqvist',   amount: '$1,204.00',  status: 'Paid',    date: 'Mar 04' },
  { id: 'INV-2042', ini: 'MO', name: 'Marcus Oyelaran', short: 'Marcus Oyela…',   amount: '$89.50',     status: 'Open',    date: 'Mar 09' },
  { id: 'INV-2043', ini: 'PN', name: 'Priya Natarajan', short: 'Priya Natarajan', amount: '$12,480.75', status: 'Overdue', date: 'Feb 27' },
  { id: 'INV-2044', ini: 'TR', name: 'Tomas Ricci',     short: 'Tomas Ricci',     amount: '$340.00',    status: 'Paid',    date: 'Mar 12' },
  { id: 'INV-2045', ini: 'NH', name: 'Noor Haddad',     short: 'Noor Haddad',     amount: '$7.99',      status: 'Draft',   date: 'Mar 15' },
  { id: 'INV-2046', ini: 'EV', name: 'Elena Vasquez',   short: 'Elena Vasquez',   amount: '$2,015.20',  status: 'Open',    date: 'Mar 18' },
  { id: 'INV-2047', ini: 'KB', name: 'Kwame Boateng',   short: 'Kwame Boate…',    amount: '$560.00',    status: 'Paid',    date: 'Mar 21' },
  { id: 'INV-2048', ini: 'SO', name: 'Sofia Oliveira',  short: 'Sofia Oliveira',  amount: '$3,120.00',  status: 'Open',    date: 'Mar 24' },
  { id: 'INV-2049', ini: 'ID', name: 'Ibrahim Diallo',  short: 'Ibrahim Diallo',  amount: '$148.00',    status: 'Paid',    date: 'Mar 26' },
  { id: 'INV-2050', ini: 'HK', name: 'Hana Kobayashi',  short: 'Hana Kobayashi',  amount: '$890.40',    status: 'Draft',   date: 'Mar 28' },
  { id: 'INV-2051', ini: 'LM', name: 'Lucas Moreau',    short: 'Lucas Moreau',    amount: '$5,600.00',  status: 'Open',    date: 'Mar 30' },
  { id: 'INV-2052', ini: 'AO', name: 'Amara Okafor',    short: 'Amara Okafor',    amount: '$72.00',     status: 'Paid',    date: 'Apr 02' },
];
export const DETAIL = { id: 'INV-2043', name: 'Priya Natarajan', status: 'Overdue', fields: [['Amount', '$12,480.75'], ['Due', 'Due Feb 27'], ['Issued', 'Jan 28'], ['Plan', 'Scale'], ['Seats', '84'], ['Method', 'Transfer'], ['Terms', 'Net 15'], ['Owner', 'L. Petit']], invoice: 'INV-2043', note: 'PO 4471, second reminder sent' };

const I = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  chev: '<path d="M6 9l6 6 6-6"/>', chevUp: '<path d="M6 15l6-6 6 6"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',
  sort: '<path d="M8 4v16M8 20l-3-3M8 20l3-3M16 20V4M16 4l-3 3M16 4l3 3"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  zoom: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M8 11h6"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  dots: '<circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
};
export const icon = (n, cls = '', sw = 1.8) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;
export const pill = (s, cls = '') => `<span class="rt-pill is-${s.toLowerCase()} ${cls}">${s}</span>`;

export function phoneChrome(o = {}) {
  const sort = o.sort ? `<button class="rt-btn rt-btn--sort">${icon('sort')}Sort · Due date</button>` : '';
  return `<div class="rt-status"><span>9:41</span><i class="rt-notch"></i><span class="rt-status__icons"><svg viewBox="0 0 20 12" fill="currentColor"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="5" y="2" width="3" height="10" rx="1"/><rect x="10" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 26 12" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1" y="1" width="21" height="10" rx="3"/><rect x="3" y="3" width="17" height="6" rx="1.5" fill="currentColor" stroke="none"/><path d="M24 4.5v3" stroke-linecap="round"/></svg></span></div>
  <div class="rt-head"><i class="rt-head__logo">${icon('table', '', 2)}</i><b>Lumen Billing</b><span class="rt-head__right">${icon('bell')}<i class="rt-avatar">JK</i></span></div>
  <div class="rt-tools${o.sort ? ' has-sort' : ''}"><div class="rt-search">${icon('search')}Search</div><button class="rt-btn">${icon('filter')}Status${icon('chev')}</button>${sort}</div>`;
}

// One two-line row: name left, amount right, state below. o: { due: 'Due'|'', amountInline, chevron, expanded, dim }
export const listRow = (r, o = {}) => `<div class="rt-item${o.expanded ? ' is-open' : ''}${o.dim ? ' is-dim' : ''}" data-id="${r.id}">
  <i class="rt-avatar rt-avatar--lg">${r.ini}</i>
  <div class="rt-item__body"><div class="rt-item__top"><b>${r.name}</b>${o.amountInline ? `<span class="rt-item__date">${r.date}</span>` : `<span class="rt-item__amt">${r.amount}</span>`}</div>
  <div class="rt-item__meta">${pill(r.status)}${o.amountInline ? `<span class="rt-item__amt rt-item__amt--inline">${r.amount}</span>` : `<span class="rt-item__due">${o.due === '' ? '' : (o.due ?? 'Due') + ' '}${r.date}</span>`}${o.chevron ? icon(o.expanded ? 'chevUp' : 'chev', 'rt-item__chev') : ''}</div>
  ${o.expanded ? `<div class="rt-item__more"><div class="rt-kv"><span>Invoice</span><code>${DETAIL.invoice}</code><a class="rt-link">Full record ${icon('ext', '', 2)}</a></div><div class="rt-kv"><span>Note</span><em>${DETAIL.note}</em></div><div class="rt-item__actions"><button class="rt-btn rt-btn--ghost">Send reminder</button><button class="rt-btn rt-btn--fill">Mark paid</button></div></div>` : ''}</div></div>`;

// Render the phone. o.mode: 'dense' | 'zoom' | 'ranked' | 'boxed' | 'list'. See demo.html for the per-scene options.
export function renderPhone(root, o = {}) {
  root.classList.add('rt-phone'); const mode = o.mode || 'list', rows = o.rows ?? INVOICES;
  let body = '';
  if (mode === 'dense') body = `<div class="rt-dense"><div class="rt-dense__h"><span>Invoice</span><span>Customer</span><span class="r">Amount</span><span>Status</span><span>Due date ${icon('chev', '', 2.4)}</span><span></span></div>
    ${rows.map(r => `<div class="rt-dense__r"><code>${r.id}</code><span><i class="rt-avatar rt-avatar--xs">${r.ini}</i>${r.short}</span><b>${r.amount}</b><span>${pill(r.status, 'rt-pill--xs')}</span><span class="d">${r.date}</span><span class="m">${icon('dots')}</span></div>`).join('')}
    <div class="rt-scrollbar"><i style="width:${o.thumb ?? 100}%"></i></div></div>`;
  if (mode === 'zoom') body = `${o.chips ? '<div class="rt-chips"><span class="rt-chip">6 columns</span><span class="rt-chip">3 fit on one line</span></div><i class="rt-bracket"></i>' : ''}<div class="rt-zoom"><div class="rt-zoom__h"><span>Invoice</span><span>Customer</span><span class="r">Amount</span><span>Status</span></div>
    ${rows.slice(0, o.count ?? 7).map(r => `<div class="rt-zoom__r"><code>${r.id}</code><span><i class="rt-avatar rt-avatar--sm">${r.ini}</i>${r.short}</span><b>${r.amount}</b><span>${pill(r.status)}</span></div>`).join('')}
    ${o.scrollbar ? '<div class="rt-scrollbar rt-scrollbar--big"><i style="width:70%"></i></div>' : ''}</div>`;
  if (mode === 'ranked') body = `<div class="rt-ranks">${['P3', 'P1', 'P1', 'P2', 'P2', 'P3'].map((p, i) => `<i class="rt-rank is-${p.toLowerCase()}" style="left:${[26, 111, 205, 280, 346, 395][i]}px">${p}</i>`).join('')}</div>
    <div class="rt-dense rt-dense--ranked"><div class="rt-dense__h"><span>Invoice</span><span>Customer</span><span class="r">Amount</span><span>Status</span><span>Due date ${icon('chev', '', 2.4)}</span><span></span></div>
    ${rows.slice(0, 7).map(r => `<div class="rt-dense__r"><code>${r.id}</code><span><i class="rt-avatar rt-avatar--xs">${r.ini}</i>${r.short}</span><b>${r.amount}</b><span>${pill(r.status, 'rt-pill--xs')}</span><span class="d">${r.date}</span><span class="m">${icon('dots')}</span></div>`).join('')}</div>
    <div class="rt-legend"><div><i class="rt-rank is-p1">P1</i><b>Identity</b><span>Customer</span></div><div><i class="rt-rank is-p1">P1</i><b>Value</b><span>Amount</span></div><div><i class="rt-rank is-p2">P2</i><b>State</b><span>Status</span></div></div>`;
  if (mode === 'boxed') body = `<div class="rt-ranks rt-ranks--3">${['P1', 'P1', 'P2'].map((p, i) => `<i class="rt-rank is-${p.toLowerCase()}" style="left:${[87, 233, 350][i]}px">${p}</i>`).join('')}</div>
    <div class="rt-boxed"><div class="rt-boxed__h"><span>Customer</span><span class="r">Amount</span><span>Status</span></div>
    ${rows.slice(0, 7).map(r => `<div class="rt-boxed__r"><span><i class="rt-avatar rt-avatar--sm">${r.ini}</i>${r.name}</span><b>${r.amount}</b><span>${pill(r.status)}</span></div>`).join('')}</div>`;
  if (mode === 'list') { const list = o.order ? o.order.map(i => rows[i]) : rows.slice(0, o.count ?? 6);
    body = `<div class="rt-list${o.fade === false ? '' : ' is-fade'}">${o.column ? '<i class="rt-column"></i>' : ''}${o.line ? '<i class="rt-line"></i>' : ''}${list.map((r, i) => listRow(r, { ...o, expanded: o.expanded === i })).join('')}</div>`; }
  root.innerHTML = `<div class="rt-screen${o.dim ? ' is-dim' : ''}">${phoneChrome(o)}${body}</div>${o.sheet ? sheetHTML() : ''}${o.extra || ''}`;
  return root;
}

export const sheetHTML = () => `<div class="rt-sheet"><i class="rt-sheet__grab"></i><div class="rt-sheet__top"><div><code>${DETAIL.id}</code><span>${DETAIL.name}</span></div>${pill(DETAIL.status)}</div>${DETAIL.fields.map(([k, v]) => `<div class="rt-sheet__row"><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;

// Desktop window. o.mode: 'table' | 'cards' | 'overview'; o.width px.
export function renderDesktop(root, o = {}) {
  root.classList.add('rt-desk'); const mode = o.mode || 'table'; root.style.width = (o.width ?? 624) + 'px';
  const bar = `<div class="rt-desk__bar"><i></i><i></i><i></i><code>${o.url || 'lumen.app/invoices'}</code></div>`;
  let body = '';
  if (mode === 'table') body = `<div class="rt-desk__head"><i class="rt-head__logo">${icon('table', '', 2)}</i><b>Invoices</b><span class="rt-count">128</span><button class="rt-btn rt-btn--fill rt-btn--new">${icon('plus', '', 2.4)}New invoice</button></div>
    <div class="rt-grid"><div class="rt-grid__h"><span>Invoice</span><span>Customer</span><span class="r">Amount</span><span>Status</span><span>Due date ${icon('chev', '', 2.4)}</span><span></span></div>
    ${INVOICES.slice(0, 7).map((r, i) => `<div class="rt-grid__r"><code>${r.id}</code><span><i class="rt-avatar rt-avatar--sm">${r.ini}</i>${i === 1 ? r.short : r.name}</span><b>${r.amount}</b><span>${pill(r.status)}</span><span class="d">${r.date}</span><span class="m">${icon('dots')}</span></div>`).join('')}</div>`;
  if (mode === 'cards') body = `<div class="rt-list rt-list--desk">${[2, 0, 1, 3, 4, 5].map(i => listRow(INVOICES[i])).join('')}</div>`;
  if (mode === 'overview') body = `<div class="rt-over"><div class="rt-rail">${['<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>', '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/>', '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>', '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>', I.bell].map((d, i) => `<i class="${i === 1 ? 'is-on' : ''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg></i>`).join('')}</div>
    <div class="rt-over__main"><b class="rt-over__title">Overview</b><div class="rt-stats"><div><span>Revenue</span><b>$48,210</b></div><div><span>Open</span><b>31</b></div><div><span>Overdue</span><b>4</b></div></div>
    <div class="rt-chart">${[36, 58, 46, 74, 54, 84, 62, 92, 70, 66, 122, 130].map((h, i) => `<i style="height:${h}px" class="${i === 11 ? 'is-on' : ''}"></i>`).join('')}</div></div>
    <div class="rt-over__panel"><div class="rt-over__ph"><b>Recent invoices</b><a>See all</a></div>${[2, 0, 1, 3, 4, 5, 6].map(i => listRow(INVOICES[i])).join('')}</div></div>`;
  root.innerHTML = bar + body; return root;
}

// Live behaviour: one table, its own breakpoint. The wrapper is a CSS container; under 700px the grid hides and
// the two-line list shows (pattern.css). Tapping a row expands it; "Full record" opens the sheet, never a page.
export function ResponsiveTable(root, o = {}) {
  root.classList.add('rt-live');
  const rows = o.rows || INVOICES;
  const grid = document.createElement('div'); grid.className = 'rt-grid';
  grid.innerHTML = `<div class="rt-grid__h"><span>Invoice</span><span>Customer</span><span class="r">Amount</span><span>Status</span><span>Due date ${icon('chev', '', 2.4)}</span><span></span></div>` + rows.map(r => `<div class="rt-grid__r"><code>${r.id}</code><span><i class="rt-avatar rt-avatar--sm">${r.ini}</i>${r.name}</span><b>${r.amount}</b><span>${pill(r.status)}</span><span class="d">${r.date}</span><span class="m">${icon('dots')}</span></div>`).join('');
  const list = document.createElement('div'); list.className = 'rt-list rt-list--desk';
  const paint = open => { list.innerHTML = rows.map((r, i) => listRow(r, { chevron: true, expanded: open === i })).join(''); };
  let open = -1; paint(open);
  list.addEventListener('click', e => {
    if (e.target.closest('.rt-link')) { const s = document.createElement('div'); s.className = 'rt-sheet-host'; s.innerHTML = sheetHTML(); s.addEventListener('click', ev => { if (ev.target === s) s.remove(); }); root.appendChild(s); return; }
    const item = e.target.closest('.rt-item'); if (!item) return; const i = [...list.children].indexOf(item); open = open === i ? -1 : i; paint(open);
  });
  root.append(grid, list);
  return { get open() { return open; } };
}
