// Drag and drop: lift with three cues, reveal the drop zone before release, snap on structured
// surfaces, and follow every drop with a short undo toast.

// Board(root, { snap: true, onMove }) — makes every .dd-card inside root draggable between .dd-col
// columns with the pointer. Pickup adds .is-lifted (scale + shadow + tilt) and .is-source on the
// original; hovering a column adds .is-target and shows an insertion .dd-line before the card the
// pointer is above. Drop moves the card (snap) and fires 'dd:move' with { card, from, to, index }.
export function Board(root, opts = {}) {
  const line = document.createElement('div'); line.className = 'dd-line';
  let drag = null;
  const cols = () => [...root.querySelectorAll('.dd-col')];
  const cardAt = (col, y) => [...col.querySelectorAll('.dd-card:not(.is-source)')].find(c => y < c.getBoundingClientRect().top + c.offsetHeight / 2);
  root.addEventListener('pointerdown', e => {
    const card = e.target.closest('.dd-card'); if (!card || e.button) return;
    const r = card.getBoundingClientRect();
    const ghost = card.cloneNode(true); ghost.classList.add('is-lifted'); ghost.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;margin:0;pointer-events:none;z-index:99`;
    document.body.appendChild(ghost); card.classList.add('is-source');
    drag = { card, ghost, from: card.closest('.dd-col'), dx: e.clientX - r.left, dy: e.clientY - r.top };
    root.classList.add('is-dragging'); document.body.style.cursor = 'grabbing';
    root.setPointerCapture?.(e.pointerId);
  });
  root.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.ghost.style.left = e.clientX - drag.dx + 'px'; drag.ghost.style.top = e.clientY - drag.dy + 'px';
    const col = cols().find(c => { const b = c.getBoundingClientRect(); return e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom; });
    cols().forEach(c => c.classList.toggle('is-target', c === col && !cardAt(c, e.clientY)));
    if (col) { const before = cardAt(col, e.clientY); if (before) col.insertBefore(line, before); else line.remove(); } else line.remove();
  });
  const end = e => {
    if (!drag) return;
    const col = cols().find(c => c.classList.contains('is-target')) || (line.parentElement);
    const { card, ghost, from } = drag;
    if (col) { if (line.parentElement === col) col.insertBefore(card, line); else col.appendChild(card); }
    const index = [...card.parentElement.querySelectorAll('.dd-card')].indexOf(card);
    ghost.remove(); line.remove(); card.classList.remove('is-source'); cols().forEach(c => c.classList.remove('is-target'));
    root.classList.remove('is-dragging'); document.body.style.cursor = '';
    cols().forEach(c => { const n = c.querySelector('.dd-col__count'); if (n) n.textContent = c.querySelectorAll('.dd-card').length; });
    if (col && col !== from) { root.dispatchEvent(new CustomEvent('dd:move', { detail: { card, from, to: col, index } })); opts.onMove?.({ card, from, to: col, index, undo: () => { from.appendChild(card); cols().forEach(c => { const n = c.querySelector('.dd-col__count'); if (n) n.textContent = c.querySelectorAll('.dd-card').length; }); } }); }
    drag = null;
  };
  root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
  return { get dragging() { return !!drag; } };
}

// UndoToast(toastEl, { seconds: 5, onUndo, onExpire }) — the ring drains over `seconds`; clicking
// UNDO before it empties calls onUndo, otherwise onExpire fires and the toast is done.
export function UndoToast(el, opts = {}) {
  const seconds = opts.seconds ?? 5, btn = el.querySelector('.dd-undo');
  const t0 = performance.now(); let done = false, raf = 0;
  const tick = () => { const p = Math.max(0, 1 - (performance.now() - t0) / (seconds * 1000)); btn.style.setProperty('--p', p); if (p > 0 && !done) raf = requestAnimationFrame(tick); else if (!done) { done = true; el.classList.add('is-expired'); el.dispatchEvent(new CustomEvent('dd:expired')); opts.onExpire?.(); } };
  btn.addEventListener('click', () => { if (done) return; done = true; cancelAnimationFrame(raf); el.classList.add('is-undone'); el.dispatchEvent(new CustomEvent('dd:undo')); opts.onUndo?.(); });
  raf = requestAnimationFrame(tick);
  return { cancel: () => { done = true; cancelAnimationFrame(raf); } };
}

// snapTo(point, slots) — pick the nearest valid slot for a structured surface; returns null when
// nothing is within `radius` so a canvas can fall back to free positioning.
export function snapTo(point, slots, radius = 80) {
  let best = null, d = radius;
  for (const s of slots) { const cx = s.left + s.width / 2, cy = s.top + s.height / 2; const dist = Math.hypot(point.x - cx, point.y - cy); if (dist < d) { d = dist; best = s; } }
  return best;
}
