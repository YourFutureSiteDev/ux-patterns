// Pricing psychology: anchor the price, badge the safe choice, frame the discount as a loss.
// Three small helpers that turn a plain price into a persuasive one, plus a card builder.

const money = n => '$' + n.toLocaleString('en-US');

// 1. Anchoring bias: show the reference price first, so the brain compares automatically.
//    anchor(49, 29) -> { was: '$49', now: '$29', save: 'Save 40%' }
export function anchor(reference, price) {
  const pct = Math.floor((1 - price / reference) * 100);
  return { was: money(reference), now: money(price), pct, save: `Save ${pct}%` };
}

// 2. Social proof: the badge removes decision paralysis. Marks one plan as the safe choice and
//    reports how many picked it ("+2,847 chose Pro this month").
export function socialProof(plans, { popular, count, period = 'this month' }) {
  return { badge: 'MOST POPULAR', proof: `+${count.toLocaleString('en-US')} chose ${popular} ${period}`, plans: plans.map(p => ({ ...p, popular: p.name === popular })) };
}

// 3. Loss aversion: losing $240 hurts more than saving $240 feels good. Frame the yearly
//    difference as a loss the buyer avoids. lossFrame(49, 29) -> { save: 'Save $240/year', warn: "Don't lose this!" }
export function lossFrame(reference, price, { perYear = 12 } = {}) {
  const yearly = (reference - price) * perYear;
  return { yearly, save: `Save ${money(yearly)}/year`, warn: "Don't lose this!", fomo: 'Fear of missing out' };
}

// Build a pricing card with all three secrets applied.
// PricingCard(el, { plan: 'Pro', reference: 49, price: 29, features: [...], cta: 'Start Free Trial', popular: true })
export function PricingCard(el, { plan, reference, price, features = [], cta = 'Start Free Trial', popular = false, onSelect } = {}) {
  const a = reference ? anchor(reference, price) : null;
  el.classList.add('pp-card'); el.classList.toggle('is-popular', popular);
  el.innerHTML = `
    ${popular ? '<span class="pp-badge" style="top:-14px;height:27px;padding:0 16px;font-size:12px">Most popular</span>' : ''}
    <div class="pp-card__plan" style="font-size:15px">${plan}</div>
    <div class="pp-price" style="font-size:44px;margin-top:20px">${a ? `<s style="font-size:18px">${a.was}</s>` : ''}<span>${money(price)}</span><small style="font-size:15px">/mo</small></div>
    ${a ? `<span class="pp-save" style="margin-top:8px;height:23px;padding:0 10px;font-size:12px">${a.save}</span>` : ''}
    <ul class="pp-features" style="margin-top:12px;font-size:14px;line-height:1.15;display:grid;gap:7px">${features.map(f => `<li>${f}</li>`).join('')}</ul>
    <button class="pp-btn pp-btn--green" style="margin-top:16px;height:41px;width:100%;font-size:14px">${cta} →</button>`;
  if (onSelect) el.querySelector('button').addEventListener('click', onSelect);
  return el;
}

// Count-up for the outro stats ("+30%").
export function countUp(el, to, { prefix = '', suffix = '', ms = 900 } = {}) {
  const t0 = performance.now();
  const tick = now => { const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = prefix + Math.round(to * e) + suffix; if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
