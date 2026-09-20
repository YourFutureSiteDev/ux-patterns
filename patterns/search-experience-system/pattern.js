// Search experience system, rebuilt from the @designmotionhq reel "Search is a system. Five parts."
// Placeholder that onboards, recent searches on focus, autocomplete ranked by clicks with a category
// badge, keyboard navigation with a visible focus ring, and a zero-results screen that recovers.

export const RECENT = ['Nike Air Max', 'White sneakers', 'Cotton hoodie', 'Running shoes', 'Watch strap'];
export const SUGGESTIONS = [
  { label: 'Shoes',    badge: 'Apparel', tone: 'pink', top: true, clicks: 67 },
  { label: 'Shop New', badge: 'Section', tone: 'blue', clicks: 18 },
  { label: 'Shorts',   badge: 'Apparel', tone: 'pink', clicks: 9 },
];
export const RECOVERY = [
  { title: 'Try: shoes',           sub: 'Popular search', tone: 'amber', icon: 'trend' },
  { title: 'Browse: Footwear',     sub: 'Full category',  tone: 'teal',  icon: 'folder' },
  { title: 'Recent: Nike Air Max', sub: 'Last visited',   tone: 'pink',  icon: 'arrow' },
];

const I = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  tag: '<path d="M3 12V4h8l9 9-8 8zM7 8h.01"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  arrow: '<path d="M7 17L17 7M9 7h8v8"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.4 1 2.5h6c0-1.1.3-1.9 1-2.5A6 6 0 0 0 12 3z"/>',
};
export const icon = (n, cls = '', sw = 2) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;

// The bar. o: { value, placeholder, focus, caret, clear, strike, tone }
export const barHTML = (o = {}) => `<div class="sx-bar${o.focus ? ' is-focus' : ''}${o.strike ? ' is-lazy' : ''}${o.better ? ' is-better' : ''}">${icon('search', 'sx-bar__icon')}<span class="sx-bar__text">${o.value ? `<b>${o.value}</b>` : `<i>${o.placeholder ?? 'Search'}</i>`}${o.caret ? '<em class="sx-caret"></em>' : ''}</span>${o.clear ? `<button class="sx-bar__clear" aria-label="Clear">${icon('x', '', 2.4)}</button>` : ''}</div>`;

// Panels for each state of the system.
export const recentHTML = (hover = -1) => `<div class="sx-panel"><div class="sx-panel__label">Recent searches</div><div class="sx-chips">${RECENT.map((r, i) => `<button class="sx-chip${i === hover ? ' is-hover' : ''}">${icon('clock', '', 1.8)}${r}</button>`).join('')}</div><div class="sx-panel__foot">Tap to reuse · One click fills the bar</div></div>`;

export const suggestHTML = (query = 'sho', active = 0, o = {}) => `<div class="sx-panel sx-panel--list">${o.header === false ? '' : '<div class="sx-panel__label">Suggestions · Ranked by popularity</div>'}${SUGGESTIONS.map((s, i) => {
  const m = o.match !== false && s.label.toLowerCase().startsWith(query.toLowerCase()) ? `<em>${s.label.slice(0, query.length)}</em>${s.label.slice(query.length)}` : s.label;
  return `<div class="sx-item${i === active ? ' is-active' : ''}"><i class="sx-item__icon">${icon('search')}</i><div><b>${m}</b><div class="sx-badges"><span class="sx-badge is-${s.tone}">${icon('tag', '', 2.2)}${s.badge}</span>${s.top && o.rank !== false ? `<span class="sx-badge is-amber">${icon('trend', '', 2.2)}Top</span>` : ''}</div></div>${o.rank === false ? '' : `<span class="sx-rank${i === 0 ? ' is-pink' : ''}">#${i + 1}</span>`}</div>`; }).join('')}</div>`;

export const zeroHTML = (query = 'xqzz') => `<div class="sx-dead"><span class="sx-tagline is-pink">Dead end</span><i class="sx-dead__x">${icon('x', '', 3)}</i><b>No matches for "${query}"</b><span>Try different keywords.</span></div>
<div class="sx-recover"><span class="sx-tagline is-teal">Recovery</span><b>Try one of these instead:</b>${RECOVERY.map(r => `<div class="sx-recover__item"><i class="is-${r.tone}">${icon(r.icon, '', 2)}</i><div><b>${r.title}</b><span class="is-${r.tone}">${r.sub}</span></div>${icon('arrow', 'sx-recover__go', 2)}</div>`).join('')}</div>`;

// Live search: recent on focus, ranked suggestions as you type, arrow/enter/escape, recovery on zero results.
export function SearchSystem(root, o = {}) {
  const recent = [...(o.recent || RECENT)], items = o.items || SUGGESTIONS;
  root.classList.add('sx-live');
  root.innerHTML = `<div class="sx-bar"><svg class="sx-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${I.search}</svg><input class="sx-bar__input" placeholder="${o.placeholder || 'Search by name, SKU, or brand'}" aria-label="Search"></div><div class="sx-live__pop" hidden></div>`;
  const input = root.querySelector('input'), pop = root.querySelector('.sx-live__pop');
  let q = '', active = 0, list = [];
  const render = () => {
    pop.hidden = false;
    if (!q) { list = recent; pop.innerHTML = recentHTML(-1); return; }
    list = items.filter(s => s.label.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.clicks - a.clicks).slice(0, 3);
    pop.innerHTML = list.length ? suggestHTML(q, active) : `<div class="sx-zero">${zeroHTML(q)}</div>`;
  };
  input.addEventListener('focus', () => { root.classList.add('is-focus'); render(); });
  input.addEventListener('blur', () => setTimeout(() => { root.classList.remove('is-focus'); pop.hidden = true; }, 120));
  input.addEventListener('input', () => { q = input.value.trim(); active = 0; render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { active = (active + 1) % Math.max(1, list.length); render(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { active = (active - 1 + list.length) % Math.max(1, list.length); render(); e.preventDefault(); }
    if (e.key === 'Escape') { input.blur(); }
    if (e.key === 'Enter' && list[active]) { const v = list[active].label ?? list[active]; input.value = v; q = v; recent.unshift(v); root.dispatchEvent(new CustomEvent('sx:select', { detail: v })); pop.hidden = true; }
  });
  pop.addEventListener('mousedown', e => { const c = e.target.closest('.sx-chip'); if (c) { input.value = c.textContent.trim(); q = input.value; render(); e.preventDefault(); } });
  return { get query() { return q; } };
}
