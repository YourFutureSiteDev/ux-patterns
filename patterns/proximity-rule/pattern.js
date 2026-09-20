// Proximity Rule: grouping by spacing alone. The gap inside a group must be smaller than the gap
// between groups; no borders or dividers needed.
//  - setProximity(el, within, between): write the two spacing tokens on any .px- component.
//  - groupBy(container, groups): wrap flat children into labelled groups (toolbars, sidebars).
//  - ungroup(container): flatten back to one evenly spaced row.

// Usage: setProximity(document.querySelector('.px-form'), 12, 40)
export function setProximity(el, within = 8, between = 32) {
  el.style.setProperty('--px-within', `${within}px`);
  el.style.setProperty('--px-between', `${between}px`);
  el.classList.toggle('is-grouped', between > within);
  el.classList.toggle('is-even', between === within);
  el.dispatchEvent(new CustomEvent('px:spacing', { detail: { within, between } }));
}

// groups: [{ label: 'Navigate', tone: 'purple', items: [el, el, el] }, ...]
// Children are moved into <div class="px-<kind>__group px-<kind>__group--<tone>"> wrappers with a title.
export function groupBy(container, groups, kind = 'nav') {
  ungroup(container, kind);
  groups.forEach(g => {
    const wrap = document.createElement('div');
    wrap.className = `px-${kind}__group px-${kind}__group--${g.tone || g.label.toLowerCase()}`;
    const title = document.createElement('div');
    title.className = kind === 'side' ? 'px-side__head' : 'px-nav__title';
    title.textContent = g.label;
    wrap.append(title, ...g.items);
    container.append(wrap);
  });
  container.classList.add('is-grouped');
  return container;
}

export function ungroup(container, kind = 'nav') {
  const items = [...container.querySelectorAll(`.px-${kind}__item`)];
  container.replaceChildren(...items);
  container.classList.remove('is-grouped', 'is-labelled');
  return items;
}

// Measure the proximity contrast of a component: between / within. Under 2 reads as one block.
export function proximityRatio(el) {
  const s = getComputedStyle(el);
  const within = parseFloat(s.getPropertyValue('--px-within')) || 0, between = parseFloat(s.getPropertyValue('--px-between')) || 0;
  return within ? between / within : Infinity;
}
