# Star Rating

> Five stars looks trivial. Hover, half-fills, and honest averages are where it breaks.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/star-rating](https://www.designmotionhq.com/patterns/star-rating) · [Instagram](https://www.instagram.com/reel/DZHt9j8t1vW/) (27.7K views). Category: interaction.

## The rule

Preview on hover, keep the preview separate from the committed value, stagger the fill 30ms per star on commit, and render averages as fractional fills. Stars are the input; a ring plus a distribution is the summary.

## Key insights

- Preview on hover, don't wait for the click. Stars should fill ahead of the cursor so users see the value they're about to commit; a widget that only reacts on click hides the target until it's too late.
- Keep the preview state separate from the committed value. When the pointer leaves without clicking, snap the display back to the saved rating; a naive build leaves it stuck on the last hovered star.
- For averages, render fractional stars: a 4.4 is four full stars plus a fifth clipped to 44%. Rounding it up to five full stars is a lie that inflates perceived quality.
- Stagger the fill ~30ms per star, left to right. Popping all five at once feels flat and lifeless; the sequential sweep feels alive.
- Use fractional fill for input precision too; clumsy whole-star jumps read as cheap next to a smooth half-star land.
- Stars are the input; pair them with a summary view (an average ring plus a distribution breakdown) to communicate the aggregate score at a glance.

## Do / Don't

- **Do:** fill stars ahead of the cursor on hover so the value previews before commit.
- **Do:** render partial fills so a 4.4 shows four stars plus a 44%-filled fifth.
- **Do:** stagger the fill roughly 30ms per star, left to right, when a rating commits.
- **Don't:** round averages up to full stars; it misrepresents the real score.
- **Don't:** leave the preview stuck on the hovered value after the pointer leaves.
- **Don't:** pop all five stars simultaneously; it reads as flat and dead.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Sarah Chen's order card, two stars filled under the cursor. |
| 2 | 3s | Hover should preview | Marcus Webb "reacts on click" (pink) vs Priya Nair "previews on hover" (teal). |
| 3 | 9s | Preview ≠ committed | Preview layer follows the cursor to 4; committed layer stays at 3. |
| 4 | 12s | Preview ≠ committed | Pointer leaves: "leaves → snaps back to 3". |
| 5 | 15s | Preview ≠ committed | The naive build: "broken: stuck at 4, value flickers". |
| 6 | 18s | 4.4 true average rating | "what most apps show" (5 red stars) vs "the truth" (4 full + one star filled 44%). |
| 7 | 24s | The 30ms that feels alive | "all at once" (0ms delay, flat) vs "30ms stagger" (fills left to right, +30ms). |
| 8 | 34.5s | Stars to rate, a ring to summarize | Aria Coffee Roasters product card: input stars, 4.5/5 ring, 5-to-1 distribution bars. |
| 9 | 42s | Outro | Glowing 4.5 ring. "Stop rounding up." |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="sr">
  <div class="sr-stars" id="rate"></div>
  <div class="sr-stars" id="avg"></div>
</div>
<script type="module">
  import { StarRating, renderStars, AverageRing, Distribution } from './pattern.js';
  const input = StarRating(document.getElementById('rate'), { value: 0, onChange: v => fetch('/api/rate', { method: 'POST', body: v }) });
  renderStars(document.getElementById('avg'), 4.4);   // four full + a 44% fifth
</script>
```

`StarRating` keeps a hover preview and a committed value apart, snaps back on `pointerleave`, and restarts the 30ms stagger (`is-committing`) on every commit; it fires `sr:change`. `renderStars(root, value)` draws any fractional value. `AverageRing(root).set(v)` drives the ring via `--sr-p`; `Distribution(root, rows)` renders the breakdown, greying bars under 10%. Size and spacing come from `--sr-size` and `--sr-gap`; colour from `--sr-fill` (or the `sr-stars--pink`, `--red`, `--white` modifiers).

## Where it belongs

Product, order and review ratings; any 1-to-5 input. Averages always render fractionally next to a ring or count. Never round an aggregate up to a whole star.
