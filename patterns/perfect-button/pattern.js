// The perfect button: hover lift (+5% scale, deeper shadow, subtle glow), spring press feedback
// (0.95x on press, 1.05x bounce on release) and a ripple from the click point with a spring ease-out.

export const SPRING_EASE = 'cubic-bezier(.34,1.56,.64,1)'; // overshoots then settles: the "natural" curve
export const LINEAR_EASE = 'linear';                       // the "robotic" curve, for comparison

// Usage: PerfectButton(el, { hoverScale: 1.05, pressScale: .95, bounceScale: 1.05, ripple: true })
export function PerfectButton(el, opts = {}) {
  const o = { hoverScale: 1.05, pressScale: 0.95, bounceScale: 1.05, ripple: true, ...opts };
  el.classList.add('pb-btn--live');
  el.style.setProperty('--pb-hover', o.hoverScale); el.style.setProperty('--pb-press', o.pressScale); el.style.setProperty('--pb-bounce', o.bounceScale);
  let pressed = false;
  const press = () => { pressed = true; el.classList.add('is-pressed'); el.classList.remove('is-bouncing'); };
  const release = e => {
    if (!pressed) return; pressed = false;
    el.classList.remove('is-pressed'); el.classList.add('is-bouncing');            // 0.95x -> 1.05x -> 1x on the spring curve
    el.addEventListener('animationend', () => el.classList.remove('is-bouncing'), { once: true });
    if (o.ripple && e) ripple(el, e.clientX, e.clientY);
  };
  el.addEventListener('pointerdown', press);
  el.addEventListener('pointerup', release);
  el.addEventListener('pointerleave', () => { pressed = false; el.classList.remove('is-pressed'); });
  el.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') press(); });
  el.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') { const r = el.getBoundingClientRect(); release({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }); } });
  return { press, release: () => release(null), ripple: (x, y) => ripple(el, x, y) };
}

// Ripple: a circle that grows from the click point to cover the button and fades, eased with the spring curve.
export function ripple(el, clientX, clientY) {
  const r = el.getBoundingClientRect();
  const x = clientX == null ? r.width / 2 : clientX - r.left, y = clientY == null ? r.height / 2 : clientY - r.top;
  const size = Math.max(r.width, r.height) * 2.2;
  const s = document.createElement('span');
  s.className = 'pb-ripple'; s.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px`;
  el.appendChild(s); s.addEventListener('animationend', () => s.remove(), { once: true });
  return s;
}

// Demo helper: hover, press and release a button on a timer so the reel scenes play themselves.
export function autoplay(btn, api, { every = 2600, hold = 160 } = {}) {
  const tick = () => { btn.classList.add('is-hover'); setTimeout(() => { api.press(); setTimeout(() => { const r = btn.getBoundingClientRect(); btn.dispatchEvent(new PointerEvent('pointerup', { clientX: r.left + r.width * .62, clientY: r.top + r.height * .55, bubbles: true })); }, hold); }, 500); };
  tick(); return setInterval(tick, every);
}
