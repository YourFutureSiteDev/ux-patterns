# Serial Position

> Strongest first, strongest last: people forget the middle.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/serial-position](https://www.designmotionhq.com/patterns/serial-position) · [Instagram](https://www.instagram.com/reel/DYH5vQcK1DS/) (14.1K views). Category: content.

## The rule

Recall is U-shaped. People remember the first item (primacy) and the last (recency) and forget the middle, so the first and last slots of any sequence are bookends for your most important content.

## Key insights

- Recall is U-shaped: a 9-item test peaks at both ends (88% for #1, 78% for #9) and bottoms out in the centre. You'll only remember 1 and 9.
- Treat the first and last slots as bookends. Your highest-value content earns those positions, not the buried middle.
- Navbars: lead with the logo (primacy, 89%) and close with the primary CTA (recency, 76%). Secondary links sit in the forgettable middle (12% skipped).
- Landing pages: open with your strongest USP and end with your strongest proof (testimonials, logo wall, case study). The middle is the skip zone: filler, necessary, not memorable.
- Onboarding: slide 1 hooks, slide N pays off. Magic at the bookends, filler in the middle.
- Item order is a design decision. Anything important dropped into the low-recall middle quietly loses impact.

## Do / Don't

- **Do:** anchor your single most important item at both the start and the end of a sequence.
- **Do:** order menus so the logo leads and the primary CTA closes.
- **Do:** open with your best value proposition and finish with your strongest proof.
- **Don't:** bury critical CTAs or key information in the middle of a list, where recall is lowest.
- **Don't:** order items arbitrarily and assume every position is remembered equally.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Serial position | Nine-item menu: Home (1, PRIMACY) and Sign up (9, RECENCY) lit, 2 to 8 faded. "You'll only remember 1 & 9." |
| 2 | 3s | Recall data · 9 items | Memory is U-shaped. Bar chart 88% → 17% → 78% with the dashed curve. PRIMACY · #1, MIDDLE · #2–#8 (struck), RECENCY · #9. |
| 3 | 12s | Application 1 · Navbars | Logo first. CTA last. FlowBoard navbar; LOGO 89% PRIMACY, NAV ITEMS 12% SKIPPED, CTA 76% RECENCY. |
| 4 | 22.5s | Application 2 · Landing pages | Strongest USP first. Strongest proof last. Page mock with hero, skip zone rows, testimonial; PRIMACY and RECENCY callouts. |
| 5 | 34.5s | Application 3 · Onboarding | Slide 1 hooks. Slide N pays off. Welcome (HOOK) and You're set (PAYOFF) lit, three setup slides dimmed. |
| 6 | 43.5s | Outro | Strongest first. Strongest last. PRIMACY · RECENCY · BOOKENDS. Save for your next layout. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="sp">
  <nav class="sp-menu" id="nav"><a class="sp-item">Home</a><a class="sp-item">Pricing</a><a class="sp-item">Blog</a><a class="sp-item">Sign up</a></nav>
  <div class="sp-chart" id="chart"><svg class="sp-chart__curve" viewBox="0 0 610 285"><path/></svg><div class="sp-bars"></div></div>
</div>
<script type="module">
  import { markEdges, bookend, recallCurve, RecallChart } from './pattern.js';
  markEdges(document.getElementById('nav'));   // first and last get .is-first / .is-last, the rest dim
  bookend(sections, s => s.strength);          // strongest first, second strongest last, weakest in the middle
  RecallChart(document.getElementById('chart'), recallCurve(9));
</script>
```

`markEdges(container)` tags the first and last children as the edges. `bookend(items, key)` reorders a list so the two strongest sit at the ends. `recallCurve(n)` returns the U-shaped recall percentages and `RecallChart(root, values)` draws them. `slotRole(i, n)` answers primacy / middle / recency for any index.

## Where it belongs

Navigation order, landing page section order, onboarding flows, pricing tiers, feature lists, carousel slides and any list a user reads once. Put the thing that must be remembered first or last.
