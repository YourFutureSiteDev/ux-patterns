// Form Validation Timing: validate on blur, escalate to live after the first error, confirm success too.
// Usage: ValidationField(fieldEl, { timing: 'blur-then-live', validate: v => errorMessage | null })
const ICON_ERR = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.5M12 16.2h.01"/></svg>';
const ICON_OK = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M8 12.2l2.8 2.8L16.5 9.3"/></svg>';
export const emailRule = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : 'Invalid email';

export function ValidationField(root, opts = {}) {
  const timing = opts.timing || 'blur-then-live';   // 'submit' | 'keystroke' | 'blur' | 'blur-then-live'
  const validate = opts.validate || emailRule;
  const input = root.querySelector('.fvt-input');
  const icon = root.querySelector('.fvt-icon');
  const help = root.querySelector('.fvt-help');
  let errored = false, checks = 0;

  const set = (state, message = '') => {
    root.classList.remove('is-focus', 'is-error', 'is-success');
    if (state) root.classList.add(`is-${state}`);
    if (icon) icon.innerHTML = state === 'error' ? ICON_ERR : state === 'success' ? ICON_OK : '';
    if (help) help.innerHTML = message ? (state === 'error' ? ICON_ERR : ICON_OK) + message : '';
    if (input) input.setAttribute('aria-invalid', state === 'error');
    root.dispatchEvent(new CustomEvent('fvt:state', { detail: { state, message, checks } }));
  };
  const check = () => {
    checks++;
    const v = input ? input.value.trim() : root.querySelector('.fvt-value')?.textContent.trim() || '';
    const err = validate(v);
    if (err) { errored = true; set('error', err); return false; }
    set('success', opts.successMessage ?? 'Looks good'); return true;
  };

  if (input) {
    input.addEventListener('focus', () => { if (!root.classList.contains('is-error') && !root.classList.contains('is-success')) set('focus'); });
    input.addEventListener('blur', () => { if (timing === 'blur' || timing === 'blur-then-live') check(); else if (!root.classList.contains('is-error') && !root.classList.contains('is-success')) set(null); });
    input.addEventListener('input', () => {
      if (timing === 'keystroke') check();                            // cruel: fires on every key
      else if (timing === 'blur-then-live' && errored) check();       // kind: live only once it has errored
    });
  }
  return { set, check, get checks() { return checks; }, get errored() { return errored; } };
}

// Submit-time validation for a whole form: every field checked at once (the "too late" mode).
export function validateOnSubmit(form, fields) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = fields.map(f => f.check()).every(Boolean);
    form.classList.toggle('is-submitted', !ok);
    form.dispatchEvent(new CustomEvent('fvt:submit', { detail: { ok } }));
  });
}

// Demo helper: type text into a .fvt-value span one character at a time.
export function typeInto(el, text, { interval = 120, onKey } = {}) {
  return new Promise(resolve => {
    let i = 0;
    const tick = () => { el.textContent = text.slice(0, ++i); onKey?.(i, el.textContent); if (i < text.length) setTimeout(tick, interval); else resolve(); };
    setTimeout(tick, interval);
  });
}
