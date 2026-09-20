// Optimistic UI: update the like the instant the user taps, sync in the background, roll back on failure.
// Usage: OptimisticLike(buttonEl, countEl, { request: () => Promise, latency: 800 })
export function OptimisticLike(btn, countEl, opts = {}) {
  const request = opts.request || (() => new Promise((res, rej) => setTimeout(opts.fail ? rej : res, opts.latency ?? 800)));
  let liked = false, count = Number(countEl.textContent) || 0, inflight = null;
  const render = () => { countEl.textContent = count; btn.classList.toggle('is-liked', liked); btn.setAttribute('aria-pressed', liked); };
  btn.addEventListener('click', async () => {
    const prevLiked = liked, prevCount = count;
    liked = !liked; count += liked ? 1 : -1; render();          // 1. render now
    const my = inflight = request();                              // 2. sync after
    try { await my; if (inflight === my) btn.dispatchEvent(new CustomEvent('ou:confirmed')); }
    catch { if (inflight === my) { liked = prevLiked; count = prevCount; render(); btn.dispatchEvent(new CustomEvent('ou:rolledback', { detail: { from: prevCount + (prevLiked ? -1 : 1), to: prevCount } })); } } // 3. reconcile
  });
  render();
  return { get liked() { return liked; }, get count() { return count; } };
}

// Pessimistic control for the comparison card: waits for the server before it changes anything.
export function PessimisticLike(btn, countEl, opts = {}) {
  let liked = false, count = Number(countEl.textContent) || 0;
  btn.addEventListener('click', async () => {
    btn.classList.add('is-pending'); btn.disabled = true;
    await new Promise(r => setTimeout(r, opts.latency ?? 800));
    liked = !liked; count += liked ? 1 : -1; countEl.textContent = count;
    btn.classList.toggle('is-liked--slow', liked); btn.classList.remove('is-pending'); btn.disabled = false;
  });
}

// Latency gauge: 0..1000 ms on a 240° arc, teal under 400, pink over.
export function LatencyGauge(root) {
  const needle = root.querySelector('.ou-gauge__needle'), val = root.querySelector('.ou-gauge__value b'), lab = root.querySelector('.ou-gauge__value span');
  return { set(ms) {
    const deg = -120 + (Math.min(1000, Math.max(0, ms)) / 1000) * 240;
    needle.style.transform = `rotate(${deg}deg)`; val.textContent = ms; root.classList.toggle('is-broken', ms > 400);
    lab.textContent = ms <= 400 ? 'FEELS INSTANT' : 'FEELS BROKEN';
  } };
}
