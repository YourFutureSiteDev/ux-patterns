// Focus States: a visible ring for keyboard users only, DOM-order tabbing, a focus trap for dialogs
// that hands focus back on Escape, and a skip link that is invisible until focused.

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Focus trap: Tab cycles inside `dialog`, Escape closes it and returns focus to the opener.
// Usage: const trap = FocusTrap(dialogEl, { onClose }); trap.open(openerEl); trap.close();
export function FocusTrap(dialog, opts = {}) {
  let opener = null, active = false;
  const items = () => [...dialog.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  const onKey = e => {
    if (!active) return;
    if (e.key === 'Escape') { e.preventDefault(); close('escape'); return; }
    if (e.key !== 'Tab') return;
    const list = items(); if (!list.length) return;
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const onFocusIn = e => { if (active && !dialog.contains(e.target)) (items()[0] || dialog).focus(); }; // nothing leaks to the page behind
  const open = from => {
    opener = from || document.activeElement; active = true;
    dialog.hidden = false; dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true');
    document.addEventListener('keydown', onKey); document.addEventListener('focusin', onFocusIn);
    (dialog.querySelector('[data-autofocus]') || items()[0] || dialog).focus();
    dialog.dispatchEvent(new CustomEvent('fs:open'));
  };
  const close = reason => {
    if (!active) return; active = false;
    document.removeEventListener('keydown', onKey); document.removeEventListener('focusin', onFocusIn);
    dialog.hidden = true; opener?.focus(); // hand focus back to the element that opened it
    dialog.dispatchEvent(new CustomEvent('fs:close', { detail: { reason } })); opts.onClose?.(reason);
  };
  return { open, close, get active() { return active; } };
}

// Skip link: first focusable element on the page, visually hidden until it receives focus, jumps past the header.
// Usage: SkipLink(linkEl, mainEl)
export function SkipLink(link, main) {
  link.classList.add('fs-skip');
  main.tabIndex = main.tabIndex >= 0 ? main.tabIndex : -1;
  link.addEventListener('click', e => { e.preventDefault(); main.focus({ preventScroll: false }); main.scrollIntoView({ block: 'start' }); link.dispatchEvent(new CustomEvent('fs:skip', { detail: { skipped: countLinksBefore(link, main) } })); });
  return { focus: () => link.focus() };
}
export function countLinksBefore(from, to) {
  const all = [...document.querySelectorAll(FOCUSABLE)];
  return all.slice(all.indexOf(from) + 1, all.indexOf(to)).length;
}

// Tab order audit: compares DOM order with visual (top-to-left) order and reports teleports.
export function auditTabOrder(root = document) {
  const els = [...root.querySelectorAll(FOCUSABLE)];
  const visual = [...els].sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return Math.abs(ra.top - rb.top) > 8 ? ra.top - rb.top : ra.left - rb.left; });
  return els.map((el, i) => ({ el, dom: i + 1, visual: visual.indexOf(el) + 1, teleports: visual.indexOf(el) !== i }));
}

// Key hint: lights a .fs-key when its key is pressed (Tab, Escape, Enter) so the demo mirrors the keyboard.
export function KeyHints(map) {
  document.addEventListener('keydown', e => { const el = map[e.key]; if (el) { el.classList.add('is-on'); setTimeout(() => el.classList.remove('is-on'), 260); } });
}
