// Z-Index Mastery: the four rules behind the reel, as small helpers you can drop into a real page.

// Rule 1. z-index needs position. Explains why an element's z-index is being ignored and, with fix=true,
// applies position: relative so it takes effect. Returns a report you can log or show.
// Usage: NeedsPosition(el, { fix: true })  -> { positioned, zIndex, fixed }
export function NeedsPosition(el, opts = {}) {
  const cs = getComputedStyle(el), positioned = cs.position !== 'static';
  let fixed = false;
  if (!positioned && opts.fix) { el.style.position = 'relative'; fixed = true; }
  el.classList.toggle('is-lifted', positioned || fixed);
  return { positioned: positioned || fixed, zIndex: cs.zIndex, fixed };
}

// Rule 2. Parent caps child. Walks up from el and returns the nearest ancestor that creates a stacking
// context, which is the ceiling a child's z-index can never climb above.
// Usage: StackingContextOf(el) -> { root, reason } (root === null means the element sits on the root context)
export function StackingContextOf(el) {
  for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
    const cs = getComputedStyle(n);
    const reason =
      (cs.position !== 'static' && cs.zIndex !== 'auto') ? `position:${cs.position} + z-index:${cs.zIndex}` :
      (cs.position === 'fixed' || cs.position === 'sticky') ? `position:${cs.position}` :
      cs.isolation === 'isolate' ? 'isolation: isolate' :
      cs.opacity !== '1' ? `opacity:${cs.opacity}` :
      cs.transform !== 'none' ? 'transform' :
      cs.filter !== 'none' ? 'filter' :
      (cs.willChange || '').match(/transform|opacity/) ? 'will-change' :
      cs.mixBlendMode !== 'normal' ? 'mix-blend-mode' : null;
    if (reason) return { root: n, reason };
  }
  return { root: null, reason: 'root stacking context' };
}

// Rule 3. One line, clean stack. Gives every component in scope its own stacking context so internal
// layers stop leaking out; marks each with is-isolated (which shows the "isolated" tag in the demo).
// Usage: Isolate(scopeEl, '.zi-comp')
export function Isolate(scope, selector = '.zi-comp') {
  const els = [...scope.querySelectorAll(selector)];
  els.forEach(el => { el.style.isolation = 'isolate'; el.classList.add('is-isolated'); });
  return els;
}

// Rule 4. Debug visually. Builds a Layers-panel style list from real elements: name, computed z-index and
// stacking order, so you can render it into a .zi-stack instead of guessing.
// Usage: LayerReport([{ el, name }]) -> [{ name, z, order }] sorted top-most first
export function LayerReport(items) {
  return items.map(({ el, name }) => { const cs = getComputedStyle(el); return { name, z: cs.zIndex === 'auto' ? 0 : Number(cs.zIndex), positioned: cs.position !== 'static' }; })
    .sort((a, b) => b.z - a.z).map((l, i, arr) => ({ ...l, order: arr.length - 1 - i }));
}
