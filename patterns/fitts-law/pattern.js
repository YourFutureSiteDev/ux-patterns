// Fitts's Law: T = a + b * log2(D / W + 1). Time to reach a target grows with distance and shrinks with size.
// The demo's numbers (9.6s far+small, 5.4s far+big, 3.3s close+big, 3.0s closer) come from a = 0.6, b = 2.2 on the track's px values.
export function fittsTime(D, W, a = 0.6, b = 2.2) {
  return a + b * Math.log2(D / Math.max(1, W) + 1);
}

// Live track: drag the target to change D, drag its right edge to change W; the readout and the D/W markers follow.
// Usage: FittsTrack(rootEl, { timeEl, onChange })  rootEl = .fl-track with .fl-target, .fl-track__d, .fl-track__dl, .fl-track__wline, .fl-track__wl, .fl-track__cursor
export function FittsTrack(root, opts = {}) {
  const target = root.querySelector('.fl-target'), d = root.querySelector('.fl-track__d'), dl = root.querySelector('.fl-track__dl');
  const wline = root.querySelector('.fl-track__wline'), wl = root.querySelector('.fl-track__wl'), cursor = root.querySelector('.fl-track__cursor');
  if (!target) return null;
  const start = () => (parseFloat(cursor?.style.left) || 0) + 12;     // the cursor tip on the line
  const layout = () => {
    const left = parseFloat(target.style.left), width = target.offsetWidth, D = left + width / 2 - start();
    d.style.left = `${start()}px`; d.style.width = `${Math.max(0, left - start())}px`;
    dl.style.left = `${start() + (left - start()) / 2 - 5}px`;
    wline.style.left = wl.style.left = `${left}px`; wline.style.width = wl.style.width = `${width}px`;
    const t = fittsTime(D, width);
    if (opts.timeEl) opts.timeEl.textContent = `${t.toFixed(1)}s`;
    opts.onChange?.({ D, W: width, T: t });
    root.dispatchEvent(new CustomEvent('fl:change', { detail: { D, W: width, T: t } }));
    return t;
  };
  let drag = null;
  target.addEventListener('pointerdown', e => {
    const r = target.getBoundingClientRect(); const edge = r.right - e.clientX < 10;
    drag = { mode: edge ? 'resize' : 'move', x0: e.clientX, left0: parseFloat(target.style.left), w0: target.offsetWidth };
    target.setPointerCapture(e.pointerId); target.style.transition = 'none'; [d, dl, wline, wl].forEach(el => el.style.transition = 'none');
  });
  target.addEventListener('pointermove', e => {
    if (!drag) return; const dx = e.clientX - drag.x0;
    if (drag.mode === 'move') target.style.left = `${Math.min(root.offsetWidth - target.offsetWidth, Math.max(start(), drag.left0 + dx))}px`;
    else target.style.width = `${Math.max(16, Math.min(160, drag.w0 + dx))}px`;
    layout();
  });
  target.addEventListener('pointerup', () => { drag = null; target.style.transition = ''; [d, dl, wline, wl].forEach(el => el.style.transition = ''); });
  target.addEventListener('click', () => target.animate([{ transform: 'scale(1)' }, { transform: 'scale(.92)' }, { transform: 'scale(1)' }], { duration: 160 }));
  return { layout, set(left, width) { target.style.left = `${left}px`; target.style.width = `${width}px`; return layout(); } };
}

// Touch target check: returns whether an element meets the 44pt (Apple) / 48dp (Material) minimum.
export function meetsTouchTarget(el, min = 44) {
  const r = el.getBoundingClientRect(); return r.width >= min && r.height >= min;
}
