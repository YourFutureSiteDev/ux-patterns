// Notification System: one message, four surfaces. The trigger's severity picks the volume,
// and persistence is part of the contract:
//   toast   low      auto-dismisses (4s), offers undo, stacks and breathes
//   banner  medium   stays until the user clears it
//   modal   high     blocks until the user acts; never queue two
//   badge   passive  sits quietly until the count is cleared

export const SURFACES = {
  toast:  { volume: 'low',     persistence: 'auto-dismiss', ttl: 4000, stacks: true },
  banner: { volume: 'medium',  persistence: 'manual',       ttl: null, stacks: false },
  modal:  { volume: 'high',    persistence: 'blocking',     ttl: null, stacks: false },
  badge:  { volume: 'passive', persistence: 'quiet',        ttl: null, stacks: false },
};

// Map a notification's severity to its surface. severity: 'info' | 'warning' | 'error' | 'passive'
// blocking=true forces a modal (only for things the user genuinely must act on before continuing).
export function pickSurface({ severity = 'info', blocking = false } = {}) {
  if (blocking || severity === 'error') return 'modal';
  if (severity === 'warning') return 'banner';
  if (severity === 'passive') return 'badge';
  return 'toast';
}

// The notifier: routes each notification to its surface with the right persistence rules.
// Usage: const n = Notifier({ toastRoot, bannerRoot, modalRoot, badgeEl });
//        n.notify({ severity: 'info', title: 'New message', body: 'Sarah Chen sent you a file.', undo: () => {...} })
export function Notifier({ toastRoot, bannerRoot, modalRoot, badgeEl, ttl = 4000, maxToasts = 3 } = {}) {
  let unread = 0, modalOpen = false;
  const el = (cls, html) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; return d; };
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const api = {
    toast({ title, body, undo, tone = 'blue' }) {                       // low: auto-dismiss, undo, stack
      const t = el(`nsy-toast nsy-toast--${tone}`, `<span class="nsy-ico nsy-ico--${tone}"></span><div><div class="nsy-toast__title">${esc(title)}</div><div class="nsy-toast__body">${esc(body)}</div>${undo ? '<button class="nsy-undo">↺ UNDO</button>' : ''}</div>`);
      if (undo) t.querySelector('.nsy-undo').addEventListener('click', () => { undo(); api.dismiss(t); });
      toastRoot.appendChild(t);
      while (toastRoot.children.length > maxToasts) toastRoot.firstElementChild.remove();   // stack, but breathe
      t._ttl = setTimeout(() => api.dismiss(t), ttl);
      return t;
    },
    banner({ title, body }) {                                             // medium: stays until cleared
      const b = el('nsy-banner', `<span class="nsy-ico nsy-ico--amber"></span><div><div class="nsy-banner__title">${esc(title)}</div><div class="nsy-banner__body">${esc(body)}</div></div><button class="nsy-x" aria-label="Dismiss">✕</button>`);
      b.querySelector('.nsy-x').addEventListener('click', () => b.remove());
      bannerRoot.replaceChildren(b);
      return b;
    },
    modal({ title, body, confirm = 'Confirm', cancel = 'Cancel', onConfirm, onCancel }) {   // high: blocks, never queues
      if (modalOpen) { console.warn('nsy: a modal is already open; refusing to stack a second one'); return null; }
      modalOpen = true;
      const m = el('nsy-modal', `<div class="nsy-modal__head"><span class="nsy-ico nsy-ico--pink"></span><div class="nsy-modal__title">${esc(title)}</div></div><div class="nsy-modal__body">${esc(body)}</div><div class="nsy-modal__actions"><button class="nsy-btn" data-a="cancel">${esc(cancel)}</button><button class="nsy-btn nsy-btn--pink" data-a="confirm">${esc(confirm)}</button></div>`);
      m.addEventListener('click', e => { const a = e.target.dataset.a; if (!a) return; (a === 'confirm' ? onConfirm : onCancel)?.(); m.remove(); modalOpen = false; });
      modalRoot.replaceChildren(m);
      return m;
    },
    badge(n = 1) { unread += n; if (badgeEl) badgeEl.textContent = unread > 99 ? '99+' : String(unread); return unread; },   // passive
    clearBadge() { unread = 0; if (badgeEl) badgeEl.textContent = ''; },
    dismiss(t) { clearTimeout(t._ttl); t.classList.add('is-leaving'); setTimeout(() => t.remove(), 300); },
    notify(n) { const s = pickSurface(n); return s === 'badge' ? api.badge(n.count ?? 1) : api[s](n); },
    get modalOpen() { return modalOpen; }, get unread() { return unread; },
  };
  return api;
}
