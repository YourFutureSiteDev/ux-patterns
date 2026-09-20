// Modal Backdrop and Depth: spring entrance/exit, blurred backdrop, micro-interactions.
// Everything here is time-based (seek(t)) so the stage can freeze a scene at any second.

// Damped spring from 0 to 1. zeta < 1 overshoots: 0.735 gives 3.3%, 0.33 gives 33%.
export function spring(t, { omega = 17.3, zeta = 0.735 } = {}) {
  if (t <= 0) return 0;
  if (zeta < 1) { const wd = omega * Math.sqrt(1 - zeta * zeta); return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + (zeta * omega / wd) * Math.sin(wd * t)); }
  return 1 - Math.exp(-omega * t) * (1 + omega * t);
}
const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const easeOut = x => 1 - Math.pow(1 - x, 3);

// Spring modal. open()/close() animate live; seek(t, phase) renders the state t seconds into that phase.
// Entrance: scale springs 0.90 -> 1 with a 33% overshoot (peaks at 1.033), opacity springs 0 -> 1 with 3%.
// Exit: scale eases 1 -> 0.95, opacity 1 -> 0 over 400 ms.
export function SpringModal(el, opts = {}) {
  const readout = opts.readout || null, closeMs = opts.closeMs ?? 400;
  let raf = 0, phase = 'closed';
  const body = el.querySelector('.mb-modal__body'), row = el.querySelector('.mb-modal__row'), clamp = x => Math.max(0, Math.min(1, x));
  const render = (scale, opacity, t = 9) => {
    el.style.transform = `scale(${scale})`; el.style.opacity = clamp(opacity);
    if (body) body.style.opacity = clamp((t - .3) / .3); if (row) row.style.opacity = clamp((t - .5) / .3); // content staggers in after the panel
    if (readout) readout.innerHTML = `scale(<b>${scale.toFixed(3)}</b>) <i>·</i> opacity(<b>${Math.max(0, opacity).toFixed(2)}</b>)`;
  };
  const seek = (t, ph = phase) => {
    phase = ph;
    if (ph === 'open') { const s = 0.9 + 0.1 * spring(t, { omega: 14, zeta: 0.33 }), o = spring(t, { omega: 17.3, zeta: 0.735 }); render(s, o, t); el.classList.toggle('is-open', t > 0); }
    else if (ph === 'close') { const k = easeInOut(Math.min(1, t / (closeMs / 1000))); render(1 - 0.05 * k, 1 - k); if (k >= 1) el.classList.remove('is-open'); }
    else render(0.95, 0, 0);
  };
  const play = ph => { cancelAnimationFrame(raf); const t0 = performance.now(); const tick = now => { const t = (now - t0) / 1000; seek(t, ph); if (t < (ph === 'open' ? 1.6 : closeMs / 1000)) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); };
  return { open: () => play('open'), close: () => play('close'), seek, get phase() { return phase; } };
}

// Blurred backdrop: animates backdrop-filter 0 -> 20px (ease-out) and prints the live value.
export function BlurBackdrop(el, opts = {}) {
  const readout = opts.readout || null, max = opts.max ?? 20, ms = opts.ms ?? 800;
  let raf = 0;
  const seek = t => { const px = Math.round(max * easeOut(Math.max(0, Math.min(1, t / (ms / 1000))))); el.style.backdropFilter = el.style.webkitBackdropFilter = `blur(${px}px)`; const k = Math.min(1, t / 0.9); el.style.background = `rgba(${Math.round(16 - 11 * k)},${Math.round(11 - 4 * k)},${Math.round(34 - 21 * k)},${(.4 + .22 * k).toFixed(2)})`; if (readout) readout.innerHTML = `backdrop-filter: blur(<b>${px}</b>px)`; };
  const play = () => { cancelAnimationFrame(raf); const t0 = performance.now(); const tick = now => { const t = (now - t0) / 1000; seek(t); if (t < ms / 1000) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); };
  return { seek, play };
}

// Micro-interactions: press bounce on any .mb-btn / .mb-close inside root (the hover states are CSS).
export function PressBounce(root) {
  root.addEventListener('pointerdown', e => { const b = e.target.closest('.mb-btn, .mb-close'); if (b) b.classList.add('is-pressed'); });
  const up = e => root.querySelectorAll('.is-pressed').forEach(b => b.classList.remove('is-pressed'));
  root.addEventListener('pointerup', up); root.addEventListener('pointerleave', up);
}

// Convenience: wire a full dialog (backdrop + modal + close/cancel) as one premium modal.
export function PremiumModal({ backdrop, modal, readout, blurReadout, openers = [], closers = [] }) {
  const m = SpringModal(modal, { readout }), b = BlurBackdrop(backdrop, { readout: blurReadout });
  PressBounce(modal);
  const open = () => { backdrop.hidden = false; b.play(); m.open(); };
  const close = () => { m.close(); backdrop.style.transition = 'opacity .4s'; backdrop.style.opacity = 0; setTimeout(() => { backdrop.hidden = true; backdrop.style.transition = ''; }, 400); };
  openers.forEach(o => o.addEventListener('click', open)); closers.forEach(c => c.addEventListener('click', close));
  return { open, close, modal: m, backdrop: b };
}
