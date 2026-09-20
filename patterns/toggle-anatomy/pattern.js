// Toggle Anatomy: a role="switch" that morphs (rail colour, knob slide, knob shadow, label) over 250ms,
// toggles on Space, exposes aria-checked, and for async settings flips optimistically with a spinner in the knob
// and rolls back (shake + 'tg:error' event) if the request fails.
// Usage: Toggle(buttonEl, { checked: false, request: v => fetch(...), onChange: v => {} })
export function Toggle(el, opts = {}) {
  let checked = opts.checked ?? el.getAttribute('aria-checked') === 'true', inflight = null;
  el.setAttribute('role', 'switch'); if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
  const render = () => { el.setAttribute('aria-checked', checked); };
  const flip = async () => {
    if (el.classList.contains('is-pending') && !opts.allowWhilePending) return;
    const prev = checked; checked = !checked; render();                 // 1. flip first
    opts.onChange?.(checked);
    if (!opts.request) return;
    el.classList.add('is-pending');                                        // 2. spinner in the knob
    const my = inflight = Promise.resolve().then(() => opts.request(checked));
    try { await my; if (inflight === my) { el.classList.remove('is-pending'); el.dispatchEvent(new CustomEvent('tg:saved', { detail: { checked } })); } }
    catch (err) {                                                          // 3. roll back if it fails
      if (inflight !== my) return;
      checked = prev; render(); el.classList.remove('is-pending'); el.classList.add('is-shake');
      el.addEventListener('animationend', () => el.classList.remove('is-shake'), { once: true });
      el.dispatchEvent(new CustomEvent('tg:error', { detail: { error: err, checked } }));
    }
  };
  el.addEventListener('click', flip);
  el.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } });
  render();
  return { flip, get checked() { return checked; }, set(v) { checked = !!v; render(); } };
}

// Snap control for the comparison: same markup, no transition (the .is-snap class zeroes every duration).
export function SnapToggle(el, opts = {}) { el.classList.add('is-snap'); return Toggle(el, opts); }

// Fake server for the demo: resolves after `latency` ms, or rejects with a 500 when fail is true.
export const fakeRequest = ({ latency = 1200, fail = false } = {}) => () => new Promise((res, rej) => setTimeout(() => fail ? rej(new Error('500 Internal Server Error')) : res(), latency));
