// Skeleton Loading: show the shape of what is coming, shimmer in reading direction, swap to content when it lands.
// Usage: Skeleton(container, { load: () => Promise<html|Node>, minShow: 300, maxShow: 2000, direction: 'ltr' })
export function Skeleton(container, opts = {}) {
  const skeleton = container.querySelector('[data-skeleton]') || container.firstElementChild;
  const slot = container.querySelector('[data-content]') || document.createElement('div');
  if (!slot.parentNode) { slot.dataset.content = ''; container.appendChild(slot); }
  slot.hidden = true;
  const minShow = opts.minShow ?? 300;          // under ~300 ms a skeleton is a flash of noise, so hold it at least this long
  const maxShow = opts.maxShow ?? 2000;         // past ~2 s show partial content rather than more bones
  const dir = opts.direction || (getComputedStyle(container).direction === 'rtl' ? 'rtl' : 'ltr');
  Shimmer(skeleton, dir);
  const started = performance.now();
  let settled = false;
  const reveal = (content) => {
    if (settled) return; settled = true;
    if (typeof content === 'string') slot.innerHTML = content; else if (content) slot.replaceChildren(content);
    // Crossfade: bones fade under the real content so nothing jumps.
    skeleton.style.transition = 'opacity .35s ease'; skeleton.style.opacity = '0';
    slot.hidden = false; slot.style.opacity = '0'; slot.style.transition = 'opacity .35s ease';
    requestAnimationFrame(() => { slot.style.opacity = '1'; });
    setTimeout(() => { skeleton.hidden = true; container.dispatchEvent(new CustomEvent('sk:loaded', { detail: { ms: performance.now() - started } })); }, 380);
  };
  const partial = setTimeout(() => container.dispatchEvent(new CustomEvent('sk:slow', { detail: { ms: maxShow } })), maxShow);
  Promise.resolve(opts.load ? opts.load() : null).then(content => {
    clearTimeout(partial);
    const wait = Math.max(0, minShow - (performance.now() - started));
    setTimeout(() => reveal(content), wait);
  }).catch(err => { clearTimeout(partial); container.dispatchEvent(new CustomEvent('sk:error', { detail: err })); });
  return { reveal, get elapsed() { return performance.now() - started; } };
}

// Shimmer direction: the sweep must follow the reading flow (left→right for LTR, right→left for RTL).
export function Shimmer(el, direction = 'ltr') {
  if (!el) return;
  el.querySelectorAll('.sk-bone, .sk-sweep').forEach(b => b.classList.toggle('is-reversed', direction === 'rtl'));
  el.classList.toggle('is-reversed', direction === 'rtl');
}

// Build a skeleton that mirrors a content template: one bone per element that has data-bone="circle|line|block",
// sized from the template's own boxes so the layout never jumps on load.
export function skeletonFrom(template) {
  const root = document.createElement('div'); root.dataset.skeleton = ''; root.style.position = 'relative';
  const base = template.getBoundingClientRect();
  root.style.width = base.width + 'px'; root.style.height = base.height + 'px';
  template.querySelectorAll('[data-bone]').forEach(el => {
    const r = el.getBoundingClientRect(), b = document.createElement('div');
    b.className = 'sk-bone' + (el.dataset.bone === 'circle' ? ' sk-bone--circle' : el.dataset.bone === 'block' ? ' sk-bone--block' : '');
    Object.assign(b.style, { left: r.left - base.left + 'px', top: r.top - base.top + 'px', width: r.width + 'px', height: (el.dataset.bone === 'line' ? Math.min(r.height, 10) : r.height) + 'px' });
    root.appendChild(b);
  });
  return root;
}

// Perceived-time meter: how long the wait *felt*. A skeleton halves the perceived time in the reel (2.4 s → 1.2 s).
export function PerceivedTimer(root, { actual = 2000, factor = 1 } = {}) {
  const bar = root.querySelector('i'), label = root.querySelector('span') || root;
  const perceived = actual * factor;
  root.style.setProperty('--fill', Math.min(100, perceived / 4000 * 100) + '%');
  if (label !== root) label.textContent = `Perceived: ${(perceived / 1000).toFixed(1)}s`;
  return perceived;
}

// Optimistic toggle for the actions the user just performed: render the result now, reconcile after, roll back on failure.
export function OptimisticToggle(btn, countEl, { request, latency = 200 } = {}) {
  const send = request || (() => new Promise(r => setTimeout(r, latency)));
  let on = btn.classList.contains('is-liked'), count = Number(countEl.textContent) || 0;
  const render = () => { btn.classList.toggle('is-liked', on); countEl.textContent = count; };
  btn.addEventListener('click', async () => {
    const prev = { on, count };
    on = !on; count += on ? 1 : -1; render();
    try { await send(on); btn.dispatchEvent(new CustomEvent('sk:confirmed')); }
    catch { on = prev.on; count = prev.count; render(); btn.dispatchEvent(new CustomEvent('sk:rolledback')); }
  });
  render();
}
