// Animation Timing: the five numbers, as Web Animations helpers.
//   entrance 200-300ms ease-out · exit ~40% faster · feedback <100ms · attention 500-800ms + bounce · stagger 50ms

export const TIMING = {
  entrance: 250, exit: 150, feedback: 80, attention: 650, stagger: 50,
  easeOut: 'cubic-bezier(.16,1,.3,1)', spring: 'cubic-bezier(.34,1.56,.64,1)', linear: 'linear',
};

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const run = (el, frames, opts) => { const a = el.animate(frames, reduced() ? { ...opts, duration: 1 } : opts); return a.finished; };

// Entrance: fade + rise + slight scale, decelerating into place. 200-300ms is the sweet spot.
export function enter(el, { duration = TIMING.entrance, easing = TIMING.easeOut, y = 14 } = {}) {
  el.hidden = false;
  return run(el, [{ opacity: 0, transform: `translateY(${y}px) scale(.94)` }, { opacity: 1, transform: 'none' }], { duration, easing, fill: 'both' });
}

// Exit: roughly 40% faster than the matching entrance. The user already decided.
export function exit(el, { duration = TIMING.exit, easing = 'ease-in', y = 8 } = {}) {
  return run(el, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${y}px) scale(.97)` }], { duration, easing, fill: 'both' }).then(() => { el.hidden = true; });
}

// Feedback: press response under 100ms. Wire it to pointerdown, not click, so it fires before the action.
export function pressFeedback(btn, { duration = TIMING.feedback, scale = .94 } = {}) {
  const down = () => run(btn, [{ transform: 'none', filter: 'none' }, { transform: `scale(${scale})`, filter: 'brightness(1.2)' }], { duration, easing: 'ease-out', fill: 'forwards' });
  const up = () => run(btn, [{ transform: `scale(${scale})`, filter: 'brightness(1.2)' }, { transform: 'none', filter: 'none' }], { duration: duration * 1.5, easing: TIMING.easeOut, fill: 'forwards' });
  btn.addEventListener('pointerdown', down); btn.addEventListener('pointerup', up); btn.addEventListener('pointerleave', up);
  return () => { btn.removeEventListener('pointerdown', down); btn.removeEventListener('pointerup', up); btn.removeEventListener('pointerleave', up); };
}

// Attention: 500-800ms with a bounce and a shake. Reserve it for errors and alerts.
export function attention(el, { duration = TIMING.attention } = {}) {
  el.hidden = false;
  return run(el, [
    { opacity: 0, transform: 'translateY(-40px) scale(.9)', offset: 0 },
    { opacity: 1, transform: 'translateY(6px) scale(1.03)', offset: .34 },
    { transform: 'translateX(-7px)', offset: .5 }, { transform: 'translateX(6px)', offset: .64 },
    { transform: 'translateX(-4px)', offset: .78 }, { transform: 'translateX(2px)', offset: .9 },
    { transform: 'none', offset: 1 },
  ], { duration, easing: 'ease-out', fill: 'both' });
}

// Stagger: entrance per item, 50ms apart. 30ms blurs into one blob, 100ms crawls.
export function stagger(items, { gap = TIMING.stagger, duration = TIMING.entrance } = {}) {
  return Promise.all([...items].map((el, i) => run(el, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration, delay: i * gap, easing: TIMING.easeOut, fill: 'both' })));
}

// Toggle helper: enter on open, exit (faster) on close, with the two durations paired.
export function toggle(el, open, opts = {}) { return open ? enter(el, { duration: opts.enter ?? TIMING.entrance }) : exit(el, { duration: opts.exit ?? Math.round((opts.enter ?? TIMING.entrance) * .6) }); }
