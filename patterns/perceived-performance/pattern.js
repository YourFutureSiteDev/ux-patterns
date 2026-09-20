// Perceived Performance: same loading time, different feeling.
// Three tricks the brain doesn't notice: skeleton screens, optimistic UI, progress illusions.

// 1. Skeleton screen: show the layout before the content. Bones on start(), content on done().
export function SkeletonPost(root) {
  return {
    start() { root.classList.add('is-loading'); },
    done() { root.classList.remove('is-loading'); },
    async load(promise) { this.start(); try { return await promise; } finally { this.done(); } }
  };
}

// 2. Optimistic like: assume success, update instantly, reconcile with the server after.
// Usage: OptimisticLike(el, { count: 142, request: () => fetch(...) })
export function OptimisticLike(root, { count = 0, request = () => new Promise(r => setTimeout(r, 800)), optimistic = true } = {}) {
  const heart = root.querySelector('.pp-like__heart'), num = root.querySelector('.pp-like__count');
  let liked = root.classList.contains('is-liked'), n = count, inflight = null;
  const render = () => { num.textContent = n; root.classList.toggle('is-liked', liked); };
  root.addEventListener('click', async () => {
    const prevLiked = liked, prevN = n;
    if (optimistic) { liked = !liked; n += liked ? 1 : -1; render(); }         // update instantly
    else { root.classList.add('is-pending'); }                                  // the pessimistic control waits
    const my = inflight = request();
    try { await my; if (inflight !== my) return; if (!optimistic) { liked = !liked; n += liked ? 1 : -1; } }
    catch { if (inflight === my) { liked = prevLiked; n = prevN; } }             // roll back on failure
    root.classList.remove('is-pending'); render();
  });
  render();
  return { get liked() { return liked; }, get count() { return n; }, set(v) { n = v; render(); }, toggle() { root.click(); } };
}

// 3. Progress illusion: same duration, different curve. A fast start reads as speed.
// linear(t) is honest; psychological(t) races to ~80% early, then eases into the last stretch.
export const curves = {
  linear: t => t,
  psychological: t => { t = Math.max(0, Math.min(1, t)); return 1 - Math.pow(1 - t, 2.6); },
};

// Drive a bar + percentage label along a curve over `duration` ms. set(t) with t in 0..1 for frozen states.
export function ProgressBar(root, { curve = curves.linear, fill = '.pp-bar__fill', label = null, duration = 3000 } = {}) {
  const f = root.querySelector(fill), l = label ? (typeof label === 'string' ? root.querySelector(label) : label) : null;
  let raf = 0;
  const api = {
    set(t) { const p = Math.round(curve(Math.max(0, Math.min(1, t))) * 100); f.style.width = p + '%'; if (l) l.textContent = p + '%'; return p; },
    run(onDone) { cancelAnimationFrame(raf); const t0 = performance.now(); const tick = now => { const t = (now - t0) / duration; api.set(t); if (t < 1) raf = requestAnimationFrame(tick); else onDone && onDone(); }; raf = requestAnimationFrame(tick); },
    stop() { cancelAnimationFrame(raf); }
  };
  return api;
}

// Estimated time remaining for a psychological curve: reported honestly from the real elapsed time.
export function remaining(elapsedMs, durationMs) { return Math.max(0, (durationMs - elapsedMs) / 1000).toFixed(1) + 's remaining'; }

// All three combined: an upload card that shows a skeleton placeholder, a fast-start bar and an instant "Done".
export function UploadCard(root, { duration = 3000 } = {}) {
  const bar = ProgressBar(root, { curve: curves.psychological, fill: '.pp-upload__bar .pp-bar__fill', label: root.querySelector('.pp-upload__pct'), duration });
  const pct = root.querySelector('.pp-upload__pct');
  return {
    reset() { root.classList.remove('is-done'); bar.set(0); },
    set(t) { root.classList.toggle('is-done', t >= 1); bar.set(t); if (t >= 1) pct.textContent = '✓ Done!'; },
    run() { this.reset(); bar.run(() => { root.classList.add('is-done'); pct.textContent = '✓ Done!'; }); }
  };
}
