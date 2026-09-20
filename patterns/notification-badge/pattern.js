// Notification Badge: one rule, every surface.
// cap the count at 99+, pin it to the corner, count up (never blink to 0), clear it on open,
// dot for "changed", number for "how many", never both, and only badge what needs the user.

// Format a count for a badge. Returns '' for 0 (render nothing), '99+' past the cap.
export function formatBadge(count, { cap = 99 } = {}) {
  count = Math.max(0, Math.floor(Number(count) || 0));
  if (count === 0) return '';
  return count > cap ? `${cap}+` : String(count);
}

// A live badge on any element. Counts only climb between renders: an incoming value below the current
// one is applied only through clear() (open the surface), so a flaky feed never blinks the badge to 0.
// Usage: const b = Badge(el, { cap: 99 }); b.set(12); b.increment(); b.clear();
export function Badge(el, { cap = 99, count = 0 } = {}) {
  let n = 0;
  const render = () => { const label = formatBadge(n, { cap }); el.textContent = label; el.hidden = !label; el.setAttribute('aria-label', label ? `${n} unread` : 'no unread'); };
  const api = {
    get count() { return n; },
    set(v) { v = Math.max(0, Math.floor(Number(v) || 0)); if (v >= n) { n = v; render(); } return api; },  // never blink down
    increment(by = 1) { n += by; render(); return api; },
    clear() { n = 0; render(); return api; },                                                          // open it, clear it
  };
  api.set(count);
  return api;
}

// Pin a badge to the top-right corner of a tile so the icon never moves while the badge grows left.
// Pure layout helper: sets the two styles the pattern needs and returns a Badge bound to the pill.
export function CornerBadge(tile, opts = {}) {
  tile.style.position = 'relative';
  let pill = tile.querySelector('.nb-badge');
  if (!pill) { pill = document.createElement('span'); pill.className = 'nb-badge'; tile.appendChild(pill); }
  Object.assign(pill.style, { position: 'absolute', top: '0', right: '0', transform: 'translate(30%, -30%)' });
  return Badge(pill, opts);
}

// Decide the signal for a row: a dot when something changed, a number when the user must act on N things,
// and nothing when nothing needs them. Never both on the same row.
export function rowSignal({ changed = false, pending = 0 } = {}) {
  if (pending > 0) return { kind: 'count', label: formatBadge(pending) };
  if (changed) return { kind: 'dot', label: '' };
  return { kind: 'none', label: '' };
}

// Badge the decision, not everything: from a map of category -> unread count, badge only the categories
// that need the user (default: mentions and direct messages) and return the ones to render.
export function decideBadges(counts, { needsYou = ['mentions'] } = {}) {
  return Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, needsYou.includes(k) && v > 0 ? formatBadge(v) : '']));
}

// Inbox controller for the demo: opening the inbox marks rows read and clears the badge.
export function Inbox(root, { badge, rows = '.nb-msg', onOpen } = {}) {
  const items = [...root.querySelectorAll(rows)];
  return {
    open() {
      items.forEach(r => { r.classList.add('is-read'); const m = r.querySelector('.nb-msg__mark'); if (m) { m.className = 'nb-msg__check'; m.textContent = '✓'; } });
      badge && badge.clear(); onOpen && onOpen();
    }
  };
}
