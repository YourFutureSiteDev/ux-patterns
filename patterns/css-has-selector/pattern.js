// CSS :has(): the parent selector. The five rules live in pattern.css; this module is the small amount of JS
// a real page still needs: a feature check, a class-mirroring fallback for browsers without :has(), and dialog wiring.
// Usage: if (!supportsHas()) mirrorHasState(formEl); wireDialogs(document);

// True when the engine understands :has() (Chrome 105, Safari 15.4, Firefox 121, Edge 105).
export function supportsHas() {
  try { return CSS.supports('selector(:has(*))'); } catch { return false; }
}

// Fallback for engines without :has(): mirror the DOM state the selectors read into classes the same rules match.
//   .hs-plan:has(:checked)        -> .hs-plan.is-checked
//   .hs-field:has(:user-invalid)  -> .hs-field.is-invalid (after the user has touched the field)
//   form:has(:user-invalid)       -> form.is-invalid
export function mirrorHasState(form) {
  const sync = () => {
    form.querySelectorAll('.hs-plan').forEach(p => p.classList.toggle('is-checked', !!p.querySelector('input:checked')));
    let invalid = false;
    form.querySelectorAll('.hs-field').forEach(f => {
      const input = f.querySelector('input'); if (!input) return;
      const bad = input.dataset.touched === '1' && !input.checkValidity();
      f.classList.toggle('is-invalid', bad); invalid = invalid || bad;
    });
    form.classList.toggle('is-invalid', invalid);
  };
  form.addEventListener('change', sync);
  form.addEventListener('input', sync);
  form.addEventListener('focusout', e => { if (e.target.matches('input')) { e.target.dataset.touched = '1'; sync(); } });
  sync();
  return sync;
}

// Quantity query fallback: sets data-count on a grid so `[data-count="5"]` can stand in for :has(> :nth-child(n+5)).
export function countChildren(grid) {
  const set = () => grid.dataset.count = grid.children.length;
  new MutationObserver(set).observe(grid, { childList: true }); set();
}

// Dialog wiring. Opening is `dialog.showModal()` or `dialog.open = true`; body:has(dialog[open]) does the scroll lock and dim,
// so closing needs no cleanup effect. Buttons with [data-close] close their dialog; Escape is native.
export function wireDialogs(root = document) {
  root.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog')?.close()));
  root.querySelectorAll('[data-open-dialog]').forEach(b => b.addEventListener('click', () => { const d = root.querySelector(b.dataset.openDialog); if (d) d.open = true; }));
}

// Convenience: toggle an <aside> in an .hs-app; the grid column follows from .hs-app:has(aside).
export function toggleAside(app, asideEl) {
  const cur = app.querySelector('aside');
  if (cur) cur.remove(); else app.prepend(asideEl);
  return !!app.querySelector('aside');
}
