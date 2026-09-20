// Card Hover Anatomy: lift with weight, claim the cursor, cascade the actions, push against the glass.
// The hover itself is CSS (.ch-card:hover / .is-hover). This module builds the markup and the live helpers.

const ICONS = {
  heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8 3.4 4.5 7 4.5c2 0 3.4 1 5 2.8 1.6-1.8 3-2.8 5-2.8 3.6 0 6 3.5 4.5 7.3C19.5 16.4 12 21 12 21z"/></svg>',
  cart: '<svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11.5a1 1 0 0 0 1 .8h9.4a1 1 0 0 0 1-.8L21 8H6.5"/><circle cx="9.5" cy="20" r="1.2"/><circle cx="17.5" cy="20" r="1.2"/></svg>',
  share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
};

// cardHTML({ title, price, rating, reviews, size, actions, cls, style }) -> markup for one product card.
export function cardHTML({ title = 'Wireless Headphones', price = '$129', rating = '4.8', reviews = '1.2k', size = '', actions = true, cls = '', style = '', badge = 'NEW', stock = 'IN STOCK' } = {}) {
  const acts = actions ? `<div class="ch-actions">${['heart', 'cart', 'share'].map((k, i) => `<button style="--i:${i}" aria-label="${k}">${ICONS[k]}</button>`).join('')}</div>` : '';
  return `<article class="ch-card${size ? ' ch-card--' + size : ''}${cls ? ' ' + cls : ''}"${style ? ` style="${style}"` : ''}>
    <div class="ch-card__img"><span class="ch-badge">${badge}</span><div class="ch-donut"></div>${acts}</div>
    <div class="ch-card__body"><div class="ch-card__title">${title}</div><div class="ch-card__meta"><i>★</i>${rating} · ${reviews} reviews</div><div class="ch-card__foot"><b>${price}</b><span>${stock}</span></div></div>
  </article>`;
}

// Mount cards for every [data-cards] element: a JSON array of cardHTML options, either in the attribute
// or as the text of a <script type="application/json" data-cards> block. The element is replaced by the cards.
export function mountCards(root = document) {
  root.querySelectorAll('[data-cards]').forEach(el => { const list = JSON.parse(el.dataset.cards || el.textContent); el.insertAdjacentHTML('beforebegin', list.map(cardHTML).join('')); el.remove(); });
}

// Cursor-following hover for touch / demo: toggles .is-hover on the card under the pointer.
export function hoverCards(container) {
  let last = null;
  container.addEventListener('pointermove', e => { const c = e.target.closest('.ch-card'); if (c === last) return; last?.classList.remove('is-hover'); c?.classList.add('is-hover'); last = c; });
  container.addEventListener('pointerleave', () => { last?.classList.remove('is-hover'); last = null; });
}

// Reads the live scale of an image inside a card and writes it to a label, e.g. "image: scale(1.049)".
export function watchScale(imgEl, labelEl) {
  let raf;
  const tick = () => { const m = new DOMMatrix(getComputedStyle(imgEl).transform); labelEl.textContent = `image: scale(${m.a.toFixed(3)})`; raf = requestAnimationFrame(tick); };
  tick();
  return () => cancelAnimationFrame(raf);
}

// The numbers, for anyone wiring their own card.
export const HOVER = { lift: -8, duration: 200, easing: 'cubic-bezier(.22,1,.36,1)', stagger: 60, imageScale: 1.05, shadow: '0 24px 40px rgba(0,0,0,.6)' };
