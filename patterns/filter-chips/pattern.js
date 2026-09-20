// Filter Chips: idle / active / disabled chips, OR within a group, AND across groups, a live count that
// updates on the same frame as the tap, and one clear-all reset.
// Usage: FilterChips(rootEl, { total, hits, grid, match, countEl, mode })
//   rootEl   contains .fc-chip buttons (optionally inside [data-group] wrappers) and, optionally, .fc-count b / .fc-clear
//   hits     (activeChips) => number   custom count; default filters `grid` with `match` or falls back to `total`
//   grid     container of .fc-card elements to show/hide (adds .is-out to non-matching cards)
//   match    (cardEl, activeChips) => boolean
//   mode     'results' (default) counts matches, 'filters' counts active chips
export function FilterChips(root, opts = {}) {
  if (!root) return null;
  const chips = () => [...root.querySelectorAll('.fc-chip')].filter(c => c.tagName === 'BUTTON');
  const countEl = opts.countEl || root.querySelector('.fc-count b, .fc-result b, .fc-bar__count b');
  const dir = root.querySelector('.fc-result__dir'), result = root.querySelector('.fc-result');
  const clear = root.querySelector('.fc-clear');
  let last = null;

  const active = () => chips().filter(c => c.classList.contains('is-active')).map(c => ({ el: c, key: c.dataset.key || c.textContent.trim(), group: c.closest('[data-group]')?.dataset.group || null }));
  const count = () => {
    const a = active();
    if (opts.mode === 'filters') return a.length;
    if (opts.hits) return opts.hits(a);
    if (opts.grid && opts.match) return [...opts.grid.querySelectorAll('.fc-card')].filter(card => opts.match(card, a)).length;
    if (a.length === 0) return opts.total ?? 0;
    const hinted = a.map(c => Number(c.el.dataset.hits)).filter(n => n); // data-hits="19" on a chip pins the count when it is the newest active chip
    return hinted.length ? Math.min(...hinted) : Math.round((opts.total ?? 100) / (a.length + 1));
  };
  const render = () => {                                           // 1. same frame: count, direction, grid, empty state
    const a = active(), n = count();
    if (countEl) countEl.textContent = n;
    if (dir && last !== null) { const wider = n > last; dir.textContent = wider ? '▲ wider' : (n < last ? '▼ tighter' : dir.textContent); result?.classList.toggle('is-wider', wider); }
    last = n;
    if (opts.grid && opts.match) opts.grid.querySelectorAll('.fc-card').forEach(card => card.classList.toggle('is-out', !opts.match(card, a)));
    root.classList.toggle('is-empty', a.length === 0);
    root.dispatchEvent(new CustomEvent('fc:change', { detail: { active: a.map(c => c.key), count: n } }));
  };
  root.addEventListener('click', e => {
    const chip = e.target.closest('.fc-chip'); if (!chip || chip.disabled || !root.contains(chip)) return;
    if (e.target.closest('.fc-chip__x')) chip.classList.remove('is-active'); else chip.classList.toggle('is-active');
    chip.setAttribute('aria-pressed', chip.classList.contains('is-active'));
    render();
  });
  clear?.addEventListener('click', () => { chips().forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); }); render(); });
  chips().forEach(c => { c.setAttribute('role', 'button'); c.setAttribute('aria-pressed', c.classList.contains('is-active')); });
  last = count();
  return { render, active, count, clear: () => clear ? clear.click() : (chips().forEach(c => c.classList.remove('is-active')), render()) };
}

// Count a number element from `from` to `to` over `ms`, easing out, for the hook's 200 -> 12 drop.
export function countTo(el, from, to, ms = 900) {
  const t0 = performance.now();
  const step = now => { const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(from + (to - from) * e); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

// Horizontal chip strip: one scrolling row with an edge fade instead of a wrapping wall.
export function ChipStrip(strip) {
  const track = strip.querySelector('.fc-phone__track') || strip.firstElementChild;
  strip.style.overflowX = 'auto'; strip.style.scrollbarWidth = 'none';
  track.style.animation = 'none';
  const fade = () => { const end = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2; strip.style.maskImage = strip.style.webkitMaskImage = end ? 'none' : 'linear-gradient(90deg, #000 78%, transparent 99%)'; };
  strip.addEventListener('scroll', fade); fade();
  return { fade };
}
