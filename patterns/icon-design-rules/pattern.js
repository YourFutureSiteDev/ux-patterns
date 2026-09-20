// Icon design rules: optical sizing, grid snapping, one stroke weight, one bounding box, one fill strategy.

// Rule 01: optical compensation. Round and pointed shapes need to be drawn larger than a square to read the same size.
export const OPTICAL = { square: 1, circle: 1.09, triangle: 1.125, organic: 1.06 };
export function opticalSize(base, shape = 'square') { return Math.round(base * (OPTICAL[shape] ?? 1)); } // opticalSize(64,'circle') -> 70

// Rule 02: snap a coordinate to the icon grid (24px, or 16px for dense UI). Sub-pixel drift blurs edges.
export function snapToGrid(v, grid = 24) { return Math.round(v / grid) * grid; }
export function snapToPixel(v) { return Math.round(v); }             // 12.5 -> 12 (crisp), never 12.5 (blur)

// Rule 03 + 04 + 05: an icon set config. Every icon shares stroke, box and fill strategy.
export const SET = { stroke: 2, box: 28, grid: 24, fill: 'outline' };

// Renders a row of icons into `root`. items: [{ icon, label, size, stroke, fill, box, active }].
// `icon` is the id of an <symbol> in the page. Set-wide defaults come from `set` so a good set is one config, not per-icon choices.
export function IconRow(root, items, set = SET) {
  root.replaceChildren(...items.map(it => {
    const cell = document.createElement('div'); cell.className = 'ic-cell' + (it.active ? ' is-active' : '') + (it.box === false ? '' : ' has-box');
    const size = it.size ?? set.box; const box = it.boxSize ?? set.box;
    cell.style.setProperty('--box', `${box}px`);
    const fill = it.fill ?? set.fill;
    cell.innerHTML = `<span class="ic-box"><svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill === 'fill' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${it.stroke ?? set.stroke}" stroke-linecap="round" stroke-linejoin="round"><use href="#${it.icon}"/></svg></span>${it.label != null ? `<small>${it.label}</small>` : ''}`;
    return cell;
  }));
  return root;
}

// Progress dots for "n / total" with the active one stretched into a pill.
export function RuleProgress(root, n, total = 5) {
  root.replaceChildren(...Array.from({ length: total }, (_, i) => { const d = document.createElement('i'); if (i + 1 === n) d.className = 'is-on'; return d; }));
  return root;
}

// Draws a `cell`px grid into an element and, if `snapped`, marks the four corner anchors.
export function GridBox(root, { cell = 24, snapped = false } = {}) {
  root.style.setProperty('--cell', `${cell}px`);
  root.classList.toggle('is-snapped', snapped);
  return root;
}
