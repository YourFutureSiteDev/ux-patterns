// Destructive actions: hold-to-confirm, verb-labelled dialogs and a cancelable cooldown.

// Hold-to-confirm: the held press is the safeguard. Progress runs 0..1 over `duration` ms while the
// pointer is down; releasing early resets to 0 and fires nothing. Confirm fires exactly once at 1.
// Usage: HoldToConfirm(buttonEl, { duration: 300, onProgress: p => {}, onConfirm: () => {}, onCancel: () => {} })
export function HoldToConfirm(btn, opts = {}) {
  const duration = opts.duration ?? 300;
  let raf = 0, start = 0, done = false;
  const progress = p => { btn.style.setProperty('--p', p); btn.setAttribute('aria-valuenow', Math.round(p * 100)); opts.onProgress?.(p); };
  const tick = now => {
    const p = Math.min(1, (now - start) / duration); progress(p);
    if (p < 1) raf = requestAnimationFrame(tick);
    else { done = true; btn.classList.add('is-confirmed'); btn.dispatchEvent(new CustomEvent('da:confirm')); opts.onConfirm?.(); }
  };
  const down = e => { if (e.button && e.button !== 0) return; done = false; btn.classList.add('is-holding'); start = performance.now(); raf = requestAnimationFrame(tick); btn.setPointerCapture?.(e.pointerId); };
  const up = () => { cancelAnimationFrame(raf); btn.classList.remove('is-holding'); if (!done) { progress(0); btn.dispatchEvent(new CustomEvent('da:cancel')); opts.onCancel?.(); } };
  btn.setAttribute('role', 'button'); btn.setAttribute('aria-valuemin', '0'); btn.setAttribute('aria-valuemax', '100');
  btn.addEventListener('pointerdown', down); btn.addEventListener('pointerup', up); btn.addEventListener('pointercancel', up); btn.addEventListener('pointerleave', up);
  btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); down({ button: 0 }); } });
  btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') up(); });
  return { reset: () => { cancelAnimationFrame(raf); done = false; progress(0); btn.classList.remove('is-holding', 'is-confirmed'); } };
}

// Confirm dialog with verb labels: the destructive verb is the button text, never "Yes".
// Usage: ConfirmDialog({ title: 'Delete this project?', body: '…', confirm: 'Delete project', cancel: 'Keep project' }).then(ok => …)
export function ConfirmDialog({ title, body, confirm, cancel = 'Cancel', mount = document.body } = {}) {
  return new Promise(resolve => {
    const el = document.createElement('div'); el.className = 'da da-dialog'; el.setAttribute('role', 'alertdialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = `<div class="da-dialog__title"></div><div class="da-dialog__body"></div><div class="da-dialog__actions"><button class="da-btn" data-k="0"></button><button class="da-btn da-btn--red" data-k="1"></button></div>`;
    el.querySelector('.da-dialog__title').textContent = title; el.querySelector('.da-dialog__body').textContent = body;
    const [keep, del] = el.querySelectorAll('button'); keep.textContent = cancel; del.textContent = confirm;
    el.addEventListener('click', e => { const k = e.target.closest('button')?.dataset.k; if (k !== undefined) { el.remove(); resolve(k === '1'); } });
    el.addEventListener('keydown', e => { if (e.key === 'Escape') { el.remove(); resolve(false); } });
    mount.appendChild(el); keep.focus();
  });
}

// Red budget: count the red elements inside a root so a settings page can prove it spent red on destruction only.
export function redBudget(root, isRed = el => /^(rgb\(2[0-9]{2}, [0-9]{2}, [0-9]{2}\))/.test(getComputedStyle(el).color) || /^(rgb\(2[0-9]{2}, [0-9]{2}, [0-9]{2}\))/.test(getComputedStyle(el).backgroundColor)) {
  return [...root.querySelectorAll('*')].filter(isRed).length;
}

// Cooldown: schedule an irreversible deletion with a grace period the user can cancel.
// Usage: const c = Cooldown(cardEl, { days: 14 }); c.set(6); c.cancel();
export function Cooldown(root, opts = {}) {
  const total = opts.days ?? 14;
  const num = root.querySelector('.da-cool__days b'), grid = root.querySelector('.da-cool__grid'), badge = root.querySelector('.da-cool__badge'), cancelBtn = root.querySelector('.da-cool__cancel');
  let days = total, timer = 0;
  const render = () => {
    num.textContent = days;
    [...grid.children].forEach((d, i) => d.classList.toggle('is-gone', i < total - days));
  };
  const set = d => { days = Math.max(0, Math.min(total, Math.round(d))); render(); };
  const cancel = () => { clearInterval(timer); days = total; root.classList.add('is-cancelled'); badge.innerHTML = '<svg class="da-ico" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Cancelled'; render(); root.dispatchEvent(new CustomEvent('da:cancelled')); };
  // Demo cadence: 14 → 6 in 1.5 s, → 3 by 3 s, → 1 by 4 s (eased like the reel). Pass a time to freeze at that point.
  const keys = [[0, 14], [1.5, 6], [3, 3], [4, 1]];
  const at = t => { for (let i = 1; i < keys.length; i++) { const [t0, d0] = keys[i - 1], [t1, d1] = keys[i]; if (t <= t1) return d0 + (d1 - d0) * ((t - t0) / (t1 - t0)); } return 1; };
  const playCountdown = freezeAt => {
    clearInterval(timer); root.classList.remove('is-cancelled');
    if (freezeAt !== null && freezeAt !== undefined) return set(at(freezeAt));
    const t0 = performance.now(); timer = setInterval(() => { const l = (performance.now() - t0) / 1000; set(at(l)); if (l >= 4) clearInterval(timer); }, 80);
  };
  cancelBtn?.addEventListener('click', cancel);
  render();
  return { root, set, cancel, playCountdown, get days() { return days; } };
}
