// Modal hierarchy: one opener that picks the right overlay for the job.
// pickOverlay({ blocks, mobile, anchor, navigation }) answers the reel's decision tree;
// Overlay(kind, el) opens/closes a modal, bottom sheet, drawer or popover with the right behaviour.

// The decision tree: does it block the user? yes -> modal. no -> mobile? sheet. anchored? popover. navigation? drawer.
export function pickOverlay({ blocks = false, mobile = false, anchor = null, navigation = false } = {}) {
  if (blocks) return 'modal';
  if (mobile) return 'sheet';
  if (anchor) return 'popover';
  if (navigation) return 'drawer';
  return 'popover';
}

// Overlay controller. `root` is the container (a screen or the document body), `panel` the overlay element.
// kind: 'modal' | 'sheet' | 'drawer' | 'popover'. Options: anchor (popover), snapPoints (sheet, fractions of height), onClose.
export function Overlay(kind, root, panel, opts = {}) {
  let scrim = null, open = false, snap = 0;
  const snaps = opts.snapPoints || [0.5, 1];
  const blocking = kind === 'modal';
  panel.setAttribute('role', blocking ? 'alertdialog' : 'dialog');
  panel.setAttribute('aria-modal', String(blocking));

  function show() {
    if (open) return; open = true;
    if (kind !== 'popover') { scrim = document.createElement('div'); scrim.className = 'mh-scrim'; scrim.style.opacity = blocking ? '1' : '.5'; root.appendChild(scrim); if (!blocking) scrim.addEventListener('click', hide); }
    panel.hidden = false;
    if (kind === 'sheet') { snap = 0; panel.style.height = snaps[0] * 100 + '%'; panel.style.animation = 'mh-slide-up .35s cubic-bezier(.2,.8,.2,1)'; }
    if (kind === 'drawer') panel.style.animation = 'mh-slide-left .3s cubic-bezier(.2,.8,.2,1)';
    if (kind === 'popover') { place(); panel.style.animation = 'mh-pop .18s ease-out'; document.addEventListener('pointerdown', outside, true); }
    if (kind === 'modal') { panel.style.animation = 'mh-in .25s ease-out'; trap(); }
    document.addEventListener('keydown', esc);
    panel.dispatchEvent(new CustomEvent('mh:open', { detail: { kind } }));
  }
  function hide() {
    if (!open) return; open = false;
    scrim?.remove(); scrim = null; panel.hidden = true; panel.style.animation = '';
    document.removeEventListener('keydown', esc); document.removeEventListener('pointerdown', outside, true);
    panel.dispatchEvent(new CustomEvent('mh:close', { detail: { kind } })); opts.onClose?.();
  }
  const esc = e => { if (e.key === 'Escape') hide(); };
  const outside = e => { if (!panel.contains(e.target) && !(opts.anchor && opts.anchor.contains(e.target))) hide(); };
  // Popover: anchored to its trigger, capped at 200px wide so it stays contextual.
  function place() {
    const a = opts.anchor?.getBoundingClientRect(), r = root.getBoundingClientRect(); if (!a) return;
    panel.style.maxWidth = '200px'; panel.style.left = Math.min(a.left - r.left, r.width - 208) + 'px'; panel.style.top = (a.bottom - r.top + 8) + 'px';
  }
  // Sheet: cycle snap points (half, full) by swipe or tap on the handle.
  function nextSnap() { snap = (snap + 1) % snaps.length; panel.style.transition = 'height .3s cubic-bezier(.2,.8,.2,1)'; panel.style.height = snaps[snap] * 100 + '%'; }
  function trap() { const f = panel.querySelector('button, [href], input, [tabindex]'); f?.focus(); }
  return { show, hide, toggle: () => (open ? hide() : show()), nextSnap, get open() { return open; }, kind };
}
