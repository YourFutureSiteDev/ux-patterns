// Loading States System: pick the loading pattern from what you know about the wait.
// known shape + > 300ms  -> skeleton     known %  + > 3s -> progress bar
// unknown duration < 3s  -> spinner      reversible action -> optimistic UI
// anything under 300ms   -> show nothing at all

export function pickLoadingState({ expectedMs = 0, knownShape = false, knownPercent = false, reversible = false } = {}) {
  if (reversible) return 'optimistic';
  if (expectedMs < 300) return 'nothing';
  if (knownPercent && expectedMs > 3000) return 'progress';
  if (knownShape) return 'skeleton';
  return 'spinner';
}

// Skeleton with a flash guard: bones only appear if the wait passes `delay` (default 300ms), so a fast
// response lands with no loading state at all. Usage: const s = Skeleton(card); s.start(); ...; s.done();
export function Skeleton(root, { delay = 300 } = {}) {
  let timer = null;
  return {
    start() { clearTimeout(timer); timer = setTimeout(() => root.classList.add('is-loading'), delay); },
    done() { clearTimeout(timer); root.classList.remove('is-loading'); },
    async load(promise) { this.start(); try { return await promise; } finally { this.done(); } }
  };
}

// Spinner button: short, unknown wait. Swaps the label, shows the ring, disables re-submit.
export function SpinnerButton(btn, { busyLabel = 'Saving...', idleLabel } = {}) {
  const label = btn.querySelector('.ls-btn__label') || btn;
  idleLabel = idleLabel ?? label.textContent;
  return {
    busy() { btn.classList.add('is-busy'); btn.disabled = true; label.textContent = busyLabel; },
    idle() { btn.classList.remove('is-busy'); btn.disabled = false; label.textContent = idleLabel; },
    async run(promise) { this.busy(); try { return await promise; } finally { this.idle(); } }
  };
}

// Upload progress card: known percentage over a long wait, with real meta so the number earns trust.
// set({ pct, done, total, speed, remaining }) - sizes in MB, speed in MB/s, remaining in seconds.
export function UploadProgress(root) {
  const q = s => root.querySelector(s);
  const fill = q('.ls-bar__fill'), pct = q('.ls-upload__pct'), size = q('.ls-upload__size'), left = q('.ls-upload__meta i'), right = q('.ls-upload__meta em');
  return {
    set({ pct: p, done, total, speed, remaining }) {
      p = Math.max(0, Math.min(100, Math.round(p)));
      fill.style.width = p + '%'; pct.textContent = p + '%';
      const finished = p >= 100; root.classList.toggle('is-done', finished);
      size.textContent = finished ? `${total} MB · Complete` : `${done} of ${total} MB`;
      left.textContent = finished ? 'Done' : `${speed} MB/s`;
      right.textContent = finished ? '✓ Uploaded' : `${remaining}s remaining`;
    }
  };
}

// Optimistic like: flip the UI on tap, sync in the background, show "Synced" when the server agrees, roll back if it fails.
export function OptimisticLike(btn, countEl, { syncedEl = null, request = () => new Promise(r => setTimeout(r, 300)), syncedFor = 1500 } = {}) {
  let liked = btn.classList.contains('is-liked'), count = Number(countEl.textContent.replace(/[^\d]/g, '')) || 0, inflight = null, hide = null;
  const fmt = n => n.toLocaleString('en-US') + ' likes';
  const render = () => { countEl.textContent = fmt(count); btn.classList.toggle('is-liked', liked); btn.setAttribute('aria-pressed', liked); };
  btn.addEventListener('click', async () => {
    const prevLiked = liked, prevCount = count;
    liked = !liked; count += liked ? 1 : -1; render();                       // 0ms: user sees the result
    const my = inflight = request();
    try { await my; if (inflight !== my) return;                                // 300ms: server agrees
      if (syncedEl) { syncedEl.classList.add('is-on'); clearTimeout(hide); hide = setTimeout(() => syncedEl.classList.remove('is-on'), syncedFor); } }
    catch { if (inflight === my) { liked = prevLiked; count = prevCount; render(); } }  // rollback on fail
  });
  render();
  return { get liked() { return liked; }, get count() { return count; } };
}

// Show nothing: a generic delayed loader. Adds `cls` to `el` only if the promise is still pending after `delay`.
export async function withDelayedLoader(el, promise, { delay = 300, cls = 'is-loading' } = {}) {
  const t = setTimeout(() => el.classList.add(cls), delay);
  try { return await promise; } finally { clearTimeout(t); el.classList.remove(cls); }
}
