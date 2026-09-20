// Navigation Patterns: five navigation components and the rule that picks between them.
// Bottom tabs (mobile), persistent sidebar (desktop), hamburger drawer (mobile secondary),
// command palette (Cmd K accelerator) and breadcrumbs (depth > 2).

// Bottom tabs: 3-5 destinations, always visible. Click or arrow keys move the active tab.
// Usage: BottomTabs(navEl, { onChange: (id) => {} })
export function BottomTabs(nav, opts = {}) {
  const tabs = [...nav.querySelectorAll('.nv-tab')];
  if (tabs.length < 3 || tabs.length > 5) console.warn('BottomTabs: use 3-5 destinations, got', tabs.length);
  const select = (i, focus) => {
    tabs.forEach((t, j) => { const on = j === i; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    if (focus) tabs[i].focus();
    opts.onChange?.(tabs[i].dataset.id || tabs[i].textContent.trim());
  };
  nav.setAttribute('role', 'tablist');
  tabs.forEach((t, i) => {
    t.setAttribute('role', 'tab');
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') select((i + 1) % tabs.length, true);
      if (e.key === 'ArrowLeft') select((i - 1 + tabs.length) % tabs.length, true);
    });
  });
  select(Math.max(0, tabs.findIndex(t => t.classList.contains('is-active'))));
  return { select };
}

// Persistent sidebar: 5+ sections, always in view. Never collapsed by default.
// Usage: Sidebar(sideEl, { onChange })
export function Sidebar(side, opts = {}) {
  const items = [...side.querySelectorAll('.nv-side__item')];
  if (items.length < 5) console.warn('Sidebar: a sidebar earns its space with 5+ sections, got', items.length);
  const select = i => { items.forEach((it, j) => { it.classList.toggle('is-active', j === i); it.setAttribute('aria-current', j === i ? 'page' : 'false'); }); opts.onChange?.(items[i].textContent.trim()); };
  items.forEach((it, i) => it.addEventListener('click', () => select(i)));
  return { select };
}

// Hamburger drawer: secondary navigation on mobile only. Toggle button opens/closes the panel; Escape closes.
// Usage: Drawer(drawerEl, toggleBtn)
export function Drawer(drawer, toggle) {
  const set = open => { drawer.classList.toggle('is-closed', !open); toggle.setAttribute('aria-expanded', open); drawer.dispatchEvent(new CustomEvent('nv:drawer', { detail: { open } })); };
  toggle.addEventListener('click', () => set(drawer.classList.contains('is-closed')));
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  drawer.querySelectorAll('.nv-drawer__item').forEach(it => it.addEventListener('click', () => { drawer.querySelectorAll('.nv-drawer__item').forEach(o => o.classList.toggle('is-active', o === it)); }));
  return { open: () => set(true), close: () => set(false) };
}

// Command palette: Cmd K opens it, typing filters, arrows move, Enter runs. Pair it with visible nav.
// Usage: CommandPalette(paletteEl, { onRun: (cmdEl) => {}, hotkey: true })
export function CommandPalette(root, opts = {}) {
  const input = root.querySelector('.nv-palette__input'), rows = [...root.querySelectorAll('.nv-cmd')];
  let active = Math.max(0, rows.findIndex(r => r.classList.contains('is-active')));
  const visible = () => rows.filter(r => !r.hidden);
  const paint = () => { const v = visible(); if (!v.includes(rows[active])) active = rows.indexOf(v[0]); rows.forEach(r => r.classList.toggle('is-active', r === rows[active])); };
  const filter = q => { rows.forEach(r => { r.hidden = q && !r.textContent.toLowerCase().includes(q.toLowerCase()); }); paint(); };
  const move = d => { const v = visible(); if (!v.length) return; const i = (v.indexOf(rows[active]) + d + v.length) % v.length; active = rows.indexOf(v[i]); paint(); };
  const run = () => { const r = rows[active]; if (r) { opts.onRun?.(r); root.dispatchEvent(new CustomEvent('nv:run', { detail: { command: r.textContent.trim() } })); } };
  input?.addEventListener('input', () => filter(input.value));
  root.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); move(1); } if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); } if (e.key === 'Enter') run(); });
  rows.forEach(r => { r.addEventListener('mouseenter', () => { active = rows.indexOf(r); paint(); }); r.addEventListener('click', run); });
  if (opts.hotkey !== false) document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); root.hidden = false; input?.focus(); } });
  paint();
  return { filter, move, run, focus: () => input?.focus() };
}

// Breadcrumbs: only worth rendering when the hierarchy is deeper than 2 levels.
// Usage: Breadcrumbs(olEl, [{ label, href }, ...], { chip: index })
export function Breadcrumbs(ol, trail, opts = {}) {
  if (trail.length <= 2) { ol.hidden = true; return { shown: false }; } // flat structure: breadcrumbs are noise
  ol.hidden = false; ol.innerHTML = '';
  trail.forEach((c, i) => {
    const li = document.createElement('li'), a = document.createElement('a');
    a.textContent = c.label; a.href = c.href || '#';
    if (i === trail.length - 1) { li.className = 'is-current'; a.setAttribute('aria-current', 'page'); }
    if (i === opts.chip) li.classList.add('is-chip');
    li.appendChild(a); ol.appendChild(li);
  });
  return { shown: true };
}

// The system: pick by platform and depth, not taste.
// chooseNavigation({ platform: 'mobile'|'desktop', destinations: 4, depth: 3, powerUsers: true })
//   -> { primary, secondary: [...] }
export function chooseNavigation({ platform, destinations = 4, depth = 1, powerUsers = false }) {
  const primary = platform === 'mobile' ? (destinations <= 5 ? 'bottom-tabs' : 'bottom-tabs + hamburger') : (destinations >= 5 ? 'sidebar' : 'top-nav');
  const secondary = [];
  if (platform === 'mobile' && destinations > 5) secondary.push('hamburger');
  if (powerUsers) secondary.push('command-palette');
  if (depth > 2) secondary.push('breadcrumbs');
  return { primary, secondary };
}
