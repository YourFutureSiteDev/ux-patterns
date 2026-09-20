// Decoy effect: a third option priced next to the target but with fewer features makes the target look like
// the obvious choice. Basic stops being compared at all. Helpers: detect the decoy in a tier list, render tiers
// with the decoy/target marked, animate the choice split, build the two-column comparison the brain actually runs.

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// tiers: [{ name, price, features: [..], score? }]. The decoy is the tier whose price is within `near` of the
// most expensive tier while offering strictly less. Returns { decoy, target, basic } indexes (or null).
export function findDecoy(tiers, { near = 0.2 } = {}) {
  if (tiers.length < 3) return null;
  const score = t => t.score ?? t.features.length;
  const byPrice = tiers.map((t, i) => ({ t, i })).sort((a, b) => b.t.price - a.t.price);
  const target = byPrice[0];
  const decoy = byPrice.slice(1).find(({ t }) => (target.t.price - t.price) / target.t.price <= near && score(t) < score(target.t));
  if (!decoy) return null;
  const basic = byPrice[byPrice.length - 1];
  return { decoy: decoy.i, target: target.i, basic: basic.i };
}

// Render pricing tiers into root. roles: { decoy, target } indexes get .is-decoy / .is-target.
export function renderTiers(root, tiers, roles = {}, opts = {}) {
  root.innerHTML = tiers.map((t, i) => {
    const cls = i === roles.decoy ? ' is-decoy' : i === roles.target ? ' is-target' : '';
    const feats = t.features.map(f => `<span>${esc(f)}</span>`).join('');
    const tag = i === roles.decoy && opts.tags !== false ? '<em class="de-tier__tag">← THE DECOY</em>' : '';
    return `<div class="de-tier${cls}"><b class="de-tier__name">${esc(t.name)}</b><strong class="de-tier__price">$${esc(t.price)}</strong><div class="de-tier__feats">${feats}</div>${tag}</div>`;
  }).join('');
  return root;
}

// Choice split bars. rows: [{ label, value (0..100), tone: 'orange'|'purple'|'red'|'grey' }]. Values animate from 0.
export function renderSplit(root, rows, { animate = true, delay = 0 } = {}) {
  root.innerHTML = rows.map((r, i) => `<div class="de-bar de-bar--${r.tone || 'grey'}"><div class="de-bar__head"><span>${esc(r.label)}</span><b class="de-bar__pct">0%</b></div><div class="de-bar__track"><i class="de-bar__fill" style="width:0%"></i></div></div>`).join('');
  const set = (i, v) => { const bar = root.children[i]; bar.querySelector('.de-bar__fill').style.width = v + '%'; bar.querySelector('.de-bar__pct').textContent = Math.round(v) + '%'; };
  const run = () => rows.forEach((r, i) => {
    const bar = root.children[i], fill = bar.querySelector('.de-bar__fill'), pct = bar.querySelector('.de-bar__pct');
    fill.style.transition = `width 1.2s cubic-bezier(.2,.8,.2,1) ${delay}s`; requestAnimationFrame(() => { fill.style.width = r.value + '%'; });
    const t0 = performance.now() + delay * 1000, tick = now => { const k = Math.min(1, Math.max(0, (now - t0) / 1200)), e = 1 - Math.pow(1 - k, 3); pct.textContent = Math.round(r.value * e) + '%'; if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
  });
  if (animate) run(); else rows.forEach((r, i) => set(i, r.value));
  return { set, run };
}

// Side-by-side comparison of decoy vs target: rows of [decoyValue, label, targetValue].
export function renderComparison(root, { decoy, target, rows, price, note }) {
  root.innerHTML = `<div class="de-cmp__head"><div><b class="de-cmp__decoy">${esc(decoy.name)}</b><small>THE DECOY</small></div><div><b class="de-cmp__target">${esc(target.name)}</b><small>TARGET</small></div></div>
    ${rows.map(([a, l, b]) => `<div class="de-cmp__row"><span class="de-cmp__a">${esc(a)}</span><span class="de-cmp__l">${esc(l)}</span><span class="de-cmp__b">${esc(b)} <i>✓</i></span></div>`).join('')}
    <div class="de-cmp__row de-cmp__row--price"><span class="de-cmp__a">$${esc(price[0])}</span><span class="de-cmp__l">Price</span><span class="de-cmp__b">$${esc(price[1])}</span></div>
    <div class="de-cmp__note">${esc(note)}</div>`;
  return root;
}

// Subtitle caption: highlights one word (the reel's karaoke style). words: string, hi: index of the word to box.
export function caption(el, words, hi) {
  el.innerHTML = words.split(' ').map((w, i) => i === hi ? `<mark>${esc(w)}</mark>` : esc(w)).join(' ');
  return el;
}
