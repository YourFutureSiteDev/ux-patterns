// Error states: same error, better recovery.
//   1. match the type to the surface   validation -> inline, network -> toast, server -> full surface, permission -> gated modal
//   2. always offer a way out          retry, escalate, explain
//   3. severity drives surface         inline (recoverable) < toast (transient) < modal (blocking)
//   4. write copy for humans           "Lost connection. Reconnecting in 4 seconds" not "Error 0x80004005"
//   5. prevent with live validation    check each rule as the user types

// Pick the surface for an error. Returns 'inline' | 'toast' | 'modal'.
export function surfaceFor(err) {
  const type = err.type ?? 'server';
  if (type === 'validation') return 'inline';
  if (type === 'network') return 'toast';
  return 'modal'; // server, permission: blocking, needs its own space and an exit
}

// Human copy for common failures. Every message says what broke, why, and what to do next.
export function humanize(err) {
  const map = {
    network: { title: 'Lost connection', body: 'Reconnecting in {n} seconds…', actions: ['retry'] },
    server: { title: 'Something broke on our end.', body: 'Network timed out after 30s.', actions: ['retry', 'support'] },
    permission: { title: "You don't have access.", body: 'Sign in with an account that has permission.', actions: ['signin'] },
    validation: { title: err.message ?? 'Check this field.', body: '', actions: [] },
  };
  return map[err.type] ?? map.server;
}

// Show an error on the right surface, with a way out. `host` receives inline/toast nodes; modals go on body.
// Usage: showError({ type: 'network' }, { host, onRetry, onSupport })
export function showError(err, opts = {}) {
  const copy = humanize(err), surface = surfaceFor(err);
  if (surface === 'inline') { const el = opts.field?.parentElement?.querySelector('.es-err') || document.createElement('div'); el.className = 'es-err'; el.textContent = copy.title; opts.field?.classList.add('is-bad'); opts.field?.insertAdjacentElement('afterend', el); return { surface, el }; }
  if (surface === 'toast') {
    const el = document.createElement('div'); el.className = 'es-ptoast'; el.innerHTML = `<b></b><span></span>`; el.querySelector('b').textContent = copy.title + '.'; el.querySelector('span').textContent = 'Reconnecting…';
    (opts.host ?? document.body).appendChild(el); setTimeout(() => el.remove(), opts.ttl ?? 4000); return { surface, el };
  }
  const el = document.createElement('div'); el.className = 'es-modal is-lit'; el.setAttribute('role', 'alertdialog');
  el.innerHTML = `<div class="es-card__title"></div><div class="es-card__actions"></div><div class="es-what"><small>What happened?</small><code></code></div>`;
  el.querySelector('.es-card__title').textContent = copy.title; el.querySelector('code').textContent = copy.body;
  const acts = el.querySelector('.es-card__actions');
  const btn = (label, cls, fn) => { const b = document.createElement('button'); b.className = 'es-btn ' + cls; b.textContent = label; b.addEventListener('click', () => { fn?.(); el.remove(); }); acts.appendChild(b); };
  if (copy.actions.includes('retry')) btn('Try again', 'es-btn--primary', opts.onRetry);
  if (copy.actions.includes('support')) btn('Contact support', '', opts.onSupport);
  if (copy.actions.includes('signin')) btn('Sign in', 'es-btn--primary', opts.onSignIn);
  (opts.host ?? document.body).appendChild(el); return { surface, el };
}

// Live validation: re-check every rule on input, tick .es-rule rows, enable submit when all pass.
// Usage: liveValidate(input, [{ el, test: v => v.length >= 8 }, ...], submitBtn)
export function liveValidate(input, rules, submit) {
  const run = () => { const v = input.value; let ok = true; rules.forEach(r => { const pass = !!r.test(v); r.el.classList.toggle('is-on', pass); ok = ok && pass; });
    input.classList.toggle('is-good', ok && v.length > 0); submit?.classList.toggle('is-disabled', !ok); if (submit) submit.disabled = !ok; return ok; };
  input.addEventListener('input', run); return run();
}

// Reconnect countdown for the network copy: "Reconnecting in N seconds…"
export function countdown(el, from = 5, onDone) {
  let n = from; const b = el.querySelector('b'); b.textContent = n;
  const iv = setInterval(() => { n -= 1; b.textContent = Math.max(0, n); if (n <= 0) { clearInterval(iv); onDone?.(); } }, 1000);
  return () => clearInterval(iv);
}
