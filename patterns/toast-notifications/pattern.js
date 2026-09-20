// Toast Notifications: five rules. Position (bottom-right desktop, top mobile, never centre), timing by severity,
// max three visible with the rest queued, always dismissible (close, swipe, hover pauses), colour + icon + accent.
// Usage: const toasts = ToastStack(containerEl, { max: 3 }); toasts.push({ type: 'success', title: 'Saved', sub: 'Changes are live' })

export const DURATIONS = { info: 4000, success: 4000, warning: 7000, error: Infinity }; // error holds until acknowledged

const ICONS = {
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  success: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  warning: '<svg viewBox="0 0 24 24"><path d="M12 4L2.5 20h19L12 4zM12 10v4M12 17h.01"/></svg>',
  error: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};

// Build one toast element. No behaviour on its own; the stack owns timing.
export function Toast({ type = 'info', title = '', sub = '', bar = false, size = '' } = {}) {
  const el = document.createElement('div');
  el.className = `tn-toast tn-toast--${type}${size ? ` tn-toast--${size}` : ''}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `<div class="tn-toast__icon">${ICONS[type] || ICONS.info}</div><div class="tn-toast__body"><div class="tn-toast__title">${title}</div><div class="tn-toast__sub">${sub}</div></div><button class="tn-toast__close" aria-label="Dismiss">×</button>${bar ? '<i class="tn-toast__bar"></i>' : ''}`;
  return el;
}

export function ToastStack(root, opts = {}) {
  const max = opts.max ?? 3, durations = { ...DURATIONS, ...(opts.durations || {}) };
  root.classList.add('tn-stack');
  const live = [], queue = [];
  const layout = () => live.forEach((t, i) => { t.el.dataset.i = live.length - 1 - i; });   // newest = 0 = bottom
  const remove = (t) => {
    const i = live.indexOf(t); if (i < 0) return;
    live.splice(i, 1); clearTimeout(t.timer); t.el.classList.add('is-leaving'); layout();
    setTimeout(() => t.el.remove(), 400);
    root.dispatchEvent(new CustomEvent('tn:dismiss', { detail: t.opts }));
    if (queue.length) show(queue.shift());                                       // Rule 3: the rest queue, newest enters at the bottom
  };
  const arm = (t) => {
    const ms = t.opts.duration ?? durations[t.opts.type] ?? 4000;               // Rule 2: timing follows severity
    if (!isFinite(ms)) return;
    t.remaining = t.remaining ?? ms; t.started = performance.now();
    t.timer = setTimeout(() => remove(t), t.remaining);
    const bar = t.el.querySelector('.tn-toast__bar'); if (bar) { bar.style.transition = `transform ${t.remaining}ms linear`; requestAnimationFrame(() => bar.style.transform = 'scaleX(0)'); }
  };
  const pause = (t) => {                                                         // Rule 4: hover pauses the timer
    if (!t.timer) return; clearTimeout(t.timer); t.timer = null; t.remaining -= performance.now() - t.started;
    const bar = t.el.querySelector('.tn-toast__bar'); if (bar) { const w = getComputedStyle(bar).transform; bar.style.transition = 'none'; bar.style.transform = w; }
  };
  const show = (opts) => {
    const t = { opts, el: Toast(opts) };
    t.el.querySelector('.tn-toast__close').addEventListener('click', () => remove(t));
    t.el.addEventListener('mouseenter', () => pause(t)); t.el.addEventListener('mouseleave', () => arm(t));
    swipeToDismiss(t.el, () => remove(t));
    t.el.classList.add('is-entering'); root.appendChild(t.el); live.push(t); layout();
    requestAnimationFrame(() => requestAnimationFrame(() => { t.el.classList.remove('is-entering'); }));
    arm(t);
    return t;
  };
  return {
    push(opts) { if (live.length >= max) { queue.push(opts); return null; } return show(opts); },
    dismiss(t) { remove(t && t.el ? t : live.find(x => x.el === t)); },
    clear() { [...live].forEach(remove); queue.length = 0; },
    get visible() { return live.length; }, get queued() { return queue.length; }
  };
}

// Swipe to dismiss (mobile): drag past 80px or flick, and the toast leaves in that direction.
export function swipeToDismiss(el, onDismiss, threshold = 80) {
  let x0 = null, dx = 0;
  el.addEventListener('pointerdown', e => { x0 = e.clientX; dx = 0; el.setPointerCapture(e.pointerId); el.style.transition = 'none'; });
  el.addEventListener('pointermove', e => { if (x0 === null) return; dx = e.clientX - x0; el.style.translate = `${dx}px 0`; el.style.opacity = String(Math.max(.2, 1 - Math.abs(dx) / 240)); });
  const end = () => { if (x0 === null) return; el.style.transition = ''; if (Math.abs(dx) > threshold) { el.style.translate = `${Math.sign(dx) * 400}px 0`; el.style.opacity = '0'; onDismiss(); } else { el.style.translate = ''; el.style.opacity = ''; } x0 = null; };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}

// Position helper: bottom-right on desktop, top on mobile, never the centre.
export function placeStack(root, viewport = window) {
  const mobile = viewport.innerWidth < 640;
  Object.assign(root.style, mobile ? { top: '16px', left: '16px', right: '16px', bottom: 'auto' } : { bottom: '24px', right: '24px', top: 'auto', left: 'auto' });
  return mobile ? 'top' : 'bottom-right';
}
