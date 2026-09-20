# Decoy Effect

> How apps use the decoy effect. Three options. This is not a real choice.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DU_Nv2UjFSm/) (52.2K views). Category: content.

## The rule

Put a third option next to the one you want people to buy: almost the same price, clearly fewer features. The brain compares what is comparable, the target wins that comparison easily, and the cheap option stops being considered at all.

## Key insights

- With two options (Basic $8, Premium $16) most people pick Basic: 80 % to 20 %.
- Add Pro at $14 with 15 pages, email support and 3 users: almost the same price as Premium, way fewer features. That is the decoy.
- The split shifts to Basic 20 %, Pro 20 %, Premium 60 %. Premium jumps from 20 % to 60 % without changing its price or features.
- It is everywhere: The Economist (Web Only $59, Print Only $125, Web + Print $125), Apple iCloud (Free 5 GB, 50 GB / $0.99, 200 GB / $2.99), Netflix (Standard w/ Ads $6.99, Standard $15.49, Premium $22.99).
- Your brain compares what is comparable: Pro vs Premium is 15 vs Unlimited pages, Email vs Priority support, 3 vs 10 users, for only $2 more. Basic is already forgotten.

## Do / Don't

- **Do:** price the decoy within a small step of the target and give it strictly less.
- **Do:** keep the decoy visually adjacent to the target so the comparison is the obvious one.
- **Do:** make the target's win explicit in the comparison (the checks, the "$2 more" note).
- **Don't:** make the decoy attractive on its own; if people buy it, it stopped being a decoy.
- **Don't:** run more than one decoy; three options is the whole trick.
- **Don't:** hide the price gap; the effect depends on the reader seeing "only $2 more".

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Basic $8, Pro $14, Premium $16 (filled). "This is not a real choice." |
| 2 | 3s | Two options | Basic vs Premium; bars grow to 80 % / 20 %. "Most people pick basic". |
| 3 | 9s | Now add a third option | Basic and Premium with a gap in the middle. |
| 4 | 12s | The decoy lands | Pro $14 in red, "← THE DECOY", almost same price, way fewer features. |
| 5 | 15s | Now watch what happens | Same cards, orange line. "Suddenly 60% choose". |
| 6 | 18s | The Shift, 2 options | Basic 80 %, Pro 0 %, Premium 20 %. |
| 7 | 20.5s | The Shift, with decoy | Basic 20 %, Pro 20 %, Premium 60 %. "Premium jumps from 20% → 60%". |
| 8 | 22.5s | It's everywhere | The Economist and Apple iCloud tiles with DECOY / TARGET tags. |
| 9 | 25s | It's everywhere | Netflix joins the list. |
| 10 | 27s | Your brain compares what's comparable | Pro vs Premium table, $14 vs $16, only $2 more for way more value. |
| 11 | 33s | Basic? Already forgotten. | Verdict lines under the table. |
| 12 | 36s | Outro | Next time you see 3 options... Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="de">
  <div class="de-tiers de-tiers--md" id="tiers" style="position:static"></div>
  <div class="de-split" id="split" style="position:static"></div>
</div>
<script type="module">
  import { findDecoy, renderTiers, renderSplit, renderComparison } from './pattern.js';
  const tiers = [
    { name: 'Basic', price: 8, features: ['5 pages', 'Email support', '1 user'] },
    { name: 'Pro', price: 14, features: ['15 pages', 'Email support', '3 users'] },
    { name: 'Premium', price: 16, features: ['Unlimited', 'Priority support', '10 users'] },
  ];
  renderTiers(document.getElementById('tiers'), tiers, findDecoy(tiers));   // marks .is-decoy / .is-target
  renderSplit(document.getElementById('split'), [
    { label: 'Choose Basic', value: 20, tone: 'grey' }, { label: 'Choose Pro (decoy)', value: 20, tone: 'red' }, { label: 'Choose Premium', value: 60, tone: 'purple' },
  ]);
</script>
```

`findDecoy(tiers)` returns the decoy / target / basic indexes (the tier within 20 % of the top price that offers less). `renderTiers` draws the cards, `renderSplit` animates the choice bars, `renderComparison` builds the two-column table, `caption(el, text, wordIndex)` boxes one word the way the reel's subtitles do.

## Where it belongs

Pricing pages, plan pickers, subscription upsells, bundle offers. Use it honestly: the target must genuinely be the better deal, and the decoy must never be the plan you would recommend.
