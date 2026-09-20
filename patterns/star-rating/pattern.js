// Star Rating: hover previews ahead of the cursor, the committed value lives in its own layer,
// fills stagger 30ms per star on commit, and averages render as fractional fills.

const STAR = 'M12 2.2L15.23 8.35 22.08 9.52 17.23 14.5 18.23 21.38 12 18.3 5.77 21.38 6.77 14.5 1.92 9.52 8.77 8.35Z';

// Build one star: an outline layer and a fill layer clipped to --sr-frac (0..1).
export function starEl(frac = 0) {
  const el = document.createElement('span');
  el.className = 'sr-star';
  el.innerHTML = `<svg viewBox="0 0 24 24"><path class="sr-star__outline" d="${STAR}"/></svg><span class="sr-star__clip"><svg viewBox="0 0 24 24"><path class="sr-star__fill" d="${STAR}"/></svg></span>`;
  setFrac(el, frac);
  return el;
}

export function setFrac(el, frac) {
  frac = Math.max(0, Math.min(1, frac));
  el.classList.toggle('is-on', frac >= 1);
  if (frac > 0 && frac < 1) { el.dataset.fill = ''; el.style.setProperty('--sr-frac', frac); }
  else { delete el.dataset.fill; el.style.removeProperty('--sr-frac'); }
}

// Render a (possibly fractional) value into a .sr-stars container: 4.4 -> four full + one at 44%.
export function renderStars(root, value, { count = 5 } = {}) {
  while (root.children.length < count) root.appendChild(starEl(0));
  [...root.children].forEach((s, i) => { s.style.setProperty('--sr-i', i); setFrac(s, value - i); });
  return root;
}

// Interactive input. Preview (hover) and committed (click) are separate values; leaving the
// pointer without clicking snaps the display back to the committed one.
// Usage: StarRating(root, { value: 3, hover: true, onChange })
export function StarRating(root, opts = {}) {
  const count = opts.count ?? 5;
  let committed = opts.value ?? 0, preview = null;
  renderStars(root, committed, { count });
  const stars = [...root.children];
  const draw = () => renderStars(root, preview ?? committed, { count });
  const commit = v => {
    committed = v; preview = null;
    root.classList.remove('is-committing'); void root.offsetWidth; root.classList.add('is-committing'); // restart the stagger
    draw(); opts.onChange?.(committed);
    root.dispatchEvent(new CustomEvent('sr:change', { detail: { value: committed } }));
  };
  stars.forEach((s, i) => {
    if (opts.hover !== false) s.addEventListener('pointerenter', () => { preview = i + 1; root.classList.remove('is-committing'); draw(); });
    s.addEventListener('click', () => commit(i + 1));
  });
  root.addEventListener('pointerleave', () => { preview = null; root.classList.remove('is-committing'); draw(); });
  root.setAttribute('role', 'radiogroup');
  return {
    get value() { return committed; },
    set(v) { commit(v); },
    preview(v) { preview = v; draw(); },
    clearPreview() { preview = null; draw(); }
  };
}

// The broken variant from the reel: reacts on click only, no hover preview.
export function ClickOnlyRating(root, opts = {}) { return StarRating(root, { ...opts, hover: false }); }

// Average ring: sets --sr-p (0..1) so the arc's dash offset animates to value/max.
export function AverageRing(root, { max = 5 } = {}) {
  const val = root.querySelector('.sr-ring__val b');
  return { set(v) { root.style.setProperty('--sr-p', (v / max).toFixed(4)); if (val) val.textContent = v.toFixed(1); } };
}

// Distribution bars: rows[] of { stars, pct } rendered into .sr-dist; bars under `lowBelow` % go grey.
export function Distribution(root, rows, { lowBelow = 10 } = {}) {
  root.innerHTML = rows.map(r => `<div class="sr-dist__row"><span class="sr-dist__n">${r.stars}<svg viewBox="0 0 24 24"><path d="${STAR}"/></svg></span><span class="sr-dist__track"><span class="sr-dist__fill${r.pct < lowBelow ? ' is-low' : ''}" style="--sr-p:${r.pct / 100}"></span></span><span class="sr-dist__pct">${r.pct}%</span></div>`).join('');
  return root;
}
