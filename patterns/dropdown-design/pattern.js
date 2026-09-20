// Dropdown Design: a trigger + list that is clickable, flips on edge, is fully keyboard driven,
// grows a search field past ~10 items and opens in ~150ms.
// Usage: Dropdown(rootEl, { onSelect, speed: 150 })   rootEl = .dd-menu containing .dd-trigger and .dd-list > .dd-item
export function Dropdown(root, opts = {}) {
  const trigger = root.querySelector('.dd-trigger'), list = root.querySelector('.dd-list');
  if (!trigger || !list) return null;
  const items = () => [...list.querySelectorAll('.dd-item')];
  if (opts.speed) root.style.setProperty('--dd-speed', `${opts.speed}ms`);
  trigger.setAttribute('aria-haspopup', 'listbox'); list.setAttribute('role', 'listbox');
  let index = Math.max(0, items().findIndex(i => i.classList.contains('is-active')));

  const highlight = i => { const all = items(); index = (i + all.length) % all.length; all.forEach((el, k) => el.classList.toggle('is-active', k === index)); all[index]?.scrollIntoView?.({ block: 'nearest' }); };
  const flipIfNeeded = () => {            // Rule 2: open upward when the list would clip the viewport (or the nearest scroll container)
    if (root.classList.contains('is-up-locked')) return;
    const box = (root.closest('.dd-window') || document.scrollingElement).getBoundingClientRect();
    const t = trigger.getBoundingClientRect(), h = list.offsetHeight + 8;
    root.classList.toggle('is-up', t.bottom + h > Math.min(box.bottom, innerHeight) && t.top - h > box.top);
  };
  const open = () => { flipIfNeeded(); root.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); root.dispatchEvent(new CustomEvent('dd:open')); };
  const close = () => { root.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); root.dispatchEvent(new CustomEvent('dd:close')); };
  const select = i => { const el = items()[i]; if (!el) return; highlight(i); root.dispatchEvent(new CustomEvent('dd:select', { detail: { index: i, value: el.textContent.trim() } })); opts.onSelect?.(el.textContent.trim(), i); close(); };

  trigger.addEventListener('click', () => root.classList.contains('is-open') ? close() : open());
  list.addEventListener('click', e => { const el = e.target.closest('.dd-item'); if (el) select(items().indexOf(el)); });
  root.addEventListener('keydown', e => {   // Rule 3: arrows move, Enter selects, Esc closes
    const isOpen = root.classList.contains('is-open');
    if (e.key === 'ArrowDown') { e.preventDefault(); isOpen ? highlight(index + 1) : open(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); isOpen ? highlight(index - 1) : open(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isOpen ? select(index) : open(); }
    else if (e.key === 'Escape') { close(); trigger.focus(); }
  });
  document.addEventListener('pointerdown', e => { if (!root.contains(e.target)) close(); });
  return { open, close, highlight, select, get index() { return index; } };
}

// Rule 4: a dropdown with a search field that filters the list as the user types.
// Usage: SearchDropdown(rootEl, { items: ['Argentina', ...] })  rootEl = .dd-search with .dd-search__field and .dd-search__list
export function SearchDropdown(root, opts = {}) {
  const field = root.querySelector('.dd-search__field'), list = root.querySelector('.dd-search__list');
  if (!field || !list) return null;
  const all = opts.items || [...list.querySelectorAll('.dd-item')].map(i => i.textContent.trim());
  let input = field.querySelector('input');
  if (!input) { // demo markup shows a static placeholder; upgrade it to a live input on first focus
    input = document.createElement('input'); input.type = 'text'; input.placeholder = opts.placeholder || 'Search…'; input.hidden = true; field.appendChild(input);
    field.addEventListener('click', () => { field.querySelectorAll('.dd-search__ph, .dd-search__q, .dd-search__cursor').forEach(n => n.remove()); input.hidden = false; input.focus(); });
  }
  const render = q => {
    const hits = all.filter(v => v.toLowerCase().startsWith(q.toLowerCase()) || v.toLowerCase().includes(q.toLowerCase()));
    list.innerHTML = hits.map(v => `<div class="dd-item dd-item--sr${q ? ' is-match' : ''}">${v}</div>`).join('');
    root.classList.toggle('is-filtered', !!q);
    let count = field.querySelector('.dd-search__count');
    if (q) { if (!count) { count = document.createElement('b'); count.className = 'dd-search__count'; field.appendChild(count); } count.textContent = hits.length; } else count?.remove();
    root.dispatchEvent(new CustomEvent('dd:filter', { detail: { query: q, hits } }));
  };
  input.addEventListener('input', () => render(input.value));
  return { filter: render, items: all };
}

// Rule 5: open the three timing lanes in a loop so 50 / 150 / 500ms can be compared side by side.
export function TimingRace(root, period = 2600) {
  const menus = [...root.querySelectorAll('.dd-menu')];
  clearInterval(root._iv);
  const tick = () => { menus.forEach(m => m.classList.remove('is-open')); setTimeout(() => menus.forEach(m => m.classList.add('is-open')), 700); };
  tick(); root._iv = setInterval(tick, period);
  return () => clearInterval(root._iv);
}
