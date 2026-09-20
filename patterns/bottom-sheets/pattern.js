// Bottom Sheet: anchored to the thumb, keeps the page visible, snaps between peek / full, drags to dismiss,
// dims the page with a scrim and locks its scroll while open.
// Usage: const sheet = BottomSheet(sheetEl, { scrim: scrimEl, page: scrollingEl, peek: 180 }); sheet.open('peek'); sheet.snapTo('full'); sheet.close();
export function BottomSheet(el, opts = {}) {
  const peek = opts.peek ?? 180, scrim = opts.scrim, page = opts.page;
  let snap = el.dataset.snap || null, startY = 0, startOffset = 0, dragging = false;
  el.style.setProperty('--bs-peek', peek + 'px');
  if (!snap) el.classList.add('is-hidden');

  const offsetFor = s => s === 'full' ? 0 : s === 'peek' ? el.offsetHeight - peek : el.offsetHeight;
  const apply = s => {
    snap = s;
    el.classList.toggle('is-hidden', !s); if (s) el.dataset.snap = s; else delete el.dataset.snap;
    if (scrim) scrim.style.opacity = s ? '1' : '0';
    if (page) { page.style.overflow = s ? 'hidden' : ''; page.classList.toggle('is-locked', !!s); }   // scroll lock
    el.dispatchEvent(new CustomEvent('bs:snap', { bubbles: true, detail: { snap: s } }));
  };

  // Drag: follow the finger, then settle on the nearest snap point (or dismiss when flung down).
  const onDown = e => { dragging = true; startY = e.clientY; startOffset = offsetFor(snap); el.classList.add('is-dragging'); el.setPointerCapture?.(e.pointerId); };
  const onMove = e => { if (!dragging) return; const dy = Math.max(-startOffset, e.clientY - startY); el.style.transform = `translateY(${startOffset + dy}px)`; };
  const onUp = e => {
    if (!dragging) return; dragging = false; el.classList.remove('is-dragging'); el.style.transform = '';
    const dy = e.clientY - startY, h = el.offsetHeight, y = startOffset + dy;
    if (dy > 80 && snap === 'peek') return apply(null);                                 // flung down from peek: dismiss
    const points = [['full', 0], ['peek', h - peek], [null, h]];
    apply(points.reduce((a, b) => Math.abs(b[1] - y) < Math.abs(a[1] - y) ? b : a)[0]);
  };
  el.addEventListener('pointerdown', onDown); el.addEventListener('pointermove', onMove); el.addEventListener('pointerup', onUp); el.addEventListener('pointercancel', onUp);
  scrim?.addEventListener('click', () => apply(null));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && snap) apply(null); });

  return { open: (s = 'peek') => apply(s), close: () => apply(null), snapTo: apply, get snap() { return snap; } };
}

// Thumb reach: given a screen height, returns the comfort zone (bottom third) and the dead zone (top).
export const reachZones = h => ({ comfort: [Math.round(h * 2 / 3), h], stretch: [Math.round(h / 3), Math.round(h * 2 / 3)], dead: [0, Math.round(h / 3)] });
