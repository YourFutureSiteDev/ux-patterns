// Disabled buttons: keep the submit live, validate on click, explain the blocker, and use a busy state
// (not `disabled`) while a request runs so focus and the user's place survive.

// ValidateOnClick(submitBtn, rules) — rules: [{ field, message, valid: () => boolean }]
// On click: every failing rule lights its field (.is-invalid + .db-msg--warn), focus moves to the first
// failing control, and 'db:blocked' fires with the list. When all pass, 'db:submit' fires instead.
export function ValidateOnClick(btn, rules, opts = {}) {
  const paint = (rule, ok) => {
    const input = rule.field.querySelector('.db-input'), label = rule.field.querySelector('.db-label'), msg = rule.field.querySelector('.db-msg');
    input.classList.toggle('is-invalid', !ok); input.classList.remove('is-focus');
    if (label) label.style.color = ok ? '' : 'var(--db-amber)';
    if (msg) { msg.className = 'db-msg ' + (ok ? (rule.fixed ? 'db-msg--ok' : '') : 'db-msg--warn'); msg.innerHTML = ok ? (rule.fixed ? `<svg class="db-ico" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>${rule.fixed}` : '') : `<svg class="db-ico" viewBox="0 0 24 24"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/></svg>${rule.message}`; }
    input.setAttribute('aria-invalid', String(!ok));
  };
  btn.removeAttribute('disabled'); // the whole point: the button stays reachable
  btn.addEventListener('click', e => {
    const failing = rules.filter(r => !r.valid());
    rules.forEach(r => paint(r, !failing.includes(r)));
    if (failing.length) {
      e.preventDefault();
      const first = failing[0].field.querySelector('.db-input, input, select, [tabindex]');
      first?.classList.add('is-focus'); first?.focus?.();
      btn.dispatchEvent(new CustomEvent('db:blocked', { detail: { blockers: failing.map(r => r.message) } }));
      opts.onBlocked?.(failing);
    } else {
      btn.dispatchEvent(new CustomEvent('db:submit'));
      opts.onSubmit?.();
    }
  });
  return { check: () => rules.filter(r => !r.valid()).length === 0, repaint: () => rules.forEach(r => paint(r, r.valid())) };
}

// BusyButton(btn, { label, done, request }) — while the request runs the button keeps focus, shows a
// spinner, and reports aria-busy="true"; it never sets `disabled`. Repeat clicks are ignored in flight.
export function BusyButton(btn, opts = {}) {
  const idle = btn.innerHTML; let inflight = false;
  btn.setAttribute('aria-busy', 'false');
  btn.addEventListener('click', async () => {
    if (inflight) return; inflight = true;
    btn.setAttribute('aria-busy', 'true'); btn.classList.add('is-busy');
    btn.innerHTML = `<span class="db-spin"></span>${opts.label ?? 'Working…'}`;
    btn.dispatchEvent(new CustomEvent('db:busy'));
    try {
      await (opts.request ? opts.request() : new Promise(r => setTimeout(r, 1200)));
      btn.innerHTML = `<svg class="db-ico" viewBox="0 0 24 24" style="stroke-width:2.5"><path d="M5 12l5 5L20 7"/></svg>${opts.done ?? 'Done'}`;
      btn.dispatchEvent(new CustomEvent('db:done'));
    } catch (err) {
      btn.innerHTML = idle; btn.dispatchEvent(new CustomEvent('db:failed', { detail: err }));
    } finally {
      btn.setAttribute('aria-busy', 'false'); btn.classList.remove('is-busy'); inflight = false;
      btn.focus({ preventScroll: true }); // keep the user's place
    }
  });
  return { reset: () => { btn.innerHTML = idle; btn.setAttribute('aria-busy', 'false'); } };
}

// Contrast ratio between two sRGB hex colours (WCAG 2.x). A disabled grey-on-grey label lands near 1.9:1.
export function contrastRatio(fg, bg) {
  const lum = hex => { const c = hex.replace('#', ''); const n = c.length === 3 ? c.split('').map(x => x + x).join('') : c; const [r, g, b] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * r + .7152 * g + .0722 * b; };
  const a = lum(fg), b = lum(bg); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
