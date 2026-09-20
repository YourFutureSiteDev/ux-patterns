# Golden Ratio

> One layout looks cheap, the other expensive. The difference is 1.618.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/golden-ratio](https://www.designmotionhq.com/patterns/golden-ratio) · [Instagram](https://www.instagram.com/reel/DW87CGQDKbY/) (36.6K views). Category: visual.

## The rule

Derive spacing, layout splits and type sizes from one base unit multiplied by 1.618, then round to clean pixels. Every gap and every font size relates to the next, so the whole screen shares a rhythm instead of a pile of arbitrary numbers.

## Key insights

- The golden ratio (1.618) turns up in seashells, galaxies and classic art. Layouts built on it read as naturally balanced instead of arbitrary.
- Build a spacing scale by multiplying a base unit by 1.618: 8, 13, 21, 34, 55. Every gap relates to the next, so the UI feels deliberate.
- Split the screen at the golden ratio, roughly 62% / 38%. Give primary content the larger panel and secondary actions the smaller one.
- Step your type scale by the same factor: 16px body, 26px subheading, 42px heading, 68px display. One rhythm ties the whole hierarchy together.
- It isn't just theory. Teams like Stripe, Linear and Airbnb lean on the same proportional system to look polished.

## Do / Don't

- **Do:** multiply one base unit by 1.618 to derive both spacing and type scales, so everything shares a rhythm.
- **Do:** split layouts at 62% / 38%, handing the larger share to primary content.
- **Do:** round the results to clean pixel values your grid can actually use.
- **Don't:** pick gaps and font sizes arbitrarily. Inconsistent proportions are what read as cheap.
- **Don't:** apply the ratio so rigidly it fights real content or your existing 8px grid.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Before / After | Two phone mockups: random spacing (grey CTA) vs golden spacing (gold CTA); a spiral traces the After screen. |
| 2 | 3s | 1.618 | The number, huge, gold, glowing. |
| 3 | 6s | The golden ratio | 1.618, φ, "THE GOLDEN RATIO", a spiral, chips: seashells, galaxies, the Mona Lisa. "Your brain is literally wired to find it beautiful." |
| 4 | 12s | Secret 01: Spacing scale | Bars 8, 13, 21, 34, 55 (base, small, medium, large, x-large), each x1.618, braces between rows. |
| 5 | 18s | Random vs Golden | Random card (12px, 7px, 20px, 5px, 15px) dimmed beside a Golden card (8px, 13px, 21px, 13px, 8px). |
| 6 | 24s | Secret 02: Layout proportions | A panel split at 61.8% content / 38.2% actions, filled with a dashboard and a Dashboard/Analytics/Settings/Profile nav plus Upgrade. |
| 7 | 33s | Secret 03: Type scale | 16px Body, 26px Subheading, 42px Heading, 68px Display, each x1.618. Chips: Stripe, Linear, Airbnb. |
| 8 | 48s | Outro | "Follow for more design rules", "Save this for your next project", Follow button over a faint spiral. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="gr">
  <div class="gr-scale" id="scale" style="position:relative;height:220px"></div>
  <svg class="gr-spiral" data-cx="200" data-cy="200" data-r0="40" data-turns="2" width="400" height="400"></svg>
</div>
<script type="module">
  import { PHI, goldenScale, goldenSplit, SpacingScale, GoldenSpiral } from './pattern.js';
  goldenScale(8, 5);          // [8, 13, 21, 34, 55]
  goldenScale(16, 4);         // [16, 26, 42, 68]
  goldenSplit(1200);          // { major: 742, minor: 458, majorPct: 61.8, minorPct: 38.2 }
  SpacingScale(document.getElementById('scale'), { base: 8 });
  GoldenSpiral(document.querySelector('.gr-spiral'));
</script>
```

`goldenScale(base, steps)` and `goldenSplit(total)` are the maths; `SpacingScale(root, opts)` renders the animated bar rows; `GoldenSpiral(svg)` draws a logarithmic spiral from the svg's data attributes; `FollowButton(btn)` toggles the outro CTA. Use the CSS custom property `--gr-phi` (1.618) in `calc()` for spacing tokens.

## Where it belongs

Spacing tokens, type scales, two-panel layouts (content + sidebar, canvas + inspector), card proportions, hero splits. Not a substitute for an 8px grid: round the results onto it.
