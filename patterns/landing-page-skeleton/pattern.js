// Landing page skeleton: five sections in a fixed order. Hero (what / who / why in 3 seconds), Proof (right after
// the hero), Problem (agitate the pain before the cure), Solution (outcomes, not features, max three), Final CTA
// (same button as the top). The helpers below render the pieces and lint a page spec against the rules.

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const SECTIONS = ['hero', 'proof', 'problem', 'solution', 'cta'];

// spec: { hero: { headline, subhead, cta }, proof: { logos, quote, metric }, problem: [{ value, unit, label }],
//         solution: [{ label }], cta: { label } }. Returns a list of rule violations (empty = passes).
export function lintSkeleton(spec, order = SECTIONS) {
  const issues = [];
  order.forEach((s, i) => { if (s !== SECTIONS[i]) issues.push(`Section ${i + 1} should be "${SECTIONS[i]}", found "${s}"`); });
  const h = spec.hero || {};
  if (!h.headline) issues.push('Hero: missing headline (what do you offer?)');
  if (!h.subhead) issues.push('Hero: missing subhead (who is it for? why should I care?)');
  if (!h.cta) issues.push('Hero: missing the single CTA');
  if (h.carousel) issues.push('Hero: no carousels or sliders, they hide the one message that matters');
  const p = spec.proof || {};
  if (!(p.logos?.length || p.quote || p.metric)) issues.push('Proof: add logos, one testimonial or one hard number directly below the hero');
  if (!(spec.problem?.length)) issues.push('Problem: name the real cost (time, money, frustration) before pitching the solution');
  const sol = spec.solution || [];
  if (sol.length > 3) issues.push(`Solution: ${sol.length} benefits, cap it at three`);
  sol.forEach(b => { if (/feature|automation|tooling|personali[sz]ation|advanced/i.test(b.label) && !/\d|save|faster|less|more|ship|cut|double|2x|half/i.test(b.label)) issues.push(`Solution: "${b.label}" reads as a feature, frame it as an outcome`); });
  if (spec.cta && h.cta && spec.cta.label !== h.cta) issues.push(`Final CTA: "${spec.cta.label}" should repeat the hero CTA "${h.cta}" (same copy, same colour)`);
  return issues;
}

// Hero anatomy with annotation tags. layout: 'mobile' | 'desktop'
export function renderHero(root, hero, { layout = 'mobile', tags = true } = {}) {
  root.classList.toggle('lp-hero--desktop', layout === 'desktop');
  root.innerHTML = `<div class="lp-hero__copy"><span class="lp-hero__new">✧ New</span>
    <h2 class="lp-hero__h">${esc(hero.headline).replace('\n', '<br>')}${tags ? '<i class="lp-tag lp-tag--teal">Headline</i>' : ''}</h2>
    <p class="lp-hero__sub">${esc(hero.subhead)}${tags ? '<i class="lp-tag lp-tag--pink">Subhead</i>' : ''}</p>
    <button class="lp-btn" type="button">${esc(hero.cta)}${tags ? '<i class="lp-tag lp-tag--amber">CTA</i>' : ''}</button></div>
    <div class="lp-hero__visual">[visual / screenshot]</div>`;
  return root;
}

// Mobile / Desktop segmented control that re-renders the hero.
export function LayoutToggle(root, onChange) {
  root.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { root.querySelectorAll('button').forEach(x => x.classList.toggle('is-on', x === b)); onChange?.(b.dataset.layout); }));
  return root;
}

// Count-up for the proof metric ("2,847").
export function countUp(el, to, { duration = 1200, from = 0 } = {}) {
  const t0 = performance.now();
  const tick = now => { const k = Math.min(1, (now - t0) / duration), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}

// Problem rows: [{ value, unit, label, tone: 'pink'|'amber'|'red', icon }]
export function renderPains(root, rows) {
  root.innerHTML = rows.map(r => `<div class="lp-pain lp-pain--${r.tone}"><span class="lp-pain__icon">${r.icon || ''}</span><div><b>${esc(r.value)}<small>${esc(r.unit)}</small></b><span>${esc(r.label)}</span></div></div>`).join('');
  return root;
}

// Solution rows, either as features (the wrong way, dimmed) or outcomes. rows: [{ label, icon }]
export function renderBenefits(root, rows, { outcomes = true } = {}) {
  if (rows.length > 3) throw new Error('Rule of 3: max 3 benefits');
  root.innerHTML = rows.map(r => `<div class="lp-benefit${outcomes ? ' is-outcome' : ''}"><span class="lp-benefit__icon">${r.icon || ''}</span><div><small>${outcomes ? 'Outcome' : 'Feature'}</small><b>${esc(r.label)}</b></div><i class="lp-benefit__end">${outcomes ? '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' : '→'}</i></div>`).join('');
  return root;
}
