// Rounded Shapes: the amygdala reads sharp corners as threat and rounded ones as safe, so UI went round.
// morphRadius(el, from, to, ms): animate a corner radius (the 2010 square button becoming the 2024 pill).
export function morphRadius(el, from = 0, to = 12, ms = 600) {
  const anim = el.animate([{ borderRadius: `${from}px` }, { borderRadius: `${to}px` }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
  anim.finished.then(() => { el.style.borderRadius = `${to}px`; anim.cancel(); }).catch(() => {});
  return anim;
}

// SafeToggle(input): a rounded switch that flips on click/keyboard and reports its state (event 'rs:change').
export function SafeToggle(input) {
  const emit = () => input.dispatchEvent(new CustomEvent('rs:change', { bubbles: true, detail: { on: input.checked } }));
  input.addEventListener('change', emit);
  return { get on() { return input.checked; }, set on(v) { input.checked = !!v; emit(); } };
}

// staggerIn(root, selector, gap): pop children in one after another (the threat labels circling the brain).
export function staggerIn(root, selector = ':scope > *', gap = 120) {
  root.querySelectorAll(selector).forEach((el, i) => el.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: i * gap, easing: 'cubic-bezier(.2,.9,.3,1.2)', fill: 'both' }));
}
