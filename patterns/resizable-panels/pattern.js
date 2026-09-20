// Resizable panels, rebuilt from the @designmotionhq reel "Resizable panels layout is a risky pattern".
// Six rules for one drag: a 1px line with a 12px grab target, clamp between min and max, snap closed
// instead of leaving a sliver, overlay the page mid-drag so iframes cannot eat the mouse, lock the
// cursor on the body, and persist the width across reloads.

export const PROJECTS = [
  { name: 'Northwind migration', sub: 'Sarah Chen · 4 open', tone: 'teal',   status: 'Active',  st: 'teal' },
  { name: 'Atlas redesign',      sub: 'Alex Rivera · 2 open', tone: 'gold',  status: 'Review',  st: 'gold' },
  { name: 'Orbit API',           sub: 'Mia Torres · 1 open',  tone: 'grey',  status: 'Shipped', st: 'grey' },
];
export const NAV = [
  { label: 'Overview', icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>' },
  { label: 'Projects', icon: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 13h6M12 10v6"/>', active: true },
  { label: 'Members', icon: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>' },
  { label: 'Billing', icon: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/>' },
  { label: 'Settings', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>' },
];
const svg = (d, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
export const ICON = {
  arrows: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M4 12h16"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  snap: '<path d="M14 3l7 7-7 7M3 10h18M10 21l-7-7"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 17l9 5 9-5"/>',
  cursor: '<path d="M5 3l7 17 2.5-6.5L21 11z"/>',
  db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  bug: '<path d="M8 9a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0zM3 13h5M16 13h5M4 6l4 3M20 6l-4 3M4 20l4-3M20 20l-4-3"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M10 4v16"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/>',
};
export const icon = (n, cls) => svg(ICON[n], cls);

// Render one app window. o: { width (sidebar px), url, compact, tone, handle: 'grip'|'hover'|'drag', hotZone,
//   rows: 'full'|'short'|'none', minmax: [minPx, maxPx], tag: {text, tone, icon, x, y}, iframe: {text, tone, icon},
//   cursor: {x, y, kind}, tint (teal drag overlay over the page) }
export function renderSplit(root, o = {}) {
  const w = o.width ?? 227, compact = !!o.compact, tone = o.tone || '';
  root.classList.add('rsp-win'); if (compact) root.classList.add('rsp-win--compact'); if (tone) root.classList.add(`is-${tone}`);
  const url = o.url === null ? '' : `<span class="rsp-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>${o.url || 'halyard.app/projects'}</span>${icon('refresh', 'rsp-reload')}`;
  const nav = NAV.map(n => `<div class="rsp-nav${n.active ? ' is-active' : ''}">${svg(n.icon)}<span>${n.label}</span></div>`).join('');
  const rows = o.rows === 'none' ? '' : PROJECTS.map(p => `<div class="rsp-row"><i class="rsp-row__icon is-${p.tone}"></i><div class="rsp-row__body"><b>${p.name}</b>${o.rows === 'short' ? '' : `<span>${p.sub}</span>`}</div>${o.rows === 'short' ? '' : `<em class="rsp-status is-${p.st}">${p.status}</em>`}</div>`).join('');
  const head = o.rows === 'none' ? '' : `<div class="rsp-main__head"><b>Projects</b>${o.rows === 'short' ? '' : `<span class="rsp-search">${icon('search')}Search</span><i class="rsp-avatar"></i>`}</div>`;
  const tag = o.tag ? `<div class="rsp-tag is-${o.tag.tone || 'teal'}" style="left:${o.tag.x}px;top:${o.tag.y}px">${o.tag.icon ? icon(o.tag.icon) : ''}${o.tag.text}</div>` : '';
  const iframe = o.iframe ? `<div class="rsp-iframe" style="left:${o.iframe.x}px;top:${o.iframe.y}px"><div class="rsp-tag is-${o.iframe.tone}">${icon(o.iframe.icon)}${o.iframe.text}</div><svg class="rsp-iframe__cursor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 3l7 17 2.5-6.5L21 11z"/></svg><code>&lt;iframe&gt; embed</code></div>` : '';
  const labels = o.minmax ? `<code class="rsp-guide__label" style="left:${o.minmax[0] - 30}px">min 240</code><code class="rsp-guide__label is-teal" style="left:${o.minmax[1] - 30}px">max 640</code>` : '';
  const guides = o.minmax ? `<i class="rsp-guide" style="left:${o.minmax[0]}px"></i><i class="rsp-guide" style="left:${o.minmax[1]}px"></i>` : '';
  const tint = o.tint ? '<div class="rsp-overlay is-tint"></div>' : '';
  const handle = `<div class="rsp-handle is-${o.handle || 'grip'}" style="left:${w}px"><i class="rsp-handle__line"></i><span class="rsp-handle__grip">${o.handle && o.handle !== 'grip' ? icon('arrows') : '<i></i><i></i><i></i>'}</span></div>`;
  const cursor = o.cursor ? `<svg class="rsp-cursor rsp-cursor--${o.cursor.kind || 'arrow'}" style="left:${o.cursor.x}px;top:${o.cursor.y}px" viewBox="0 0 24 24">${o.cursor.kind === 'col' ? '<path d="M2 12h20M2 12l4-4M2 12l4 4M22 12l-4-4M22 12l-4 4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M2 12h20M2 12l4-4M2 12l4 4M22 12l-4-4M22 12l-4 4" stroke="#000" stroke-width="1" fill="none" stroke-linecap="round"/>' : '<path d="M4 2l6.5 18 3-7 7-3z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/>'}</svg>` : '';
  root.innerHTML = `<div class="rsp-titlebar"><i class="rsp-dots"><b></b><b></b><b></b></i>${url}${labels}</div>
    <div class="rsp-body">
      <aside class="rsp-side" style="width:${w}px"><div class="rsp-logo"><i></i><span>Halyard</span></div>${nav}</aside>
      <main class="rsp-main" style="left:${w}px">${head}${rows}</main>
      ${guides}${tint}${handle}${iframe}${tag}
    </div>${cursor}`;
  return root;
}

// Live behaviour. ResizablePanel(win, { min: 240, max: 640, snap: 120, key: 'panelW' })
// Sidebar widths are logical px; the window renders them at `scale` (the reel draws 640 logical as 427 px).
export function ResizablePanel(win, o = {}) {
  const min = o.min ?? 240, max = o.max ?? 640, snap = o.snap ?? 120, key = o.key ?? 'panelW', scale = o.scale ?? 2 / 3;
  const side = win.querySelector('.rsp-side'), main = win.querySelector('.rsp-main'), handle = win.querySelector('.rsp-handle');
  let width = Number(localStorage.getItem(key)) || o.width || 340, overlay = null, startX = 0, startW = 0;      // 6. persist
  const apply = w => { width = w; const px = Math.round(w * scale); side.style.width = px + 'px'; main.style.left = px + 'px'; handle.style.left = px + 'px'; win.dispatchEvent(new CustomEvent('rsp:resize', { detail: { width: w } })); };
  const clamp = w => w < snap ? 0 : Math.min(max, Math.max(min, w));                                             // 2. clamp, 3. snap closed
  handle.addEventListener('pointerdown', e => {
    startX = e.clientX; startW = width; handle.setPointerCapture(e.pointerId); handle.classList.add('is-drag');
    overlay = document.createElement('div'); overlay.className = 'rsp-overlay'; win.appendChild(overlay);            // 4. overlay the page
    document.body.classList.add('rsp-resizing');                                                                    // 5. cursor on the body
  });
  handle.addEventListener('pointermove', e => { if (!handle.classList.contains('is-drag')) return; apply(clamp(startW + (e.clientX - startX) / scale)); });
  const end = () => { if (!handle.classList.contains('is-drag')) return; handle.classList.remove('is-drag'); overlay?.remove(); document.body.classList.remove('rsp-resizing'); try { localStorage.setItem(key, width); } catch {} };
  handle.addEventListener('pointerup', end); handle.addEventListener('pointercancel', end);
  handle.addEventListener('dblclick', () => apply(width ? 0 : o.width || 340));
  apply(clamp(width) || 0);
  return { get width() { return width; }, set: w => apply(clamp(w)) };
}
