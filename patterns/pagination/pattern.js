// Pagination: truncated numbered pager, cursor vs offset paging, load-more, infinite scroll,
// page state in the URL and scroll restoration on the way back from a detail view.

// Truncate a page range to first, last, current and its neighbours, with '…' for the gaps.
// pageCells(500, 833) -> [1, '…', 499, 500, 501, '…', 833]
export function pageCells(current, total, siblings = 1) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const cells = new Set([1, total]);
  for (let p = current - siblings; p <= current + siblings; p++) if (p >= 1 && p <= total) cells.add(p);
  const sorted = [...cells].sort((a, b) => a - b), out = [];
  sorted.forEach((p, i) => { if (i && p - sorted[i - 1] > 1) out.push('…'); out.push(p); });
  return out;
}

// Render a .pg-pager into `root` and keep it in sync with the current page (and the URL if asked).
// Usage: Pager(root, { total: 833, current: 500, url: true, onChange: p => load(p) })
export function Pager(root, opts = {}) {
  let current = opts.current ?? (opts.url ? readPageFromUrl() : 1), total = opts.total ?? 1;
  const go = p => {
    current = Math.min(total, Math.max(1, p)); render();
    if (opts.url) writePageToUrl(current);
    opts.onChange?.(current); root.dispatchEvent(new CustomEvent('pg:page', { detail: { page: current } }));
  };
  const render = () => {
    root.innerHTML = '';
    const btn = (label, p, cls = '') => { const b = document.createElement('button'); b.className = cls; b.innerHTML = label; b.disabled = p == null; if (p != null) b.addEventListener('click', () => go(p)); root.appendChild(b); };
    btn('<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>', current > 1 ? current - 1 : null);
    pageCells(current, total).forEach(c => { if (c === '…') { const s = document.createElement('span'); s.textContent = '···'; root.appendChild(s); } else btn(c, c, c === current ? 'is-active' : ''); });
    btn('<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>', current < total ? current + 1 : null);
  };
  render();
  return { go, get page() { return current; }, set total(n) { total = n; render(); } };
}

// Page number lives in the URL (?page=500) so refresh stays put and the view is shareable.
export const readPageFromUrl = () => Number(new URLSearchParams(location.search).get('page')) || 1;
export function writePageToUrl(page) { const u = new URL(location.href); page > 1 ? u.searchParams.set('page', page) : u.searchParams.delete('page'); history.replaceState(null, '', u); }

// Offset paging drifts: insert a row at the top and page 2 shows a row from page 1 again.
export const offsetPage = (rows, page, limit) => rows.slice((page - 1) * limit, page * limit);
// Cursor paging anchors to the last id seen, so inserts above never create duplicates.
export const cursorPage = (rows, afterId, limit) => { const i = afterId == null ? 0 : rows.findIndex(r => r.id === afterId) + 1; return rows.slice(i, i + limit); };
export function findDuplicates(pageA, pageB) { const ids = new Set(pageA.map(r => r.id)); return pageB.filter(r => ids.has(r.id)); }

// Load more: appends the next batch on demand; the user stays in control.
export function LoadMore(button, opts) {
  let cursor = opts.after ?? null, busy = false;
  button.addEventListener('click', async () => {
    if (busy) return; busy = true; button.disabled = true;
    const rows = await opts.fetch(cursor); rows.forEach(r => opts.list.appendChild(opts.render(r)));
    cursor = rows.at(-1)?.id ?? cursor; busy = false; button.disabled = false;
    if (rows.length < (opts.limit ?? Infinity)) button.hidden = true;
  });
}

// Infinite scroll: a sentinel at the bottom of the list fetches the next batch when it comes into view.
export function InfiniteScroll(list, opts) {
  const sentinel = document.createElement('div'); sentinel.className = 'pg-loading'; sentinel.textContent = 'loading…'; list.appendChild(sentinel);
  let cursor = opts.after ?? null, busy = false, done = false;
  const io = new IntersectionObserver(async ([e]) => {
    if (!e.isIntersecting || busy || done) return; busy = true;
    const rows = await opts.fetch(cursor); rows.forEach(r => list.insertBefore(opts.render(r), sentinel));
    cursor = rows.at(-1)?.id ?? cursor; busy = false; if (!rows.length) { done = true; sentinel.remove(); io.disconnect(); }
  }, { root: opts.root ?? null, rootMargin: '120px' });
  io.observe(sentinel);
  return { stop: () => io.disconnect() };
}

// Scroll restoration: remember where the user was before the detail page, land them back on the same row.
export const ScrollMemory = {
  save(key, el) { try { sessionStorage.setItem('pg:scroll:' + key, String(el.scrollTop)); } catch {} },
  restore(key, el) { try { const y = sessionStorage.getItem('pg:scroll:' + key); if (y != null) { el.scrollTop = Number(y); return true; } } catch {} return false; },
};
