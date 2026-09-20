// Doherty threshold: respond within 400 ms or the user disconnects. The real work can take longer,
// as long as the interface reacts inside the threshold: skeleton, optimistic update, progress.

// Zone for a response time: instant under 200 ms, tolerable to 400 ms, broken past it.
export const zone = ms => ms < 200 ? 'instant' : ms < 400 ? 'tolerable' : 'disconnect';

// Response timer: counts real elapsed ms into a .dt-counter and colours it by zone.
// Usage: const t = ResponseTimer(el); t.start(); ... t.stop()
export function ResponseTimer(el, opts = {}) {
  const num = el.querySelector('b'); let t0 = 0, raf = 0, cap = opts.cap ?? 400;
  const render = ms => { num.textContent = Math.round(ms); const z = zone(ms); el.classList.toggle('is-warm', z === 'tolerable'); el.classList.toggle('is-hot', z === 'disconnect'); el.classList.toggle('is-big', ms >= cap); };
  const tick = () => { const ms = Math.min(cap, performance.now() - t0); render(ms); if (ms < cap) raf = requestAnimationFrame(tick); else el.dispatchEvent(new CustomEvent('dt:disconnect')); };
  return { start() { t0 = performance.now(); cancelAnimationFrame(raf); tick(); }, stop() { cancelAnimationFrame(raf); }, set: render };
}

// Skeleton: show placeholder shapes instantly, swap for content when the promise resolves.
// Usage: skeleton(container, fetchContent) where container holds .dt-feed--skel and .dt-feed--live
export async function skeleton(container, load) {
  const skel = container.querySelector('.dt-feed--skel'), live = container.querySelector('.dt-feed--live');
  skel.hidden = false; live.classList.remove('is-on');
  await load();
  live.classList.add('is-on'); skel.hidden = true;
}

// Optimistic toggle: flip the UI now, confirm with the server in the background, revert on failure.
export function optimistic(el, request, opts = {}) {
  el.classList.toggle('is-on'); el.dispatchEvent(new CustomEvent('dt:rendered'));
  return Promise.resolve().then(request).then(() => el.dispatchEvent(new CustomEvent('dt:confirmed')))
    .catch(() => { el.classList.toggle('is-on'); el.dispatchEvent(new CustomEvent('dt:reverted')); if (opts.rethrow) throw new Error('reverted'); });
}

// Progress: drive a .dt-up block (title, bar, percent, steps) from 0..100.
export function Progress(root, opts = {}) {
  const title = root.querySelector('.dt-up__title'), bar = root.querySelector('.dt-up__bar i'), pct = root.querySelector('.dt-up__pct'), steps = [...root.querySelectorAll('.dt-up__steps span')];
  const labels = opts.labels ?? { busy: 'Uploading...', done: 'Complete!' };
  return { set(p) { p = Math.max(0, Math.min(100, p)); bar.style.width = p + '%'; pct.textContent = Math.round(p) + '%'; title.textContent = p >= 100 ? labels.done : labels.busy; root.classList.toggle('is-done', p >= 100);
    steps.forEach((s, i) => s.classList.toggle('is-on', p >= (i / steps.length) * 100 + (i === 0 ? 0 : 0.01) && (i < steps.length - 1 || p >= 100))); } };
}
