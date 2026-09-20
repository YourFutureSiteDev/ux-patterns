// Behind the Button: the six-step round trip a checkout makes before the spinner stops.
// validate (client) -> request -> server checks -> business logic -> transaction write -> respond with server truth.
// Usage: const trip = RoundTrip(stepBarEl); trip.run({ validate, request, ... }) lights each step as its promise settles.
export const STEPS = ['validate', 'request', 'server', 'logic', 'write', 'respond'];

export function RoundTrip(bar, opts = {}) {
  const chips = [...bar.querySelectorAll('.bb-step')];
  const light = n => chips.forEach((c, i) => c.classList.toggle('is-on', i < n));
  return {
    light,
    reset: () => light(0),
    // Runs the six phases in order. Each phase is a function returning a value or promise; the step lights when it resolves.
    async run(phases = {}) {
      light(0);
      let ctx = {};
      for (let i = 0; i < STEPS.length; i++) {
        const fn = phases[STEPS[i]] || (() => new Promise(r => setTimeout(r, opts.stepDelay ?? 500)));
        ctx = (await fn(ctx)) ?? ctx; light(i + 1);
        bar.dispatchEvent(new CustomEvent('bb:step', { detail: { step: STEPS[i], index: i, ctx } }));
      }
      return ctx;
    }
  };
}

// Client-side validation: instant, zero network calls. Returns { ok, errors } and toggles .is-ok on each field.
export function validateForm(form) {
  const rules = { email: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), card: v => v.replace(/\s/g, '').length === 16, zip: v => /^\d{5}$/.test(v) };
  const errors = {};
  form.querySelectorAll('[data-field]').forEach(f => { const k = f.dataset.field, ok = (rules[k] || (() => true))(f.dataset.value ?? f.querySelector('b')?.textContent ?? ''); f.classList.toggle('is-ok', ok); if (!ok) errors[k] = true; });
  return { ok: Object.keys(errors).length === 0, errors };
}

// Server side, re-run stricter: never trust the client's total. Recompute from the catalog.
export function recomputeTotal(items, catalog) {
  return items.reduce((sum, it) => sum + (catalog[it.sku]?.price ?? 0) * (it.qty ?? 1), 0);
}

// Transaction: run every write; if any throws, roll back all of them. All of it, or none of it.
export async function transaction(writes) {
  const done = [];
  try { for (const w of writes) { done.push(await w.apply()); } return { committed: true, rows: done }; }
  catch (err) { for (const w of writes.slice(0, done.length).reverse()) await w.rollback?.(); return { committed: false, error: err }; }
}

// Optimistic like: repaint now, reconcile later. Pessimistic buy: hold the spinner until the server answers.
export function OptimisticLike(btn, countEl, opts = {}) {
  let liked = false, count = Number(countEl.textContent) || 0;
  btn.addEventListener('click', async () => {
    const prev = [liked, count]; liked = !liked; count += liked ? 1 : -1; paint();
    try { await (opts.request?.(liked) ?? Promise.resolve()); btn.dispatchEvent(new CustomEvent('bb:confirmed')); }
    catch { [liked, count] = prev; paint(); }
  });
  const paint = () => { countEl.textContent = count; btn.classList.toggle('is-liked', liked); };
  return { get liked() { return liked; } };
}
export function PessimisticBuy(btn, opts = {}) {
  btn.addEventListener('click', async () => {
    if (btn.classList.contains('is-pending')) return;
    btn.classList.add('is-pending'); btn.dispatchEvent(new CustomEvent('bb:pending'));
    try { const res = await (opts.request?.() ?? new Promise(r => setTimeout(() => r({ order_id: '#4127' }), 1800))); btn.classList.remove('is-pending'); btn.classList.add('is-done'); btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>Order confirmed'; btn.dispatchEvent(new CustomEvent('bb:confirmed', { detail: res })); }
    catch (err) { btn.classList.remove('is-pending'); btn.dispatchEvent(new CustomEvent('bb:failed', { detail: err })); }
  });
}
