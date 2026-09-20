# Card Hover Anatomy

> Same card. One feels alive, three stay dead. Four rules separate them.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/card-hover-anatomy](https://www.designmotionhq.com/patterns/card-hover-anatomy) (no Instagram post). Category: motion.

## The rule

On hover, lift the card 8px and stretch its shadow over 200ms ease-out, claim the cursor with a border pulse or gradient sweep, cascade the hidden actions 60ms apart anchored at the bottom, and scale the image to 1.05 inside an overflow-hidden frame. Never scale the whole card: animate the content, hold the footprint.

## Key insights

- **Lift with weight:** raise the card ~8px on hover and stretch its shadow with it over ~**200ms ease-out**. Faster reads as twitchy, slower feels stuck.
- **Claim the cursor:** a pulsing accent border or a gradient sweep around the edge stops the card looking flat and signals it's interactive.
- **Cascade the actions:** reveal hidden buttons (favorite, cart, share) staggered ~**60ms apart**, anchored at the bottom. A reveal adds an affordance, not a new layout.
- **Push against the glass:** scale the image to ~**1.05** inside an `overflow-hidden` frame while the container stays fixed — the product presses outward instead of resizing the card.
- **The trap — keep the geometry:** never scale the whole card. That shifts neighbors and breaks the grid. Animate the content, hold the footprint.

## Do / Don't

- **Do:** Lift the card ~8px and grow its shadow together, using ~200ms ease-out for a sense of weight.
- **Do:** Stagger revealed actions ~60ms apart and anchor them to the card's bottom edge.
- **Do:** Scale the image to ~1.05 inside an overflow-hidden frame while the container holds still.
- **Don't:** Scale the entire card — it shifts neighboring cards and breaks the grid layout.
- **Don't:** Stack action buttons over the title or let them spill outside the card boundary.
- **Don't:** Time the lift too fast (twitchy) or too slow (stuck) — 200ms is the sweet spot.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Four product cards, one hovered with lift, glow and actions. "Same card. One feels alive." |
| 2 | 3s | 01 Lift: rest | Single card at rest, 0px, baseline. |
| 3 | 6s | 01 Lift: hover | Card lifted -8px; `translateY(-8px) · shadow(0 24px 40px black/60) · 200ms ease-out`. |
| 4 | 9s | 01 Lift: timing | Three cards lifting at 100ms (twitchy), 200ms (right), 400ms (stuck). "Same lift. Different feel." |
| 5 | 12s | 02 Glow | Border pulse (`Math.sin(frame)`) vs gradient sweep (`conic-gradient · rotate(360deg)`). "The card claims the cursor." |
| 6 | 19.5s | 03 Actions: correct | Heart, cart, share cascade in 60ms apart at the bottom of the image. |
| 7 | 25.5s | 03 Actions: anti-patterns | On top of title, all at once, outside the card. "Reveal means new affordance — not new layout." |
| 8 | 31.5s | 04 Image scale | Container static, image scale(1.050), overflow hidden. "The product pushes against the glass." |
| 9 | 40.5s | 05 Trap | Wrong: scale(card) breaks the layout. Right: lift(content) holds the geometry. "Never scale the whole card." |
| 10 | 46.5s | Outro | Three lit cards, "Follow for more UI Patterns", save for your next card grid. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ch" id="grid"></div>
<script type="module">
  import { cardHTML, hoverCards, HOVER } from './pattern.js';
  grid.innerHTML = cardHTML({ title: 'Wireless Headphones', price: '$129', rating: '4.8', reviews: '1.2k' });
  hoverCards(grid); // pointer-driven .is-hover for touch and demos; mouse hover is pure CSS
</script>
```

`.ch-card:hover` (or `.is-hover`) does all four rules in CSS: `translateY(var(--ch-lift))`, the shadow and pink border, the staggered `.ch-actions` reveal (`--i` × `--ch-stagger`) and the `--ch-img-scale` on the image inside the clipped frame. Tune `--ch-lift`, `--ch-dur`, `--ch-ease`, `--ch-stagger` and `--ch-img-scale` on `.ch`. Add `.ch-card--pulse` or `.ch-card--sweep` for the glow variants. `HOVER` exports the same numbers for JS. `.is-wrong` reproduces the trap for comparison only.

## Where it belongs

Product grids, media libraries, template galleries, anything in a grid where a card is a link. Not for list rows or cards that already have visible actions.
