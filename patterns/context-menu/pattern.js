// Context menu as a system: measure before opening (flip / mirror inside the viewport), group by intent,
// safe triangle for submenus, keyboard walk + type-ahead + Esc-one-level, and a long-press trigger for touch.
// Usage: const menu = ContextMenu(targetEl, { items, viewport }); menu.on('select', e => e.detail.label)

const SVG = 'http://www.w3.org/2000/svg';
const icon = href => { const s = document.createElementNS(SVG, 'svg'); const u = document.createElementNS(SVG, 'use'); u.setAttribute('href', href); s.appendChild(u); return s; };

// Build a .cm-menu element from an item list. '-' is a divider; { label, icon, kbd, danger, children } is an item.
export function renderMenu(items, cls = '') {
  const m = document.createElement('div'); m.className = `cm-menu ${cls}`.trim(); m.setAttribute('role', 'menu'); m.tabIndex = -1;
  for (const it of items) {
    if (it === '-') { const s = document.createElement('div'); s.className = 'cm-sep'; m.appendChild(s); continue; }
    const el = document.createElement('div'); el.className = 'cm-item' + (it.danger ? ' cm-item--danger' : ''); el.setAttribute('role', 'menuitem'); el.tabIndex = -1;
    if (it.icon) el.appendChild(icon(it.icon));
    el.appendChild(document.createTextNode(it.label));
    if (it.children) { const c = icon('#i-chev'); c.classList.add('cm-item__more'); el.appendChild(c); el.dataset.submenu = '1'; el._children = it.children; }
    else if (it.kbd) { const k = document.createElement('span'); k.className = 'cm-item__kbd'; k.textContent = it.kbd; el.appendChild(k); }
    el._item = it; m.appendChild(el);
  }
  return m;
}

// Measure, then place. Returns { left, top, flipY, flipX } so the menu is anchored to the cursor and stays inside `bounds`.
export function place(anchorX, anchorY, menuW, menuH, bounds, pad = 8) {
  const flipY = anchorY + menuH + pad > bounds.bottom && anchorY - menuH - pad >= bounds.top;
  const flipX = anchorX + menuW + pad > bounds.right && anchorX - menuW - pad >= bounds.left;
  let top = flipY ? anchorY - menuH : anchorY, left = flipX ? anchorX - menuW : anchorX;
  top = Math.min(Math.max(top, bounds.top + pad), bounds.bottom - menuH - pad);
  left = Math.min(Math.max(left, bounds.left + pad), bounds.right - menuW - pad);
  return { left, top, flipY, flipX };
}

// Safe triangle: vertex at the last cursor point, base on the submenu's near edge. While the cursor stays inside it the submenu holds.
export function inSafeTriangle(p, vertex, submenuRect) {
  const a = vertex, b = { x: submenuRect.left, y: submenuRect.top }, c = { x: submenuRect.left, y: submenuRect.bottom };
  const s = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  const d1 = s(p, a, b), d2 = s(p, b, c), d3 = s(p, c, a);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}

