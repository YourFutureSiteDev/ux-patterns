// Double submit guard: one intent, one request. Disable on the first tap, keep the spinner in place with the
// width locked, guard the handler (inFlight + idempotency key), resolve to a check or an error on the button,
// and re-enable on the response, never on a timer.

// Idempotency key: one per intent, reused for retries of the same intent.
export const newKey = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(16).slice(2)).replace(/-/g, '').slice(0, 24);

// Wraps a submit button. `request(key)` performs the network call and resolves on success, rejects on failure.
// Extra taps while a request is in flight are ignored (they never reach the server).
export function SubmitGuard(btn, { request, onSettled, errorLabel = 'Card declined', holdMs = 1600 } = {}) {
  let inFlight = false, key = null, ignored = 0;
  const label = btn.querySelector('.dsg-btn__label') || btn;
  const setState = s => { btn.dataset.state = s; btn.setAttribute('aria-busy', s === 'pending'); btn.dispatchEvent(new CustomEvent('dsg:state', { detail: { state: s, ignored } })); };
  btn.style.minWidth = btn.getBoundingClientRect().width + 'px';   // lock the width so the spinner never reflows the row
  btn.addEventListener('click', async e => {
    e.preventDefault();
    if (inFlight) { ignored++; btn.dispatchEvent(new CustomEvent('dsg:ignored', { detail: { ignored } })); return; }   // client guard
    inFlight = true; key = key || newKey(); setState('pending');
    try {
      const res = await request(key);                                // server dedups by Idempotency-Key
      key = null; setState('success');
      btn.dispatchEvent(new CustomEvent('dsg:success', { detail: res }));
    } catch (err) {
      setState('error');                                            // say why, right on the button
      const errEl = btn.querySelector('.dsg-err span'); if (errEl) errEl.textContent = err?.message || errorLabel;
      btn.dispatchEvent(new CustomEvent('dsg:error', { detail: err }));
    } finally {
      inFlight = false; onSettled?.();                              // re-enable on the response, not a timer
      setTimeout(() => { if (!inFlight) setState('idle'); }, holdMs); // hold the outcome long enough to read, then return to idle
    }
  });
  setState('idle');
  return { get inFlight() { return inFlight; }, get ignored() { return ignored; }, get key() { return key; } };
}

// Fetch helper that sends the key. Servers should store the key with the charge and return the same charge on a repeat.
export const payWithKey = (url, body, key) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify(body) }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); });

// Reference server-side dedup for the README (in memory; use your store in production).
export function idempotentHandler(charge) {
  const seen = new Map();
  return async (key, payload) => { if (seen.has(key)) return seen.get(key); const result = await charge(payload); seen.set(key, result); return result; };
}

// Demo network: slow 3G, resolves after `ms`; rejects when fail is true.
export const fakeRequest = (ms = 3400, fail = false) => () => new Promise((res, rej) => setTimeout(() => fail ? rej(new Error('Card declined')) : res({ ok: true }), ms));
