// Undo UX: act immediately, then offer a time-limited way back. Undo beats "Are you sure?".
// Exports: UndoToast, SoftDelete, TypeToConfirm, UndoStack, DelayedSend.

// 1. Undo toast: the action already happened; the toast is a countdown to make it permanent.
// Usage: UndoToast(toastEl, { window: 5000, onUndo, onCommit })
export function UndoToast(el, { window: ms = 5000, onUndo, onCommit } = {}) {
  const ring = el.querySelector('.ud-toast__ring'), btn = el.querySelector('.ud-toast__undo');
  let timer, done = false;
  const finish = (undone) => { if (done) return; done = true; clearTimeout(timer); ring?.classList.remove('is-counting'); el.classList.add('is-done'); (undone ? onUndo : onCommit)?.(); el.dispatchEvent(new CustomEvent(undone ? 'ud:undo' : 'ud:commit')); };
  el.style.setProperty('--ud-window', ms + 'ms'); ring?.classList.add('is-counting');
  timer = setTimeout(() => finish(false), ms);
  btn?.addEventListener('click', () => finish(true));
  return { undo: () => finish(true), commit: () => finish(false), get open() { return !done; } };
}

// 2. Soft delete: deletion is a state, not an event. Set deleted_at, keep the row, purge after the trash window.
export function SoftDelete(store, { trashDays = 30, now = () => Date.now() } = {}) {
  const day = 86400000;
  return {
    remove(id) { const r = store.find(x => x.id === id); if (r && !r.deleted_at) r.deleted_at = new Date(now()).toISOString().replace(/\.\d+Z$/, 'Z'); return r; },
    restore(id) { const r = store.find(x => x.id === id); if (r) r.deleted_at = null; return r; },
    visible() { return store.filter(r => !r.deleted_at); },                                   // what the user sees
    trash() { return store.filter(r => r.deleted_at); },                                        // what the database sees
    purge() { const cutoff = now() - trashDays * day; for (let i = store.length - 1; i >= 0; i--) if (store[i].deleted_at && Date.parse(store[i].deleted_at) < cutoff) store.splice(i, 1); return store; }
  };
}

// 3. Type to confirm: friction reserved for the irreversible. Enables the button only when the typed value matches.
export function TypeToConfirm(root, { expected, input = root.querySelector('input, [contenteditable]'), button = root.querySelector('.ud-confirm__btn'), onConfirm } = {}) {
  const check = () => { const v = (input.value ?? input.textContent).trim(); const ok = v === expected; root.classList.toggle('is-ready', ok); if (button) button.disabled = !ok; return ok; };
  input.addEventListener('input', check);
  button?.addEventListener('click', () => { if (check()) onConfirm?.(); });
  check();
  return { check };
}

// 4. Undo stack: every action is a command with an inverse; Cmd+Z walks back, Shift+Cmd+Z walks forward.
export function UndoStack({ onChange } = {}) {
  const done = [], undone = [];
  const emit = () => onChange?.({ done: [...done], undone: [...undone], canUndo: done.length > 0, canRedo: undone.length > 0 });
  const api = {
    push(cmd) { cmd.do?.(); done.push(cmd); undone.length = 0; emit(); return cmd; },
    undo() { const c = done.pop(); if (!c) return null; c.undo?.(); undone.push(c); emit(); return c; },
    redo() { const c = undone.pop(); if (!c) return null; c.do?.(); done.push(c); emit(); return c; },
    get history() { return [...done]; }, get depth() { return done.length; }
  };
  api.bind = (target = document) => target.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? api.redo() : api.undo(); } });
  return api;
}

// 5. Delayed send: hold the action for a grace period; "Undo" cancels it before it ever leaves.
export function DelayedSend({ delay = 10000, onTick, onSend, onUndo } = {}) {
  let start, raf, timer, cancelled = false;
  const tick = () => { const left = Math.max(0, delay - (performance.now() - start)); onTick?.(left, 1 - left / delay); if (left > 0 && !cancelled) raf = requestAnimationFrame(tick); };
  return {
    send() { cancelled = false; start = performance.now(); tick(); timer = setTimeout(() => { if (!cancelled) onSend?.(); }, delay); },
    undo() { if (cancelled) return; cancelled = true; clearTimeout(timer); cancelAnimationFrame(raf); onUndo?.(); }
  };
}
