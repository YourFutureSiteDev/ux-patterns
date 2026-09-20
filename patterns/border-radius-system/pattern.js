// Border Radius System: one scale, three rules.
//   scale   sm 4 · md 8 · lg 12 · xl 16 · full 9999 (full is a shape: one-line elements only)
//   nested  inner = outer - padding      (nested corners share one centre)
//   ring    outer = inner + gap          (a focus ring or selection outline sits outside the card)
//   edges   a corner touching a screen edge gets 0
// Everything below is plain arithmetic on those rules; the CSS in pattern.css reads the results as custom properties.

export const RADIUS_SCALE = { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 };

// Inner radius for an element nested `padding` px inside a container with `outer` radius. Never below 0.
export function nestedRadius(outer, padding) { return Math.max(0, outer - padding); }

// Ring radius for an outline drawn `gap` px outside an element with `inner` radius.
export function ringRadius(inner, gap) { return inner + gap; }

// Apply the system to a container: sets --br-outer on it and --br-inner on every [data-nested] child from its own padding.
// Children may set data-padding (px) or the real computed padding-left is read.
export function applyNested(container, outer = RADIUS_SCALE.lg) {
  container.style.setProperty('--br-outer', outer + 'px');
  container.style.borderRadius = 'var(--br-outer)';
  for (const el of container.querySelectorAll('[data-nested]')) {
    const pad = el.dataset.padding !== undefined ? Number(el.dataset.padding) : parseFloat(getComputedStyle(el).marginLeft) || parseFloat(getComputedStyle(container).paddingLeft) || 0;
    const r = nestedRadius(outer, pad);
    el.style.setProperty('--br-inner', r + 'px');
    el.style.borderRadius = 'var(--br-inner)';
  }
  return container;
}

// Draw a selection ring around `el` using a box-shadow spread of `gap` px and a radius of inner + gap.
// Returns a function that removes the ring again.
export function ring(el, { gap = 2, color = 'currentColor', width = 2 } = {}) {
  const inner = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
  const prev = { outline: el.style.outline, offset: el.style.outlineOffset, radius: el.style.borderRadius };
  el.style.outline = `${width}px solid ${color}`;
  el.style.outlineOffset = gap + 'px';
  // outlines follow border-radius in modern engines; the visible ring radius is inner + gap automatically.
  el.dataset.ringRadius = ringRadius(inner, gap);
  return () => { Object.assign(el.style, { outline: prev.outline, outlineOffset: prev.offset, borderRadius: prev.radius }); delete el.dataset.ringRadius; };
}

// Corners that touch an edge get 0. `edges` is any of 'top', 'right', 'bottom', 'left'.
export function edgeRadius(r, edges = []) {
  const t = edges.includes('top'), b = edges.includes('bottom'), l = edges.includes('left'), rt = edges.includes('right');
  const tl = t || l ? 0 : r, tr = t || rt ? 0 : r, br = b || rt ? 0 : r, bl = b || l ? 0 : r;
  return `${tl}px ${tr}px ${br}px ${bl}px`;
}

// Pill check: full radius only fits a single line of content.
export function fitsPill(el) { const cs = getComputedStyle(el); return el.getBoundingClientRect().height <= parseFloat(cs.lineHeight) * 1.6; }

// Install the scale as custom properties on any root.
export function installScale(root = document.documentElement, scale = RADIUS_SCALE) {
  for (const [k, v] of Object.entries(scale)) root.style.setProperty(`--br-${k}`, v + 'px');
}
