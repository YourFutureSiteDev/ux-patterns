// Number formatting like a system: tabular figures, right-aligned columns, compact
// abbreviations with the exact value on hover, relative time under a day, pinned currency.

// Format a number with grouping and fixed decimals (1204.5 -> "1,204.50").
export const formatNumber = (n, { decimals = 2, locale = 'en-US' } = {}) =>
  new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);

// Compact by default: 1000 -> "1K", 1000000 -> "1M", 3400000 -> "3.4M".
export function abbreviate(n) {
  const units = [[1e9, 'B'], [1e6, 'M'], [1e3, 'K']];
  for (const [v, s] of units) if (Math.abs(n) >= v) { const x = n / v; return (x >= 10 ? Math.round(x) : Math.round(x * 10) / 10) + s; }
  return String(n);
}

// Relative under a day, absolute for everything older ("2h ago" / "Mar 3").
export function relativeTime(date, now = new Date()) {
  const ms = now - date, h = ms / 36e5;
  if (h < 1) return `${Math.max(1, Math.round(ms / 6e4))}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
export const clockTime = date => date.toTimeString().slice(0, 5); // "14:32"

// Pin the symbol, align the decimal: returns { symbol, amount } so the column can pin "$" left and right-align the figure.
export const currency = (n, symbol = '$') => ({ symbol, amount: formatNumber(n) });

// Toggle tabular / proportional figures on a column and expose the ragged offsets the reel exaggerates.
export function FiguresColumn(root) {
  const set = mode => { root.classList.toggle('is-pnum', mode === 'pnum'); root.classList.toggle('nf-tnum', mode === 'tnum'); root.classList.toggle('nf-pnum', mode === 'pnum'); };
  return { set, toggle() { set(root.classList.contains('is-pnum') ? 'tnum' : 'pnum'); } };
}

// Type a code line into an element, then show the result callback.
export function typeCode(el, html, { cps = 18, onDone } = {}) {
  const tmp = document.createElement('span'); tmp.innerHTML = html; const text = tmp.textContent; let i = 0;
  const caret = '<span class="nf-code__caret"></span>';
  el.innerHTML = caret;
  const iv = setInterval(() => { i++; el.innerHTML = colorize(text.slice(0, i)) + (i < text.length ? caret : ''); if (i >= text.length) { clearInterval(iv); onDone && onDone(); } }, 1000 / cps);
  return () => clearInterval(iv);
}
const colorize = s => s.replace(/^(font-variant-numeric)(:?)/, '<span class="p">$1</span><span class="c">$2</span>');

// Compact stat tile: shows the abbreviation, reveals the exact value in a tooltip on hover/focus.
export function CompactStat(tile, value) {
  const v = tile.querySelector('.nf-tile__value'); v.textContent = abbreviate(value);
  let tip;
  const show = () => { if (tip) return; tip = document.createElement('div'); tip.className = 'nf-tip'; tip.innerHTML = `<div class="nf-tip__label">EXACT VALUE</div><div class="nf-tip__value">${formatNumber(value, { decimals: 0 })}</div>`; tip.style.cssText = 'left:0;right:0;top:-83px;margin:0 4px'; tile.append(tip); tile.classList.add('is-hover'); };
  const hide = () => { tip && tip.remove(); tip = null; tile.classList.remove('is-hover'); };
  tile.addEventListener('mouseenter', show); tile.addEventListener('mouseleave', hide); tile.addEventListener('focus', show); tile.addEventListener('blur', hide);
  tile.tabIndex = 0;
  return { show, hide };
}

// Activity list: fills each .nf-row__time from data-ts using relativeTime (or clockTime for the "absolute" comparison).
export function ActivityTimes(list, { mode = 'relative', now = new Date(), dimOld = mode === 'relative' } = {}) {
  list.querySelectorAll('.nf-row').forEach(row => {
    const t = new Date(row.dataset.ts), el = row.querySelector('.nf-row__time');
    const old = now - t >= 864e5;
    row.classList.toggle('is-old', old && dimOld); el.classList.toggle('is-past', old);
    el.textContent = old ? relativeTime(t, now).replace(/ (\d)$/, '  $1') : (mode === 'absolute' ? clockTime(t) : relativeTime(t, now));
    el.classList.toggle('is-abs', mode === 'absolute' && !old);
  });
}
