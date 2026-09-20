// Hover Trap: touch has no hover. Gate hover styles on the pointer, never bury a primary action behind
// hover, give hover-only extras a touch home (in the card, behind a swipe, in a bottom sheet), pad hit areas to 44px.

// True when the primary pointer can hover (mouse, trackpad, tablet + mouse). Use this instead of UA sniffing.
export function hoverCapable() { return matchMedia('(hover: hover)').matches; }
export function coarsePointer() { return matchMedia('(pointer: coarse)').matches; }

// Add data-pointer="fine|coarse" and data-hover="hover|none" to <html>, kept live as the pointer changes.
export function watchPointer(root = document.documentElement) {
  const apply = () => { root.dataset.hover = hoverCapable() ? 'hover' : 'none'; root.dataset.pointer = coarsePointer() ? 'coarse' : 'fine'; };
  matchMedia('(hover: hover)').addEventListener('change', apply); matchMedia('(pointer: coarse)').addEventListener('change', apply); apply();
  return apply;
}

// Sticky hover timer: counts how long a faked :hover has been sitting on screen after a tap.
// Usage: StickyHoverTimer(valueEl, barEl, seconds)
export function StickyHoverTimer(valueEl, barEl, total = 6.1, speed = 1) {
  cancelAnimationFrame(valueEl._raf);
  const t0 = performance.now();
  const tick = now => {
    const s = Math.min(total, ((now - t0) / 1000) * speed);
    valueEl.textContent = `${s.toFixed(1)}s`; if (barEl) barEl.style.width = `${(s / total) * 100}%`;
    if (s < total) valueEl._raf = requestAnimationFrame(tick);
  };
  valueEl._raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(valueEl._raf);
}

// Swipe-to-reveal actions row. Drag or swipe the body left to expose the .ht-swipe actions; tap outside to close.
// Usage: SwipeActions(rowEl)  rowEl = .ht-row--swiped containing .ht-row__body and .ht-swipe
export function SwipeActions(row, opts = {}) {
  if (!row) return null;
  const body = row.querySelector('.ht-row__body'), actions = row.querySelector('.ht-swipe');
  const reveal = opts.reveal ?? (actions ? actions.offsetWidth : 118);
  let x0 = null, open = row.classList.contains('is-open') || body.style.transform.includes('-');
  const set = o => { open = o; body.style.transform = o ? `translateX(-${reveal}px)` : 'translateX(0)'; row.classList.toggle('is-open', o); row.dispatchEvent(new CustomEvent('ht:swipe', { detail: { open: o } })); };
  body.addEventListener('pointerdown', e => { x0 = e.clientX; body.setPointerCapture(e.pointerId); body.style.transition = 'none'; });
  body.addEventListener('pointermove', e => { if (x0 === null) return; const dx = Math.max(-reveal, Math.min(0, e.clientX - x0 - (open ? reveal : 0))); body.style.transform = `translateX(${dx}px)`; });
  body.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; body.style.transition = ''; set(open ? dx < reveal / 2 : dx < -reveal / 3); x0 = null; });
  document.addEventListener('pointerdown', e => { if (open && !row.contains(e.target)) set(false); });
  return { open: () => set(true), close: () => set(false), get isOpen() { return open; } };
}

// Bottom sheet that opens every hidden action with one tap. Tap the card beneath (or call open()) to show it.
// Usage: BottomSheet(sheetEl, { trigger })  sheetEl = .ht-sheet
export function BottomSheet(sheet, opts = {}) {
  if (!sheet) return null;
  const home = sheet.parentElement, trigger = opts.trigger || home.querySelector('.ht-card');
  const set = o => { sheet.classList.toggle('is-open', o); home.querySelectorAll('.ht-card').forEach(c => c.classList.toggle('is-under', o)); sheet.dispatchEvent(new CustomEvent('ht:sheet', { detail: { open: o } })); };
  trigger?.addEventListener('click', () => set(true));
  sheet.querySelector('.ht-sheet__handle')?.addEventListener('click', () => set(false));
  sheet.addEventListener('click', e => { const row = e.target.closest('span'); if (!row) return; sheet.querySelectorAll('span').forEach(s => s.classList.toggle('is-hi', s === row)); });
  return { open: () => set(true), close: () => set(false) };
}

// Pad a small icon button to a minimum hit area without changing the glyph size.
export function padHitArea(btn, min = 44) {
  const r = btn.getBoundingClientRect(); const px = Math.max(0, (min - Math.min(r.width, r.height)) / 2);
  btn.style.padding = `${px}px`; btn.style.boxSizing = 'content-box'; return px;
}
