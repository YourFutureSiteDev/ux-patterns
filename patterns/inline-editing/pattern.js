// Inline editing: click the text, it becomes an input in the same box; Enter commits, Escape cancels,
// blur follows one configured rule; saves are optimistic and roll back (keeping the draft) on failure.
// Usage: InlineEdit(el, { save: text => Promise, onBlur: 'commit' | 'cancel', onCommit, onRollback })
export function InlineEdit(el, opts = {}) {
  const onBlur = opts.onBlur || 'commit';
  const save = opts.save || (() => Promise.resolve());
  let value = el.textContent.trim(), draft = null, input = null;
  el.classList.add('ie-title'); el.tabIndex = 0; el.setAttribute('role', 'button');
  el.addEventListener('mouseenter', () => el.classList.add('is-hover'));
  el.addEventListener('mouseleave', () => el.classList.remove('is-hover'));
  el.addEventListener('click', open);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

  function open() {
    if (input) return;
    input = document.createElement('input');
    input.className = el.className + ' is-editing'; input.value = draft ?? value;
    // Same font, size, padding and box as the text: the swap must not move a pixel.
    const cs = getComputedStyle(el); input.style.font = cs.font; input.style.letterSpacing = cs.letterSpacing;
    el.replaceWith(input); input.focus(); input.select();
    input.addEventListener('keydown', e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); });
    input.addEventListener('blur', () => { if (input) (onBlur === 'commit' ? commit : cancel)(); });
  }
  function close(text) { const i = input; input = null; el.textContent = text; el.classList.remove('is-hover'); i.replaceWith(el); }
  function cancel() { close(value); el.dispatchEvent(new CustomEvent('ie:cancel')); }
  async function commit() {
    const next = input.value.trim(); const prev = value;
    if (next === prev || !next) return close(prev);
    value = next; draft = null; close(next);                 // 1. update on screen now
    el.dispatchEvent(new CustomEvent('ie:commit', { detail: { value: next } }));
    try { await save(next); el.dispatchEvent(new CustomEvent('ie:saved', { detail: { value: next } })); }
    catch (err) {                                            // 2. roll back, keep the draft, say why
      value = prev; draft = next; el.textContent = prev;
      el.dispatchEvent(new CustomEvent('ie:rollback', { detail: { value: prev, draft: next, error: err } }));
    }
  }
  return { get value() { return value; }, get draft() { return draft; }, open, commit, cancel };
}

// Cumulative layout shift meter: watches the element's box and reports any movement during the swap.
export function LayoutShiftMeter(target, out) {
  let last = target.getBoundingClientRect(), total = 0;
  const check = () => { const r = target.getBoundingClientRect(); total += Math.abs(r.top - last.top) + Math.abs(r.left - last.left) + Math.abs(r.height - last.height); last = r; if (out) out.textContent = (total / 1000).toFixed(3); };
  new MutationObserver(check).observe(target.parentNode, { childList: true, subtree: true, attributes: true });
  return { get shift() { return total; }, check };
}

// Optimistic save wrapper for a title with a status chip: shows "Updated on screen" immediately, then
// "Rolled back" plus a draft-kept toast if the request fails.
export function OptimisticTitle(editor, ui = {}) {
  const host = editor.value !== undefined ? null : editor;
  const target = host || document;
  const set = (chip, text) => { if (ui.chip) { ui.chip.className = 'ie-status' + (chip === 'ok' ? '' : ' ie-status--grey'); ui.chip.querySelector('span').textContent = text; } };
  target.addEventListener?.('ie:commit', () => { set('ok', 'Updated on screen'); ui.meta && (ui.meta.textContent = 'Edited just now by Sarah Chen'); ui.toast?.setAttribute('hidden', ''); });
  target.addEventListener?.('ie:rollback', e => { set('grey', 'Rolled back'); ui.meta && (ui.meta.textContent = 'Rolled back — server rejected the change'); if (ui.toast) { ui.toast.removeAttribute('hidden'); ui.toast.querySelector('.ie-toast__draft').textContent = 'draft: ' + e.detail.draft; } });
}

// Spreadsheet-style cell editing with an explicit blur rule (commit or discard).
export function CellEdit(cell, opts = {}) {
  const onBlur = opts.onBlur || 'cancel';
  cell.classList.add('ie-cell'); cell.tabIndex = 0;
  let value = cell.textContent.trim();
  cell.addEventListener('click', () => {
    if (cell.isContentEditable) return;
    cell.contentEditable = 'true'; cell.classList.add('is-editing'); cell.focus();
    const done = ok => { cell.contentEditable = 'false'; cell.classList.remove('is-editing'); if (ok) value = cell.textContent.trim(); else cell.textContent = value; cell.dispatchEvent(new CustomEvent(ok ? 'ie:commit' : 'ie:cancel', { detail: { value } })); };
    cell.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); done(true); } if (e.key === 'Escape') done(false); };
    cell.onblur = () => { if (cell.isContentEditable) done(onBlur === 'commit'); };
  });
  return { get value() { return value; } };
}
