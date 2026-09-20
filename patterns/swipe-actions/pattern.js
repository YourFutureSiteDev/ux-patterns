// Swipe Actions: two trip-wires (reveal, commit), rubber-band resistance past reveal,
// right = safe / left = destructive, a first-launch peek hint and an undo net instead of a dialog.

// Rubber-band: full 1:1 travel up to `reveal`, then diminishing returns until `commit`, then free again.
export function rubberBand(dx, { reveal = 180, commit = 480, k = 0.45 } = {}) {
  const s = Math.sign(dx), d = Math.abs(dx);
  if (d <= reveal) return dx;
  if (d >= commit) return s * (reveal + (commit - reveal) * k + (d - commit)); // resistance dies past commit
  return s * (reveal + (d - reveal) * k);
}

// Usage: SwipeRow(rowEl, { reveal: 180, commit: 480, right: 'archive', left: 'delete', onAction(name) })
// opts.right names the action fired by a rightward swipe (safe); opts.left the one fired by a leftward swipe (destructive).
// rowEl has .sw-row__body and optional .sw-row__actions--left / --right children.
export function SwipeRow(row, opts = {}) {
  const body = row.querySelector('.sw-row__body');
  const reveal = opts.reveal ?? 180, commit = opts.commit ?? 480;
  let startX = 0, x = opts.x ?? 0, open = x, dragging = false, ticked = false;
  const set = v => { x = v; body.style.setProperty('--sw-x', `${v}px`); row.dispatchEvent(new CustomEvent('sw:move', { detail: { x: v, progress: Math.min(1, Math.abs(v) / commit) } })); };
  const settle = v => { row.classList.add('is-settling'); set(v); open = v; setTimeout(() => row.classList.remove('is-settling'), 400); };
  const fire = name => { row.dispatchEvent(new CustomEvent('sw:action', { detail: { name } })); opts.onAction?.(name); };
  row.addEventListener('pointerdown', e => { dragging = true; ticked = false; startX = e.clientX - open; row.setPointerCapture(e.pointerId); row.classList.remove('is-settling'); });
  row.addEventListener('pointermove', e => {
    if (!dragging) return;
    const raw = e.clientX - startX;
    if ((raw < 0 && !opts.left) || (raw > 0 && !opts.right)) return set(raw * 0.15);
    const v = rubberBand(raw, { reveal, commit });
    if (!ticked && Math.abs(raw) >= commit) { ticked = true; row.dispatchEvent(new CustomEvent('sw:haptic')); navigator.vibrate?.(10); }
    set(v);
  });
  const end = e => {
    if (!dragging) return; dragging = false;
    const raw = e.clientX - startX, side = raw < 0 ? 'left' : 'right';
    if (Math.abs(raw) >= commit) { settle(Math.sign(raw) * row.offsetWidth); fire(opts[side]); }
    else if (Math.abs(raw) >= reveal * 0.5) settle(Math.sign(raw) * reveal); // reveal is a menu
    else settle(0);
  };
  row.addEventListener('pointerup', end); row.addEventListener('pointercancel', end);
  row.querySelectorAll('.sw-action').forEach(b => b.addEventListener('click', () => { fire(b.dataset.action); settle(0); }));
  return { open: v => settle(v), close: () => settle(0), get x() { return x; } };
}

// First-launch peek: half-reveal the actions, then settle back. Remembers it taught you.
export function peekHint(row, { key = 'sw-peek', distance = -70, hold = 700 } = {}) {
  let seen = false; try { seen = localStorage.getItem(key) === '1'; } catch {}
  if (seen) return false;
  const body = row.querySelector('.sw-row__body');
  row.classList.add('is-settling'); body.style.setProperty('--sw-x', `${distance}px`);
  setTimeout(() => { body.style.setProperty('--sw-x', '0px'); try { localStorage.setItem(key, '1'); } catch {} }, hold);
  return true;
}

// Undo net: hide the row, show a countdown toast, restore on Undo, delete for real when it expires.
// Usage: UndoDelete(row, { toast: toastEl, ttl: 5000, onCommit })
export function UndoDelete(row, { toast, ttl = 5000, onCommit } = {}) {
  const ring = toast.querySelector('.sw-toast__ring'), num = ring.querySelector('b'), undo = toast.querySelector('.sw-toast__undo');
  const h = row.offsetHeight; row.style.transition = 'height .3s, margin .3s, opacity .2s'; row.style.overflow = 'hidden';
  row.style.height = `${h}px`; requestAnimationFrame(() => { row.style.height = '0px'; row.style.marginTop = '-16px'; row.style.opacity = '0'; });
  toast.hidden = false; ring.style.setProperty('--sw-ttl', `${ttl}ms`);
  const t0 = Date.now(); const iv = setInterval(() => { const left = Math.ceil((ttl - (Date.now() - t0)) / 1000); num.textContent = Math.max(0, left); }, 100);
  const done = () => { clearInterval(iv); toast.hidden = true; undo.onclick = null; };
  const timer = setTimeout(() => { done(); row.remove(); onCommit?.(); }, ttl);
  undo.onclick = () => { clearTimeout(timer); done(); row.style.height = `${h}px`; row.style.marginTop = ''; row.style.opacity = ''; setTimeout(() => { row.style.height = ''; }, 300); };
}
