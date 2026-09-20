# Card Spacing Fixes

> This card looks cheap. 4 spacing fixes. Watch.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DUKBLjHCsS8/) (8,574 views). Category: visual.

## The rule

Same components, same colours, same copy. A card that looks cheap is nearly always a spacing problem, and it takes four numbers to fix: padding, the gap between elements, the line-height of the body text, and the breathing room the card leaves around itself.

## Key insights

- Fix #1, padding 8px to 28px. Content jammed against the edge reads as an afterthought; a generous inner margin is the first thing that makes a card feel considered.
- Fix #2, element spacing 4px to 18px. The header, the text, the image and the action row each need their own air, or the eye cannot tell where one stops and the next starts.
- Fix #3, line-height 1.1 to 1.6. Three lines of body copy at 1.1 look like a wall; at 1.6 they read.
- Fix #4, breathing room 2px to 28px. The space around the card counts as much as the space inside it.
- Before and after are the same card. Nothing was redesigned; only spacing changed.

## Do / Don't

- **Do:** drive card spacing from a handful of tokens (padding, gap, line-height, outer spacing) so the fix is a number, not a redesign.
- **Do:** give every block inside a card its own gap; do not rely on the components' own margins.
- **Do:** set body copy line-height between 1.5 and 1.6 for anything longer than one line.
- **Don't:** shrink padding to "fit more in"; the card reads as cheap before it reads as dense.
- **Don't:** reach for new colours, borders or shadows when the real problem is spacing.
- **Don't:** butt cards up against each other or the viewport edge.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | The cheap card (8px padding, 4px gaps, 1.1 line-height) under a red glow: "This card looks cheap." |
| 2 | 3s | Hook | The fixed card under a green glow: "4 spacing fixes. Watch." |
| 3 | 6s | Fix #1 Padding | The 8px padding band highlighted in purple. |
| 4 | 9s | Fix #1 Padding | Padding applied; pill "padding 8px → 28px". |
| 5 | 15s | Fix #2 Element Spacing | Purple lines mark the three 4px gaps. |
| 6 | 18s | Fix #2 Element Spacing | Gaps opened; pill "gap 4px → 18px". |
| 7 | 24s | Fix #3 Line Height | Body copy relaxes; pill "line-height 1.1 → 1.6". |
| 8 | 33s | Fix #4 Breathing Room | Soft glow above the card; pill "spacing 2px → 28px". Live: replays all four fixes with the pill counting. |
| 9 | 39s | Before | The cheap card, dimmed, under a red BEFORE tag. |
| 10 | 42s | After | The fixed card with a green outline and AFTER tag. "Same card. Just spacing." |
| 11 | 45s | Outro | "Want more design tricks?" Follow for daily tips. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="cs">
  <article class="cs-card is-fixed">…header, text, media, actions…</article>
</div>
<script type="module">
  import { applyFixes, SpacingFixes, FIXES } from './pattern.js';
  applyFixes(card, 1);                 // padding + gap only
  SpacingFixes(card, { pill, kicker, title }).run();   // animate all four, one at a time
</script>
```

`.cs-card` reads `--pad`, `--gap`, `--lh` and `--space`; the `is-pad`, `is-gap`, `is-lh`, `is-space` classes (or `is-fixed` for all four) set them. `FIXES` lists each fix with its from/to values; `countUp` and `renderPill` draw the "8px → 28px" counter.

## Where it belongs

Any content card: social posts, product tiles, dashboard panels, comments, list items with media. Run the four fixes whenever a card "looks off" before touching colour or type.
