// Scroll Restoration: scroll is state. Save scrollY per history entry, put it back on return,
// offset by the sticky header, give anchors scroll-margin-top, and keep the footer reachable.

// Per-entry scroll memory for client-side routers (they reset scrollTop to 0 on route change).
// Usage: const mem = ScrollRestoration({ header: 88 }); mem.leave('/feed'); ... mem.restore('/feed');
export function ScrollRestoration(opts = {}) {
  const store = opts.store || sessionStorage, prefix = 'sr:', header = opts.header ?? 0;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; // a route is not a reset: we rehydrate ourselves
  const key = k => prefix + (k ?? location.pathname);
  const scroller = () => opts.scroller || document.scrollingElement || document.documentElement;
  return {
    // ON LEAVE: save(key, scrollY)
    leave(k) { try { store.setItem(key(k), String(opts.scroller ? opts.scroller.scrollTop : window.scrollY)); } catch {} },
    // ON RETURN: scrollTo(saved), offset by the sticky header so the row is not hidden under it
    restore(k) {
      let y = null; try { y = store.getItem(key(k)); } catch {}
      if (y == null) return false;
      const top = Math.max(0, Number(y) - header);
      opts.scroller ? (opts.scroller.scrollTop = top) : window.scrollTo({ top, behavior: 'instant' });
      return true;
    },
    // Scroll a specific row into view under the header (scrollTo(y - 88), not scrollTo(y)).
    reveal(el) { const y = el.getBoundingClientRect().top + (opts.scroller ? opts.scroller.scrollTop : window.scrollY); opts.scroller ? (opts.scroller.scrollTop = y - header) : window.scrollTo({ top: y - header }); },
    clear(k) { try { store.removeItem(key(k)); } catch {} },
  };
}

// Wire popstate/pagehide so a browser back lands on the saved position automatically.
export function attachToHistory(mem, opts = {}) {
  addEventListener('pagehide', () => mem.leave());
  addEventListener('popstate', () => requestAnimationFrame(() => mem.restore()));
  opts.router?.on?.('beforeNavigate', () => mem.leave());
  opts.router?.on?.('afterRender', () => mem.restore());
}

// Anchors: every :target needs scroll-margin-top equal to the sticky header, or it tucks under the bar.
export function anchorOffset(headerPx = 96, selector = '[id]') {
  const style = document.createElement('style');
  style.textContent = `${selector}:target, ${selector} { scroll-margin-top: ${headerPx}px; }`;
  document.head.appendChild(style);
  return () => style.remove();
}

// Infinite feed guard: stop auto-loading after `max` batches and show a "Load more" button so the footer stays reachable.
export function InfiniteFeed(list, opts) {
  let loaded = 0, busy = false;
  const sentinel = document.createElement('div'); sentinel.className = 'sr-loading'; sentinel.textContent = 'loading more…'; list.appendChild(sentinel);
  const button = document.createElement('button'); button.textContent = 'Load more'; button.hidden = true; list.after(button);
  const load = async () => { if (busy) return; busy = true; const rows = await opts.fetch(loaded); rows.forEach(r => list.insertBefore(opts.render(r), sentinel)); loaded++; busy = false; if (loaded >= (opts.max ?? 3)) { sentinel.remove(); io.disconnect(); button.hidden = false; } };
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) load(); }, { root: opts.root ?? null, rootMargin: '200px' });
  io.observe(sentinel); button.addEventListener('click', load);
  return { load, get loaded() { return loaded; } };
}
