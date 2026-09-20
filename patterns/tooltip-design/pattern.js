// Tooltip: 300ms hover delay, arrow toward the trigger, flips near viewport edges,
// dismisses on mouse leave / Escape / blur / outside tap, and caps its width at 300px.
// Usage: Tooltip(triggerEl, { text: 'Settings', placement: 'top', delay: 300, maxWidth: 300, container })

export function Tooltip(trigger, opts = {}) {
  const delay = opts.delay ?? 300, placement = opts.placement ?? 'top', gap = opts.gap ?? 8, maxWidth = opts.maxWidth ?? 300;
  const bounds = opts.container || document.documentElement;
  const tip = document.createElement('div');
  tip.className = 'tt-tip tt-tip--arrow' + (opts.className ? ' ' + opts.className : '');
  tip.setAttribute('role', 'tooltip'); tip.id = opts.id || `tt-${Math.random().toString(36).slice(2, 8)}`;
  tip.style.maxWidth = `${maxWidth}px`; tip.textContent = opts.text ?? trigger.getAttribute('aria-label') ?? '';
  (opts.container || document.body).appendChild(tip);
  trigger.setAttribute('aria-describedby', tip.id);
  let timer = null, open = false;

  // Place on the requested side; flip to the opposite side if that would leave the container.
  const place = () => {
    const t = trigger.getBoundingClientRect(), b = bounds.getBoundingClientRect(), r = tip.getBoundingClientRect();
    const rel = (opts.container || document.body).getBoundingClientRect();
    let side = placement;
    const fits = { top: t.top - r.height - gap >= b.top, bottom: t.bottom + r.height + gap <= b.bottom, left: t.left - r.width - gap >= b.left, right: t.right + r.width + gap <= b.right };
    const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
    if (!fits[side] && fits[opposite[side]]) side = opposite[side];
    let x, y;
    if (side === 'top') { x = t.left + t.width / 2 - r.width / 2; y = t.top - r.height - gap; }
    if (side === 'bottom') { x = t.left + t.width / 2 - r.width / 2; y = t.bottom + gap; }
    if (side === 'left') { x = t.left - r.width - gap; y = t.top + t.height / 2 - r.height / 2; }
    if (side === 'right') { x = t.right + gap; y = t.top + t.height / 2 - r.height / 2; }
    x = Math.max(b.left + 8, Math.min(x, b.right - r.width - 8)); // shift along the edge as a last resort
    tip.style.left = `${x - rel.left}px`; tip.style.top = `${y - rel.top}px`;
    tip.classList.remove('tt-tip--top', 'tt-tip--bottom', 'tt-tip--left', 'tt-tip--right'); tip.classList.add(`tt-tip--${side}`);
    tip.dataset.flipped = side !== placement ? 'true' : 'false';
    return side;
  };
  const show = () => { if (open) return; open = true; place(); tip.classList.add('is-open'); trigger.dispatchEvent(new CustomEvent('tt:open', { detail: { side: tip.dataset.flipped } })); };
  const hide = reason => { clearTimeout(timer); timer = null; if (!open) return; open = false; tip.classList.remove('is-open'); trigger.dispatchEvent(new CustomEvent('tt:close', { detail: { reason } })); };
  const arm = () => { if (open || timer) return; timer = setTimeout(() => { timer = null; show(); }, delay); };
  const disarm = () => { clearTimeout(timer); timer = null; };

  trigger.addEventListener('pointerenter', arm);
  trigger.addEventListener('pointerleave', () => { disarm(); hide('mouseleave'); });      // 1. mouse leave
  trigger.addEventListener('focus', () => { show(); });                                    // keyboard focus shows at once
  trigger.addEventListener('blur', () => hide('blur'));                                    // 3. focus out
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide('escape'); });  // 2. escape key
  document.addEventListener('pointerdown', e => { if (!trigger.contains(e.target) && !tip.contains(e.target)) hide('outside'); }); // 4. tap outside
  return { show, hide, place, el: tip, get open() { return open; } };
}

// The "cheap" control: fires on every graze (no delay, no arrow, no dismissal routes).
export function CheapTooltip(trigger, opts = {}) { return Tooltip(trigger, { ...opts, delay: 0, className: (opts.className || '') + ' tt-tip--danger' }); }
