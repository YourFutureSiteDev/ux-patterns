// Live cursors: render other users' cursors on a canvas, interpolating between server ticks,
// colouring each user from a stable hash of their id, with presence, selection locks and follow mode.

// Stable colour from a user id: same id, same hue, every session. Returns { hue, hex }.
export function colorFromId(id) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  const hue = h % 360;
  return { hue, hex: hslToHex(hue, 72, 46) };
}
function hslToHex(h, s, l) {
  s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Cursor layer. Server ticks arrive at ~10 Hz via update(id, x, y); the screen redraws at 60 fps,
// easing each cursor toward its latest target so it glides instead of teleporting.
export function CursorLayer(root, opts = {}) {
  const ease = opts.ease ?? 0.25, cursors = new Map();
  const arrow = '<svg viewBox="0 0 20 24"><path d="M3 2v17.5l4.8-4.6 3.4 7.6 3-1.3-3.3-7.4h6.6z"/></svg>';
  function add(id, name, color) {
    const el = document.createElement('div'); el.className = 'lc-cursor is-lerp'; el.style.setProperty('--c', color || colorFromId(id).hex);
    el.innerHTML = arrow + `<span class="lc-cursor__label">${name}</span>`; root.appendChild(el);
    const c = { id, el, x: 0, y: 0, tx: 0, ty: 0 }; cursors.set(id, c); return c;
  }
  function update(id, x, y, name) { const c = cursors.get(id) || add(id, name || id); c.tx = x; c.ty = y; if (!c.seen) { c.x = x; c.y = y; c.seen = true; } }
  function remove(id) { const c = cursors.get(id); if (c) { c.el.remove(); cursors.delete(id); } }
  let raf = 0;
  const frame = () => { for (const c of cursors.values()) { c.x += (c.tx - c.x) * ease; c.y += (c.ty - c.y) * ease; c.el.style.transform = `translate(${c.x}px, ${c.y}px)`; } raf = requestAnimationFrame(frame); };
  frame();
  return { add, update, remove, stop: () => cancelAnimationFrame(raf), cursors };
}

// Presence: avatar stack with overflow counter. render(users) -> first `max` faces, then "+N".
export function Presence(root, opts = {}) {
  const max = opts.max ?? 3;
  return { render(users) {
    root.innerHTML = '';
    users.slice(0, max).forEach(u => { const a = document.createElement('div'); a.className = 'lc-avatar'; a.style.background = u.color || colorFromId(u.id).hex; a.textContent = u.initials; a.title = u.name; root.appendChild(a); });
    if (users.length > max) { const m = document.createElement('div'); m.className = 'lc-avatar lc-avatar--more'; m.textContent = '+' + (users.length - max); root.appendChild(m); }
  } };
}

// Selection locks: the first user to select an element owns it until they release it.
export function SelectionLocks() {
  const locks = new Map();
  return {
    acquire(elementId, user) { const cur = locks.get(elementId); if (cur && cur.id !== user.id) return { ok: false, by: cur }; locks.set(elementId, user); return { ok: true }; },
    release(elementId, user) { const cur = locks.get(elementId); if (cur && cur.id === user.id) locks.delete(elementId); },
    owner(elementId) { return locks.get(elementId) || null; },
    decorate(el, user) { el.style.outline = `2px solid ${user.color}`; el.style.outlineOffset = '4px'; }
  };
}

// Follow mode: bind a viewport's transform to another user's camera { x, y, scale }.
export function FollowMode(world, opts = {}) {
  let target = null, cur = { x: 0, y: 0, scale: 1 }, raf = 0;
  const ease = opts.ease ?? 0.12;
  const frame = () => { if (target) { cur.x += (target.x - cur.x) * ease; cur.y += (target.y - cur.y) * ease; cur.scale += (target.scale - cur.scale) * ease; world.style.transform = `translate(${cur.x}px, ${cur.y}px) scale(${cur.scale})`; } raf = requestAnimationFrame(frame); };
  frame();
  return { follow(camera) { target = camera; }, camera(c) { target = c; }, stop() { target = null; cancelAnimationFrame(raf); } };
}
