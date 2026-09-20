// Autosave: debounce the write, keep the status pill honest, queue edits offline, guard the exit.

// Debounce window. hit() restarts the timer; onTick(ms) reports elapsed silence (for a progress bar);
// onFire() runs once after `wait` ms of quiet. Returns { hit, cancel, flush }.
export function Debounce({ wait = 800, onTick, onFire, tick = 50 } = {}) {
  let start = 0, timer = null, ticker = null;
  const stop = () => { clearTimeout(timer); clearInterval(ticker); timer = ticker = null; };
  return {
    hit() {
      stop(); start = performance.now(); onTick?.(0);
      if (onTick) ticker = setInterval(() => onTick(Math.min(wait, Math.round(performance.now() - start))), tick);
      timer = setTimeout(() => { stop(); onTick?.(wait); onFire?.(); }, wait);
    },
    cancel: stop,
    flush() { if (timer) { stop(); onFire?.(); } }
  };
}

// The status pill as a state machine: typing -> saving -> saved, or offline / error. Never lies:
// the pill reads what the machine is in, and the machine only moves on real events.
export const SAVE_STATES = {
  typing:  { label: 'Typing…', cls: 'as-pill--typing' },
  saving:  { label: 'Saving…', cls: 'as-pill--saving' },
  saved:   { label: 'Saved',   cls: 'as-pill--saved' },
  offline: { label: 'Offline', cls: 'as-pill--offline' },
  error:   { label: 'Error',   cls: 'as-pill--error' }
};
const TRANSITIONS = {
  typing:  ['saving', 'offline'],
  saving:  ['saved', 'error', 'offline'],
  saved:   ['typing', 'offline'],
  offline: ['saving', 'typing', 'error'],
  error:   ['saving', 'typing']
};
export function SaveStatus(pillEl, initial = 'saved') {
  let state = initial;
  const render = () => {
    pillEl.className = pillEl.className.replace(/as-pill--\w+/g, '').trim() + ' ' + SAVE_STATES[state].cls;
    const label = pillEl.querySelector('[data-label]') || pillEl;
    label.textContent = SAVE_STATES[state].label;
    pillEl.dataset.state = state;
  };
  render();
  return {
    get state() { return state; },
    to(next) {
      if (!TRANSITIONS[state].includes(next)) throw new Error(`autosave: illegal transition ${state} -> ${next}`);
      state = next; render(); pillEl.dispatchEvent(new CustomEvent('as:state', { detail: { state } }));
    }
  };
}

// Full autosave controller. `save(edits)` is your request; edits queue locally while offline and drain
// oldest first on reconnect. Emits as:state on the pill and as:queue on `root` with the pending count.
export function Autosave({ pill, save, wait = 800, online = () => navigator.onLine, root = document } = {}) {
  const status = SaveStatus(pill, 'saved');
  const queue = [];
  const emitQueue = () => root.dispatchEvent(new CustomEvent('as:queue', { detail: { pending: queue.length, items: [...queue] } }));
  let draining = false;
  const drain = async () => {
    if (draining) return; draining = true;
    while (queue.length && online()) {
      status.to('saving');
      try { await save(queue[0]); queue.shift(); emitQueue(); }
      catch (e) { status.to('error'); draining = false; return; }
    }
    draining = false;
    if (!queue.length) status.to('saved'); else if (!online()) status.to('offline');
  };
  const deb = Debounce({ wait, onFire: () => { if (online()) drain(); else status.to('offline'); } });
  const api = {
    status, queue,
    edit(change) {
      queue.push({ ...change, at: Date.now() }); emitQueue();
      if (status.state !== 'typing' && status.state !== 'offline') status.to('typing');
      deb.hit();
    },
    reconnect() { if (queue.length) drain(); },
    get dirty() { return queue.length > 0; }
  };
  window.addEventListener('online', api.reconnect);
  window.addEventListener('offline', () => { if (status.state !== 'offline') status.to('offline'); });
  return api;
}

// Navigation guard: the browser asks first whenever `isDirty()` is true.
export function NavigationGuard(isDirty) {
  const warn = e => { if (isDirty()) { e.preventDefault(); e.returnValue = ''; } };
  window.addEventListener('beforeunload', warn);
  return () => window.removeEventListener('beforeunload', warn);
}

// Conflict check for last-write-wins: compares the base version you loaded with the server's current one.
// Returns 'clean' when nothing moved, 'merge' when both sides added distinct paragraphs, 'conflict' otherwise.
export function detectConflict(base, mine, theirs) {
  if (theirs === base) return 'clean';
  const added = (a, b) => b.split('\n').filter(l => !a.split('\n').includes(l));
  const mineAdd = added(base, mine), theirsAdd = added(base, theirs);
  return mineAdd.some(l => theirsAdd.includes(l)) ? 'conflict' : 'merge';
}
export function merge(base, mine, theirs) {
  const lines = base.split('\n');
  const extra = [...mine.split('\n'), ...theirs.split('\n')].filter(l => !lines.includes(l));
  return [...lines, ...extra].join('\n');
}
