# Filter Chips

> 200 results. Three taps. 12 left.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/filter-chips](https://www.designmotionhq.com/patterns/filter-chips) · [Instagram](https://www.instagram.com/reel/DZfDbWdNTU5/) (23.7K views). Category: interaction.

## The rule

A chip is a system, not a button: three unmistakable states (idle, active, disabled), OR inside a group and AND across groups, a result count that changes on the same frame as the tap, one clear-all reset, one scrolling row on a phone, and the active set pinned on top so users can see why the list shrank.

## Key insights

- Give every chip three distinct visual states: idle (surface + border, tappable but not chosen), active (filled + check, clearly selected), and disabled (dimmed, no results behind it). If active looks like idle, the filter feels broken.
- Make the combination logic legible: OR within a group widens the net (more colours = more matches), AND across groups narrows it (adding a size filters the set down).
- Update the result count on the same frame as the tap. If the number doesn't move, users read it as "nothing happened" and tap twice.
- Always ship a single clear-all reset. Stacked filters trap users, and one tap back to zero is the escape hatch; pair it with a live count so the reset is legible.
- When chips outrun the screen, keep them in one horizontal scrolling row with a right-edge fade that hints at more. Wrapping into a multi-row wall buries the results below the fold.
- Pin active filters in a sticky summary bar on top so users can always see why the list shrank.

## Do / Don't

- **Do:** update the result count instantly on every tap, same frame as the state change.
- **Do:** give each chip clearly distinct idle, active, and disabled states.
- **Do:** offer a single clear-all reset paired with a live result count.
- **Don't:** let active chips look identical to idle ones; the filter reads as broken.
- **Don't:** wrap overflowing chips into a multi-row wall that pushes results off-screen.
- **Don't:** leave the count unchanged after a tap; users assume it failed and tap again.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Filter chips that actually work | 12 results, three active chips, two cards kept and four blurred out. Count runs 200 to 12 live. |
| 2 | 3s | One chip, three states | Idle (surface + border), Active (teal fill + check), Disabled (dimmed). "If active looks like idle, the filter feels broken." |
| 3 | 9s | How chips combine | Color / Size groups idle, 40 chairs match. |
| 4 | 10s | OR within | Red + Blue active, "OR within" pill, 84 chairs match ▲ wider. |
| 5 | 12s | AND across | Medium added, "AND across" pill, 31 chairs match ▼ tighter. "More chips in one group widen the net. A new group narrows it." |
| 6 | 15.5s | Every tap needs an answer | Ergonomic active, 48 results, "same frame". |
| 7 | 18s | 19 results | Lumbar support added, 19 results. Failure bar: "Mesh back: No count change = users tap twice." |
| 8 | 24s | One clear-all, always | 4 filters, Clear all button, four active chips with ×. "Stacked filters trap users." |
| 9 | 27s | Cleared | 0 filters, button dimmed, chips idle. "Reset in one tap." |
| 10 | 30s | 10 chips, one phone | Left phone: chips wrap into a wall and bury the results. Right phone: one scrolling row with an edge fade. |
| 11 | 39s | Pin active filters on top | Sticky bar with pin icon, three chips, 3 results; full six-card grid. |
| 12 | 42s | The list shrinks | Same bar; Leap V2, Gesture and Soft Pad blur out. "↓ why the list shrank". |
| 13 | 46s | Filters are a system. | Idle / Active / Disabled / Clear all chips, Follow CTA, "Save this for your next product page." |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="fc">
  <div id="filters">
    <div data-group="color"><button class="fc-chip"><svg>…check…</svg>Red</button><button class="fc-chip"><svg>…check…</svg>Blue</button></div>
    <div data-group="size"><button class="fc-chip"><svg>…check…</svg>Medium</button></div>
    <div class="fc-count"><b>40</b><span>chairs match</span></div>
    <button class="fc-clear">Clear all</button>
  </div>
  <div id="grid"><div class="fc-card" data-color="red" data-size="m">…</div></div>
</div>
<script type="module">
  import { FilterChips } from './pattern.js';
  FilterChips(document.getElementById('filters'), {
    grid: document.getElementById('grid'),
    match: (card, active) => active.every(c => c.group === 'color' ? true : card.dataset.size === 'm')
  });
</script>
```

`FilterChips(root, { grid, match, hits, total, mode })` toggles `.is-active` on tap, removes a chip from its × , recounts on the same frame (custom `hits(active)` or by matching `.fc-card`s in `grid`, adding `.is-out` to misses), flips the ▲ wider / ▼ tighter direction, dims the clear-all when nothing is active (`.is-empty`), and fires `fc:change`. `countTo(el, from, to, ms)` animates a number. `ChipStrip(strip)` turns a row into a real horizontal scroller with the edge fade.

## Where it belongs

Product listings, search results, inboxes, dashboards: anywhere a list is narrowed by tapping categories. Not for single-choice settings (use a segmented control) or for more than ~12 options per group (use a facet panel).
