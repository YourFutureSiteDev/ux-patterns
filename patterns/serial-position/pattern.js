// Serial position: recall is U-shaped. People remember the first items (primacy) and the last
// (recency) and forget the middle. Put the strongest content at both ends.

// Recall curve for n items (per cent), the reel's 9-item numbers by default.
export const RECALL_9 = [88, 38, 26, 21, 17, 21, 27, 46, 78];
export function recallCurve(n = 9) {
  if (n === 9) return RECALL_9;
  return Array.from({ length: n }, (_, i) => { const x = i / (n - 1); return Math.round(17 + 71 * Math.pow(Math.abs(2 * x - 1), 2.2) - (x > .5 ? 10 * (2 * x - 1) : 0)); });
}

// Label each slot: 'primacy' for the first, 'recency' for the last, 'middle' for the rest.
export const slotRole = (i, n) => i === 0 ? 'primacy' : i === n - 1 ? 'recency' : 'middle';

// bookend(items, key): order a list so its two strongest entries sit first and last, weakest in the middle.
// `key` returns the item's strength; the strongest goes first, the second strongest last.
export function bookend(items, key = x => x.weight ?? 0) {
  const sorted = [...items].sort((a, b) => key(b) - key(a));
  if (sorted.length < 3) return sorted;
  const [first, last, ...rest] = sorted;
  return [first, ...rest.reverse(), last];
}

// Apply serial-position classes to a list of DOM children (nav items, slides, sections):
// first gets .is-first .is-edge, last gets .is-last .is-edge, the rest are dimmed.
export function markEdges(container, { itemSelector = ':scope > *' } = {}) {
  const items = [...container.querySelectorAll(itemSelector)];
  items.forEach((el, i) => { const role = slotRole(i, items.length); el.classList.toggle('is-first', role === 'primacy'); el.classList.toggle('is-last', role === 'recency'); el.classList.toggle('is-edge', role !== 'middle'); el.dataset.role = role; });
  return items;
}

// Build the recall bar chart into a .sp-chart element. Bars animate in on scene enter.
export function RecallChart(root, values = RECALL_9) {
  const bars = root.querySelector('.sp-bars'); bars.replaceChildren();
  values.forEach((v, i) => {
    const bar = document.createElement('div'); bar.className = 'sp-bar' + (i === 0 ? ' is-first' : i === values.length - 1 ? ' is-last' : '');
    bar.innerHTML = `${i === 0 || i === values.length - 1 ? `<span class="sp-bar__val">${v}%</span>` : ''}<div class="sp-bar__fill" style="--v:${v};--i:${i}"></div><span class="sp-bar__x">${i + 1}</span>`;
    bars.append(bar);
  });
  // Dashed curve through the bar tops.
  const svg = root.querySelector('.sp-chart__curve');
  if (svg) { const step = 61, x0 = 74, base = 235, k = 1.85; const pts = values.map((v, i) => `${x0 + i * step},${base - v * k}`); svg.querySelector('path').setAttribute('d', 'M' + pts.join(' L')); }
  return { set(vals) { RecallChart(root, vals); } };
}
