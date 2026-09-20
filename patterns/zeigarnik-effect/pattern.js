// Zeigarnik Effect: the mind keeps unfinished tasks in active memory and drops finished ones. Leave a visible gap,
// tie it to an outcome the user wants, keep the remaining percentage salient, and bring them back.
// Exports: OpenLoop, Checklist, RecallCounter, isOutcome.

// 1. Open-loop meter: renders completion as a bar + percentage and keeps the gap salient (never rounds up to 100).
// Usage: OpenLoop(rootEl, { done: 4, total: 5, onPull: (remaining) => showNudge(remaining) })
export function OpenLoop(root, { done = 0, total = 1, onPull, threshold = 0.5 } = {}) {
  const bar = root.querySelector('.zg-bar__fill'), pct = root.querySelector('[data-pct]'), sub = root.querySelector('[data-sub]');
  const state = { done, total };
  const render = () => {
    const p = Math.min(99, Math.round(state.done / state.total * 100));                 // the loop stays open until it is really closed
    bar?.style.setProperty('--p', (state.done >= state.total ? 100 : p) + '%');
    if (pct) pct.innerHTML = state.done >= state.total ? '100<small>%</small>' : `${p}<small>%</small>`;
    if (sub) sub.textContent = state.done >= state.total ? 'Loop closed' : `${state.total - state.done} left`;
    root.classList.toggle('is-open', state.done < state.total);
    root.classList.toggle('zg-pulse', state.done < state.total && state.done / state.total >= threshold);   // 80% pulls harder than 10%
    if (state.done < state.total && state.done / state.total >= threshold) onPull?.(state.total - state.done);
    return p;
  };
  render();
  return { complete(n = 1) { state.done = Math.min(state.total, state.done + n); return render(); }, set(d, t = state.total) { state.done = d; state.total = t; return render(); }, get open() { return state.done < state.total; } };
}

// 2. Checklist: marks items done, leaves the remaining ones visibly open, and reports the gap to an OpenLoop.
// Usage: Checklist(listEl, { loop })  where items are .zg-check elements; .is-open marks the unchecked ones.
export function Checklist(list, { loop } = {}) {
  const items = [...list.querySelectorAll('.zg-check')];
  const sync = () => { const done = items.filter(i => !i.classList.contains('is-open')).length; loop?.set(done, items.length); list.dispatchEvent(new CustomEvent('zg:progress', { detail: { done, total: items.length } })); };
  items.forEach(i => i.addEventListener('click', () => { i.classList.toggle('is-open'); sync(); }));
  sync();
  return { sync, get remaining() { return items.filter(i => i.classList.contains('is-open')).map(i => i.textContent.trim()); } };
}

// 3. Recall counter: how often an item resurfaces. Incomplete items are recalled; completed ones drop to zero.
export function RecallCounter(el, { every = 300, max = 11, incomplete = true } = {}) {
  const num = el.querySelector('b') || el; let n = 0, iv;
  const tick = () => { n = Math.min(max, n + 1); num.textContent = n; if (n >= max) clearInterval(iv); };
  if (incomplete) iv = setInterval(tick, every); else num.textContent = 0;
  return { stop: () => clearInterval(iv), get count() { return n; }, set(v) { n = v; num.textContent = v; } };
}

// 4. The catch: the effect only fires for outcomes the user wants. A reading bar on a marketing email is a chore.
export function isOutcome({ userInitiated = false, reward = null } = {}) { return Boolean(userInitiated && reward); }
