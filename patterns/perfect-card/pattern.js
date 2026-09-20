// Perfect card: the four CSS changes that turn a basic card into a premium one.
// Same content, four changes: padding, typography, shadows, hover.

export const STEPS = ['padding', 'typography', 'shadows', 'hover'];

// The values behind each step (the reel's numbers). Exposed so a design system can read them.
export const TOKENS = {
  padding: { padding: 40, radius: 24, imageRadius: 18 },                   // from a cramped 12px / 4px
  typography: { titleWeight: 600, titleSize: 38, bodyOpacity: 0.55 },      // from 400 / same size / full opacity
  shadows: { tight: '0 2px 8px rgba(0,0,0,.4)', ambient: '0 20px 40px rgba(0,0,0,.35)', border: '1px solid rgba(255,255,255,.12)' },
  hover: { lift: 8, scale: 1.02, shadow: '0 30px 60px rgba(0,0,0,.5)' },
};

// Usage: const card = PerfectCard(el); card.apply('padding'); card.apply('typography'); ... or card.upgrade() for all four.
export function PerfectCard(el) {
  const applied = new Set();
  const api = {
    apply(step) { if (!STEPS.includes(step)) throw new Error(`unknown step ${step}`); el.classList.add(`is-${step}`); applied.add(step); el.dispatchEvent(new CustomEvent('pc:step', { detail: { step } })); return api; },
    reset() { STEPS.forEach(s => el.classList.remove(`is-${s}`)); applied.clear(); return api; },
    // Apply the steps one after another (the reel's reveal), `gap` ms apart. Resolves when the last one lands.
    upgrade(gap = 900) { api.reset(); return STEPS.reduce((p, s, i) => p.then(() => new Promise(r => setTimeout(() => { api.apply(s); r(); }, i ? gap : 0))), Promise.resolve()); },
    get applied() { return [...applied]; },
    get premium() { return STEPS.every(s => applied.has(s)); },
  };
  return api;
}

// Compare two cards: a basic one on the left, the premium version on the right, same content.
export function BasicVsPremium(basicEl, premiumEl) {
  const basic = PerfectCard(basicEl).reset(), premium = PerfectCard(premiumEl);
  STEPS.forEach(s => premium.apply(s));
  return { basic, premium };
}
