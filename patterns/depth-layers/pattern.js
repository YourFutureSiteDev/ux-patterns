// Depth Layers: three properties turn flat cards into depth. Layered shadows, parallax scroll, z-translation on hover.

// Layer 1 · layered shadows. Three stacked shadows: tight (2px), spread (12px), ambient (32px).
export const LAYERED_SHADOW = '0 2px 2px rgba(0,0,0,.45), 0 6px 12px rgba(0,0,0,.5), 0 16px 32px rgba(0,0,0,.6)';
export function layeredShadow(el, { tight = 2, spread = 12, ambient = 32 } = {}) {
  el.style.boxShadow = `0 ${tight}px ${tight}px rgba(0,0,0,.45), 0 ${spread / 2}px ${spread}px rgba(0,0,0,.5), 0 ${ambient / 2}px ${ambient}px rgba(0,0,0,.6)`;
}

// Layer 2 · parallax. Every [data-speed] child of root moves at speed x the scroll offset.
// Parallax(root).scrollTo(px) positions the layers; Parallax(root).play(pxPerSecond) drives them from a clock.
// The demo drives the same layers with CSS keyframes so ?t= can freeze them; this is the runtime version.
export function Parallax(root, { layers = '[data-speed]' } = {}) {
  const els = [...root.querySelectorAll(layers)];
  let raf = 0, y = 0;
  const scrollTo = px => { y = px; els.forEach(el => { el.style.transform = `translateY(${-px * Number(el.dataset.speed || 1)}px)`; }); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const play = (pxPerSecond = 21) => { stop(); let last = performance.now(); const tick = now => { scrollTo(y + (now - last) / 1000 * pxPerSecond); last = now; raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); };
  return { scrollTo, play, stop, get y() { return y; } };
}

// Layer 3 · z-translation on hover. Lifts the hovered card toward the viewer: translateZ(20px) scale(1.03),
// brighter border, stronger shadow. Siblings stay put. hover(i) forces a card (used by the demo's cursor).
export function ZLift(root, { card = '.dl-card', z = 20, scale = 1.03, lift = 10, perspective = 1600 } = {}) {
  const cards = [...root.querySelectorAll(card)];
  const raise = el => { el.style.transform = `perspective(${perspective}px) translateY(${-lift}px) translateZ(${z}px) scale(${scale})`; el.classList.add('is-lifted'); };
  const drop = el => { el.style.transform = ''; el.classList.remove('is-lifted'); };
  cards.forEach(el => { el.addEventListener('pointerenter', () => raise(el)); el.addEventListener('pointerleave', () => drop(el)); });
  return { hover(i) { cards.forEach((el, k) => k === i ? raise(el) : drop(el)); }, clear() { cards.forEach(drop); }, cards };
}
