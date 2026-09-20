# Icon Design Rules

> Your icons look cheap. 5 rules turn them premium.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/icon-design-rules](https://www.designmotionhq.com/patterns/icon-design-rules). Category: visual.

## The rule

Treat an icon set as one system, not a pile of drawings: size round shapes optically larger than squares, snap every shape to a 24px grid, hold a single 2px stroke, give every icon the same bounding box, and commit to fill or outline for the whole set.

## Key insights

- Optical sizing beats math: circular and organic shapes need to sit 5 to 8% larger than squares to read the same size. Equal pixel dimensions make round icons look small. Math says 64, eyes say 70.
- Grid alignment keeps icons crisp: snap every shape to a 24px grid (16px for dense UI), because sub-pixel drift (x = 12.5px) blurs edges and kills sharpness.
- Stroke consistency is the fastest tell of quality: hold a single 2px weight across the whole set. Mixed weights look like four different icon libraries mashed together.
- The bounding box stays fixed even when the shape changes: give every icon the same 28px container so sizing reads even and toolbars stay legible.
- Fill vs outline is a set-wide commitment, not a per-icon choice. Pick one strategy and stick to it; a filled variant is reserved for the active state.

## Do / Don't

- **Do:** scale circular and organic icons 5 to 8% larger than square ones so they optically match.
- **Do:** snap every icon to a 24px grid (16px for dense UI) to keep edges crisp.
- **Do:** hold one stroke weight, 2px, across the entire set.
- **Don't:** size icons by raw math. Equal boxes make round shapes look small.
- **Don't:** mix fill and outline styles at random; commit to one strategy for the set.
- **Don't:** let icons float at loose sizes. Inconsistent bounding boxes make toolbars unreadable.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 5 icon rules | The DIY row (mixed colours, a filled star) slides out; the SYSTEM row slides in. "Five rules. Same icons. Different polish." |
| 2 | 3s | 01 Optical sizing | MATH: circle, square, triangle all 64px. OPTICAL: 70px, 64px, 72px. Rule: circles 5-8% larger than squares. |
| 3 | 12s | 02 Grid alignment | OFF-GRID star at x = 12.5px (blur) vs a star snapped to the 24px grid at x = 12px (crisp). |
| 4 | 21s | 03 Stroke consistency | MIXED 1px, 1.5px, 2px, 2.5px, 3px vs 2PX UNIFORM. |
| 5 | 30s | 04 Bounding box | LOOSE icons at 16-36px (chaos) vs BOUNDED 28px containers (steady). |
| 6 | 39s | 05 Fill or outline | RANDOM mix of fills vs STRATEGY: outline everywhere, fill only for ACTIVE. |
| 7 | 48s | Outro | 5 rules · 1 system. "Optical beats math. Grid beats eye." Chips: Optical, Grid, Stroke, Bbox, Fill. Save this for your next icon set. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ic">
  <div class="ic-row" id="toolbar" style="position:static"></div>
</div>
<script type="module">
  import { IconRow, SET, opticalSize, snapToGrid } from './pattern.js';
  opticalSize(64, 'circle');   // 70
  opticalSize(64, 'triangle'); // 72
  snapToGrid(12.5, 24);        // 24 (never 12.5)
  IconRow(document.getElementById('toolbar'), [
    { icon: 'i-heart', label: 'Like' }, { icon: 'i-bookmark', label: 'Save' }, { icon: 'i-heart', label: 'Active', fill: 'fill', active: true },
  ], { ...SET, stroke: 2, box: 28, fill: 'outline' });
</script>
```

`IconRow(root, items, set)` renders every icon with the set-wide stroke, box and fill strategy (per-icon overrides exist only to show what going wrong looks like). `opticalSize` and `snapToGrid` are the maths behind rules 01 and 02; `RuleProgress` and `GridBox` drive the reel chrome.

## Where it belongs

Any icon set you draw or assemble: toolbars, nav rails, tab bars, action rows. Audit an existing set against the five rules before adding a single new icon to it.
