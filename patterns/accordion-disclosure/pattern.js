// Accordion Disclosure: header is a <button aria-expanded aria-controls>, the panel animates
// grid-template-rows 0fr -> 1fr (never height:auto), the chevron rotates on the same curve,
// single-open (accordion) or multi-open (disclosure), and opening an item keeps its header anchored.
// Usage: Accordion(listEl, { single: true, anchor: true })
export function Accordion(root, opts = {}) {
  const items = [...root.querySelectorAll('.ac-item')];
  items.forEach((item, i) => {
    const head = item.querySelector('.ac-item__head'), panel = item.querySelector('.ac-item__panel');
    if (!panel.id) panel.id = `${root.id || 'ac'}-panel-${i + 1}`;
    head.setAttribute('aria-controls', panel.id);
    head.setAttribute('aria-expanded', item.classList.contains('is-open'));
    head.addEventListener('click', () => toggle(item));
  });
  function set(item, open) {
    item.classList.toggle('is-open', open);
    item.querySelector('.ac-item__head').setAttribute('aria-expanded', open);
    const m = item.querySelector('.ac-aria code'); if (m) { m.textContent = open; m.classList.toggle('is-true', open); }
    item.dispatchEvent(new CustomEvent('ac:toggle', { bubbles: true, detail: { open } }));
  }
  function toggle(item) {
    const open = !item.classList.contains('is-open');
    if (open && opts.single !== false) items.forEach(o => o !== item && o.classList.contains('is-open') && set(o, false));
    if (opts.anchor !== false) anchorHeader(item);
    set(item, open);
  }
  // Anchor: if a scrolling ancestor would shift the tapped header, scroll it back after the frame settles.
  function anchorHeader(item) {
    const scroller = item.closest('[data-anchor-scroll]') || root.closest('[data-anchor-scroll]');
    if (!scroller) return;
    const before = item.getBoundingClientRect().top;
    requestAnimationFrame(() => { const after = item.getBoundingClientRect().top; if (Math.abs(after - before) > 1) scroller.scrollTop += after - before; });
  }
  return { items, toggle, open: item => set(item, true), close: item => set(item, false), openIndex: i => toggle(items[i]) };
}

// Disclosure: same markup, many panels may stay open.
export const Disclosure = (root, opts = {}) => Accordion(root, { ...opts, single: false });