// Keyboard: arrows walk, letters jump (type-ahead), Enter selects, Right opens a submenu, Left/Esc close one level.
export function keyboardNav(menu, { onSelect, onClose } = {}) {
  const items = () => [...menu.querySelectorAll(':scope > .cm-item')];
  const active = () => items().findIndex(i => i.classList.contains('is-active'));
  const set = i => { items().forEach((el, k) => el.classList.toggle('is-active', k === i)); };
  let sub = null;
  const closeSub = () => { if (sub) { sub.remove(); sub = null; } };
  menu.addEventListener('keydown', e => {
    if (sub) return; // the submenu owns the keys while open
    const list = items(); const cur = active();
    if (e.key === 'ArrowDown') { set((cur + 1) % list.length); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { set((cur - 1 + list.length) % list.length); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || (e.key === 'Enter' && list[cur]?.dataset.submenu)) {
      const el = list[cur]; if (!el?._children) return;
      sub = renderMenu(el._children, menu.className.replace('cm-menu', '').trim()); sub.classList.add('cm-sub');
      sub.style.left = menu.offsetWidth - 6 + 'px'; sub.style.top = el.offsetTop - 6 + 'px'; menu.appendChild(sub);
      keyboardNav(sub, { onSelect, onClose: () => { closeSub(); menu.focus(); } }); sub.querySelector('.cm-item').classList.add('is-active'); sub.focus(); e.preventDefault();
    }
    else if (e.key === 'ArrowLeft' || e.key === 'Escape') { onClose?.(); e.preventDefault(); }
    else if (e.key === 'Enter') { const el = list[cur]; if (el) onSelect?.(el._item || { label: el.textContent.trim() }, el); }
    else if (e.key.length === 1 && /\S/.test(e.key)) { // type-ahead: next item starting with the letter, after the current one
      const k = e.key.toLowerCase(); const order = list.map((_, i) => (cur + 1 + i) % list.length);
      const hit = order.find(i => list[i].textContent.trim().toLowerCase().startsWith(k)); if (hit !== undefined) set(hit);
    }
  });
  if (!menu.hasAttribute('tabindex')) menu.tabIndex = -1;
  return { set, closeSub };
}

// Long press: fires after `ms` if the pointer has not moved more than 8px. Same handler as right-click on desktop.
export function longPress(el, fn, ms = 500) {
  let timer = null, start = null;
  const cancel = () => { clearTimeout(timer); timer = null; };
  el.addEventListener('pointerdown', e => { start = { x: e.clientX, y: e.clientY }; timer = setTimeout(() => { timer = null; fn(e); }, ms); });
  el.addEventListener('pointermove', e => { if (timer && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) cancel(); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => el.addEventListener(t, cancel));
  el.addEventListener('contextmenu', e => e.preventDefault());
}

// The whole system on one target element: right-click (or long press) opens a measured menu with submenus, safe triangle and keys.
export function ContextMenu(target, opts = {}) {
  const bus = new EventTarget();
  const viewport = opts.viewport || document.documentElement;
  let menu = null, sub = null, subOwner = null, lastPoint = null, holdTimer = null;
  const close = () => { if (menu) { menu.remove(); menu = null; sub = null; subOwner = null; } };
  const closeSub = () => { if (sub) { sub.remove(); sub = null; subOwner?.classList.remove('is-active'); subOwner = null; } };
  const openSub = owner => {
    if (subOwner === owner) return; closeSub();
    sub = renderMenu(owner._children, opts.cls || ''); sub.classList.add('cm-sub'); menu.appendChild(sub);
    const mw = menu.offsetWidth, sw = sub.offsetWidth, sh = sub.offsetHeight, mr = menu.getBoundingClientRect(), vb = viewport.getBoundingClientRect();
    const mirror = mr.left + mw + sw > vb.right; sub.style.left = (mirror ? -sw + 6 : mw - 6) + 'px';
    sub.style.top = Math.min(owner.offsetTop - 6, vb.bottom - mr.top - sh - 8) + 'px';
    owner.classList.add('is-active'); subOwner = owner;
    sub.addEventListener('click', e => { const it = e.target.closest('.cm-item'); if (it) select(it); });
  };
  const select = el => { bus.dispatchEvent(new CustomEvent('select', { detail: el._item || { label: el.textContent.trim() } })); close(); };
  const open = (x, y) => {
    close(); menu = renderMenu(opts.items || [], opts.cls || ''); menu.style.position = 'absolute'; menu.style.visibility = 'hidden';
    const host = viewport === document.documentElement ? document.body : viewport; host.appendChild(menu);
    const vb = viewport.getBoundingClientRect(), hb = host.getBoundingClientRect();
    const p = place(x, y, menu.offsetWidth, menu.offsetHeight, { left: vb.left, top: vb.top, right: vb.right, bottom: vb.bottom });
    menu.style.left = p.left - hb.left + 'px'; menu.style.top = p.top - hb.top + 'px'; menu.style.visibility = '';
    menu.dataset.flip = p.flipY ? 'up' : p.flipX ? 'left' : 'none';
    menu.addEventListener('click', e => { const it = e.target.closest('.cm-item'); if (it && !it.dataset.submenu && it.closest('.cm-menu') === menu) select(it); });
    menu.addEventListener('pointermove', e => {
      const it = e.target.closest('.cm-item'); const now = { x: e.clientX, y: e.clientY };
      if (sub && lastPoint && inSafeTriangle(now, lastPoint, sub.getBoundingClientRect())) { clearTimeout(holdTimer); holdTimer = setTimeout(() => { lastPoint = now; }, 300); return; } // safe triangle: hold
      lastPoint = now; if (!it || it.closest('.cm-menu') !== menu) return;
      if (it.dataset.submenu) openSub(it); else if (sub && !sub.contains(e.target)) closeSub();
    });
    keyboardNav(menu, { onSelect: (_, el) => select(el), onClose: close }); menu.querySelector('.cm-item').classList.add('is-active'); menu.focus();
    bus.dispatchEvent(new CustomEvent('open', { detail: p }));
  };
  target.addEventListener('contextmenu', e => { e.preventDefault(); open(e.clientX, e.clientY); });
  longPress(target, e => open(e.clientX, e.clientY), opts.longPress ?? 500);
  document.addEventListener('pointerdown', e => { if (menu && !menu.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu && !sub) close(); });
  return { open, close, on: (t, f) => bus.addEventListener(t, f), get el() { return menu; } };
}
