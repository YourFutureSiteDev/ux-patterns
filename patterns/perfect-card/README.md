# Perfect Card

> One card looks free. The other costs $1000. Four CSS changes.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/perfect-card](https://www.designmotionhq.com/patterns/perfect-card). Category: visual.

## The rule

Same content, four changes: generous padding with a matching radius, a real type hierarchy, two stacked shadows plus a hairline border, and a hover lift. That is the entire gap between a card that looks free and one that looks premium.

## Key insights

- **Padding** is the biggest tell: going from a cramped 12px to **40px** with a **24px** border-radius instantly reads as intentional instead of cheap.
- Build a real **type hierarchy**: push the title to 600 weight and ~38px, then shrink the body and drop it to **55% opacity** so the eye lands on the title first.
- Stack **two shadows** for believable depth: a tight, darker one for contrast plus a wide, soft one for ambient elevation.
- Add a **hairline border** at roughly 12% opacity to define the card's edge against a dark background.
- A **hover state** (lift the card ~8px, scale to 1.02, and deepen the shadow) signals it's clickable and adds the final layer of polish.
- Same content, **four changes**: spacing, typography, shadows, and hover are the entire gap between a card that looks free and one that looks premium.

## Do / Don't

- **Do:** layer a tight shadow for contrast with a soft ambient one for depth, plus a subtle border around 12% opacity.
- **Do:** set the description to ~55% opacity so the title clearly wins the hierarchy.
- **Do:** give the card a hover lift (~8px up, slight scale, deeper shadow) so it feels interactive.
- **Don't:** cram content against the edges with tiny padding and near-zero border-radius; it reads as an unstyled default.
- **Don't:** give the title and body the same weight and full opacity, so nothing guides the eye.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Basic vs Premium | The same Dashboard Redesign card twice: cramped and sharp vs padded, bold, shadowed. "The difference? 4 CSS changes." |
| 2 | 7.5s | 01 Padding | The basic card, then padding grows to 40px with a 24px radius; `padding: 40px` tag. |
| 3 | 18s | 02 Typography | Title to 600 / 38px, body to 55% opacity; `font-weight: 600` and `opacity: 0.55` tags. |
| 4 | 30s | 03 Shadows | `box-shadow: 0 2px 8px`, `box-shadow: 0 20px 40px`, `border: 1px solid` land one after another. |
| 5 | 43.5s | 04 Hover State | Cursor over the card: lifts 8px, scales 1.02, deeper shadow, then settles. |
| 6 | 52.5s | Same content. Four changes. | The finished card. That's it. Follow @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="pc" style="--pc-s:1">
  <article class="pc-card" id="card">
    <div class="pc-card__img"><i></i><i></i><i></i></div>
    <span class="pc-card__tag">UI Design</span>
    <h3 class="pc-card__title">Dashboard Redesign</h3>
    <p class="pc-card__body">A modern analytics dashboard with real-time data visualization and responsive layout</p>
    <div class="pc-card__meta"><span class="pc-card__avatar"></span><b>Alex Chen</b><span>· 2 days ago</span></div>
  </article>
</div>
<script type="module">
  import { PerfectCard } from './pattern.js';
  const card = PerfectCard(document.getElementById('card'));
  card.apply('padding').apply('typography').apply('shadows').apply('hover');   // or card.upgrade(900) to play them in sequence
</script>
```

The card is basic by default; `apply(step)` adds `is-padding`, `is-typography`, `is-shadows` or `is-hover`. `TOKENS` holds the reel's numbers (40px / 24px, 600 / 38px / 0.55, the two shadows and border, the 8px / 1.02 lift). `--pc-s` scales the real values down to the size the reel renders them (0.65); set it to 1 in a product. `BasicVsPremium(a, b)` sets up the side-by-side.

## Where it belongs

Content cards: portfolio pieces, blog posts, products, project tiles, anything in a grid that can be clicked. Not for dense data rows or list items, where 40px of padding would waste the space.
