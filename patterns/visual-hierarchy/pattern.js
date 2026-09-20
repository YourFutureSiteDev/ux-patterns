// Visual Hierarchy: five rules (size, color, contrast, whitespace, weight) that decide what gets seen first.

// emphasize(card, { scale }): make the card's heading roughly 2x its body text; returns the sizes it picked.
export function emphasize(card, { scale = 2, title = '.vh-hero__title', body = '.vh-hero__body' } = {}) {
  const t = card.querySelector(title), b = card.querySelector(body);
  const base = parseFloat(getComputedStyle(b).fontSize) || 18;
  card.classList.remove('vh-hero--small');
  t.style.fontSize = `${Math.round(base * scale)}px`; t.style.fontWeight = '800'; t.style.letterSpacing = '-.02em';
  card.dispatchEvent(new CustomEvent('vh:emphasize', { detail: { base, title: base * scale } }));
  return { base, title: base * scale };
}

// spendAccent(root, selector): strip every colour from the group and give the one accent to a single element.
export function spendAccent(root, selector, accent = 'var(--vh-purple)') {
  root.querySelectorAll(':scope > *').forEach(el => { el.style.background = ''; el.style.color = ''; el.style.borderColor = ''; el.classList.remove('r', 'y', 'b', 'v', 'on'); });
  const one = root.querySelector(selector) || root.firstElementChild;
  one.classList.add('on'); one.style.background = accent; one.style.color = '#fff';
  return one;
}

// contrastPairs: the three contrasts the reel shows, for building a comparison table programmatically.
export const contrastPairs = [
  { strong: { label: 'Bold 800', style: { fontWeight: 800 } }, weak: { label: 'Light 300', style: { fontWeight: 300, color: '#8b8d97' } } },
  { strong: { label: 'Filled', style: { background: '#864ded' } }, weak: { label: 'Outlined', style: { border: '1px solid #2a2a3a', color: '#8b8d97' } } },
  { strong: { label: '#FFFFFF', style: { color: '#ffffff' } }, weak: { label: '#4a4a6a', style: { color: '#4a4a6a' } } },
];

// breathe(root, gap): open up a cramped stack so the hero gets `gap` px of air and the secondary rows stay compact.
export function breathe(root, gap = 48) {
  const hero = root.querySelector('.vh-space__hero'), rows = [...root.querySelectorAll('.vh-space__row')];
  const inset = 32, top = 33;
  hero.animate([{ left: `${inset}px`, top: `${top}px`, width: `${root.clientWidth - inset * 2}px`, height: '100px', padding: '24px 25px' }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2)', fill: 'forwards' });
  let y = top + 100 + gap - 4;
  rows.forEach(r => { r.animate([{ left: `${inset}px`, top: `${y}px`, width: `${root.clientWidth - inset * 2}px` }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }); y += 34 + 17; });
  root.dispatchEvent(new CustomEvent('vh:breathe', { detail: { gap } }));
}

// weightOrder(container): apply the 800 / 400 / 300 reading order to the first three text elements of a block.
export function weightOrder(container, weights = [800, 400, 300]) {
  [...container.children].slice(0, 3).forEach((el, i) => { el.style.fontWeight = String(weights[i]); });
}
