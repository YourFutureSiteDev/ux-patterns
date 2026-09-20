# Pricing Psychology

> Your pricing cards are leaving money on the table. Here are 3 secrets to fix it.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DUf3nehjIg7/) (100K views, "Save this for your next project"). No designmotionhq page for this one; the insights below are read off the reel. Category: content.

## The rule

Three tricks turn a plain price into a persuasive one: anchor it against a higher reference price, badge the plan most people pick, and frame the discount as a loss the buyer avoids. Design psychology, not harder work.

## Key insights

- Anchoring bias: show the reference price first ($49 struck through, then $29). The brain sees $49 first and compares automatically, so $29 feels like a steal.
- Social proof: a "Most popular" badge and "+2,847 chose Pro this month" make the middle plan the safe choice. "If everyone picks it, it must be good." The badge removes decision paralysis.
- Loss aversion: losing $240 hurts more than saving $240 feels good. "Don't lose this!" and "Save $240/year" frame the discount as a loss they'll avoid.
- All three sit on one card: struck reference price, Save 40% chip, Most popular badge, green trial button.
- The reel's claim: +30% conversions, 3 simple tricks, 0 extra effort.

## Do / Don't

- **Do:** put the higher reference price next to the real one, struck through, before the eye reaches the number that matters.
- **Do:** badge one plan as most popular and back it with a real count of people who chose it.
- **Do:** state the yearly saving as something the buyer would lose by not acting.
- **Don't:** show a lone "$29/mo" with nothing to compare it to.
- **Don't:** present three identical cards and make the buyer work out which one to pick.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Leaving money on the table | Plain Pro Plan card with a red ✕ vs the Most popular card with anchor, Save 40% and a green trial button. |
| 2 | 1.5s | Three secrets | The hero card built by `PricingCard()`, annotated: Anchoring (purple), Social Proof (orange), Loss Aversion (green). |
| 3 | 9s | Secret #1: Anchoring Bias | $49 struck in red beside $29/mo, "Brain sees $49 first". $29 feels like a steal. |
| 4 | 19.5s | Secret #2: Social Proof | Basic $9, Pro $29 (Most popular), Enterprise $99. Safe choice, +2,847 chose Pro this month. |
| 5 | 27s | Secret #3: Loss Aversion | "Just the price" card → "Don't lose this!", $49 $29, Save $240/year, Fear of missing out. |
| 6 | 37.5s | Outro | Design psychology. Not harder work. +30% conversions, 3 simple tricks, 0 extra effort. Follow for more UI tips. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="pp"><div id="pro" style="width:246px;padding:30px 26px"></div></div>
<script type="module">
  import { PricingCard, anchor, socialProof, lossFrame } from './pattern.js';
  PricingCard(document.getElementById('pro'), { plan: 'Pro', reference: 49, price: 29, popular: true, features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'API access'], cta: 'Start Free Trial', onSelect: () => location.href = '/signup' });
  anchor(49, 29);      // { was: '$49', now: '$29', pct: 40, save: 'Save 40%' }
  lossFrame(49, 29);   // { yearly: 240, save: 'Save $240/year', warn: "Don't lose this!" }
  socialProof(plans, { popular: 'Pro', count: 2847 }).proof; // "+2,847 chose Pro this month"
</script>
```

`PricingCard(el, opts)` renders the card with the struck reference, Save chip, badge and CTA. `anchor`, `socialProof` and `lossFrame` return the copy so you can drop it into your own markup. `countUp(el, 30, { prefix: '+', suffix: '%' })` drives the outro stat.

## Where it belongs

Pricing pages, plan pickers, upgrade prompts and checkout summaries. Anywhere a number is asked to sell itself.
