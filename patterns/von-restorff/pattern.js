// Von Restorff Effect: make exactly one item break the pattern and quiet everything else.
// The helpers below enforce the rule (one target per group) rather than just adding a class.

// Isolate one plan in a .vr-plans group: the target scales up, gets the badge and the gradient,
// every sibling goes quiet. Passing -1 (or nothing) resets the group to a uniform baseline.
// Usage: const plans = IsolatePlan(groupEl, { soft: false }); plans.target(1); plans.reset();
export function IsolatePlan(group, opts = {}) {
  const cards = [...group.querySelectorAll('.vr-plan')];
  const cls = opts.soft ? 'is-target--soft' : 'is-target';
  const target = i => cards.forEach((c, j) => { c.classList.toggle(cls, j === i); c.classList.toggle('is-target', j === i && !opts.soft); c.classList.toggle('is-quiet', i >= 0 && j !== i); });
  return { target, reset: () => target(-1), get index() { return cards.findIndex(c => c.classList.contains('is-target') || c.classList.contains('is-target--soft')); } };
}

// Reveal a word list one item at a time, then isolate one item (the odd one out) and dim the rest.
// Usage: RevealWords(listEl, { odd: 3, step: 250, hold: 400 })
export function RevealWords(list, opts = {}) {
  const items = [...list.children], step = opts.step ?? 250, odd = opts.odd ?? -1;
  items.forEach((li, i) => { li.style.opacity = 0; li.style.transition = 'opacity .35s ease, color .4s ease'; li.classList.remove('is-odd'); });
  items.forEach((li, i) => setTimeout(() => { li.style.opacity = 1; li.style.color = '#e6e6ea'; }, i * step));
  const at = items.length * step + (opts.hold ?? 400);
  const timer = setTimeout(() => items.forEach((li, i) => { li.style.color = ''; li.classList.toggle('is-odd', i === odd); }), at);
  return { cancel: () => clearTimeout(timer) };
}

// Promote one button in a container to the primary action; every other button drops to a quiet style.
// Works for nav CTAs (.vr-nav__cta) and form submits (.vr-form__submit).
// Usage: PrimaryAction(formEl, formEl.querySelector('.vr-form__submit'))
export function PrimaryAction(scope, btn) {
  scope.querySelectorAll('button').forEach(b => b.classList.toggle('is-primary', b === btn));
  return btn;
}

// Attention meter: a row of dim dots with one hot value, the on-screen stand-in for a heat map.
// Usage: AttentionMeter(el).set(80)
export function AttentionMeter(root) {
  const val = root.querySelector('b');
  return { set(pct) { val.textContent = `${Math.round(pct)}%`; root.style.setProperty('--vr-attn', pct / 100); } };
}
