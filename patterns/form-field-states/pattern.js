// Form Field States: one field, six explicit states (default, focus, error, success, disabled, loading).
// Usage: const f = FieldState(fieldEl); f.set('error', 'Email format is invalid — check the @ symbol');
export const STATES = ['default', 'focus', 'error', 'success', 'disabled', 'loading'];

const ICONS = {
  error: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.5M12 16.2h.01"/></svg>',
  success: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M8 12.2l2.8 2.8L16.5 9.3"/></svg>',
  loading: '<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-4.2-7.6"/></svg>'
};

export function FieldState(root) {
  const input = root.querySelector('.ffs-input');
  const icon = root.querySelector('.ffs-icon');
  const help = root.querySelector('.ffs-help');
  const restHelp = help ? help.innerHTML : '';
  const api = {
    get state() { return root.dataset.state || 'default'; },
    set(state, message) {
      if (!STATES.includes(state)) throw new Error(`unknown field state: ${state}`);
      root.dataset.state = state;
      if (icon) icon.innerHTML = ICONS[state] || '';
      if (help) help.innerHTML = (ICONS[state] && message ? ICONS[state] : '') + (message ?? restHelp);
      if (input) {
        input.disabled = state === 'disabled' || state === 'loading';
        input.setAttribute('aria-invalid', state === 'error');
        if (state === 'error' && help) { help.id ||= `${input.id || 'field'}-help`; input.setAttribute('aria-describedby', help.id); }
      }
      root.dispatchEvent(new CustomEvent('ffs:state', { detail: { state, message } }));
      return api;
    }
  };
  return api;
}

// EmailField: wires a real <input> to the six states. Focus -> 'focus'; blur -> validate ('error' or, if an
// async `check` is supplied, 'loading' then 'success'/'error'). 'disabled' is set by the caller via .set().
export function EmailField(root, opts = {}) {
  const field = FieldState(root);
  const input = root.querySelector('.ffs-input');
  const validate = opts.validate || (v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : 'Email format is invalid — check the @ symbol');
  let seq = 0;
  input.addEventListener('focus', () => { if (field.state !== 'loading') field.set('focus', opts.focusHelp ?? 'Tab to confirm'); });
  input.addEventListener('blur', async () => {
    const v = input.value.trim();
    if (!v) return field.set('default');
    const err = validate(v);
    if (err) return field.set('error', err);
    if (!opts.check) return field.set('success', opts.successHelp ?? 'Looks good');
    const my = ++seq; field.set('loading', opts.loadingHelp ?? 'Checking availability…');
    try { const ok = await opts.check(v); if (my !== seq) return; field.set(ok ? 'success' : 'error', ok ? (opts.successHelp ?? 'Email available') : (opts.takenHelp ?? 'That email is already taken')); }
    catch { if (my === seq) field.set('error', 'Could not check that address, try again'); }
  });
  // Once a field has errored, revalidate live so the error clears the moment it is fixed.
  input.addEventListener('input', () => { if (field.state === 'error' && !validate(input.value.trim())) field.set('focus', opts.focusHelp ?? 'Tab to confirm'); });
  return field;
}
