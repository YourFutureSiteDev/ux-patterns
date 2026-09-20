# Border Radius System

> Every corner rounded. Still nothing lines up.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/Dcx__07t8e5/) (86.2K views). Category: visual.

## The rule

Border radius is a system, not a number. Pick one scale (4, 8, 12, 16, full), put every element on it, and derive the rest: nested corners subtract the padding, rings add the gap, edge-touching corners get zero, and full radius is a shape reserved for one-line elements.

## Key insights

- One radius everywhere is not a system. The same 12px on a card and the tray inside it makes the inner corner bulge because the two corners do not share a centre.
- Nested corners share one centre: inner = outer - padding. A 12px card with 8px of padding gets a 4px tray.
- Radius follows size. Chips and badges 4px, buttons and inputs 8px, cards 12px, modals and sheets 16px, avatars and toggles full.
- Full radius (9999) is a shape, not a number. A pill fits exactly one line; a multi-line card needs a real number or it turns into an ellipse.
- Touching an edge? No corner. A bottom sheet gets 16px 16px 0 0, a sidebar has a left edge of 0, a toast has a bottom edge of 0. A corner needs space beyond it.
- Rings sit outside: outer = inner + gap. A 2px ring around an 8px card is 10px, or the corner pinches.
- Let the card clip the image. Give the image radius 0 and overflow: hidden on the card, or the square corner pokes out.

## Do / Don't

- **Do:** define one radius scale and map every element size to a step on it.
- **Do:** compute nested radii from the outer radius minus the padding.
- **Do:** compute focus and selection rings from the inner radius plus the gap.
- **Do:** zero any corner that touches a screen edge.
- **Don't:** put one radius value on everything and call it consistent.
- **Don't:** use border-radius: 9999 on anything taller than one line.
- **Don't:** round an image separately from the card that clips it.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Radius · 01 | Project card with 12px on every corner, loupe on the tray corner: "tray 12 in card 12". One radius everywhere is not a system. |
| 2 | 3s | Radius · 02 Nested | Loupe on the tray's bottom-left: inner corner bulges. "card 12 · tray 12". |
| 3 | 7.5s | Radius · 02 Nested | Tray outlined pink, the rule appears: inner = outer - padding. |
| 4 | 10.5s | Radius · 02 Nested | Tray at 8px, loupe shows concentric corners. 12 - 8 = 4. |
| 5 | 15s | Radius · 03 Scale | border-radius: 8px everywhere; chip, button, card and sheet all wear 8. The five-step scale beneath. |
| 6 | 22.5s | Radius · 03 Scale | Each element moves to its own step: sm 4, md 8, lg 12, xl 16, connected to the scale. |
| 7 | 30s | Radius · 04 Pill | Chip, avatar and toggle at full radius, ticked. "border-radius: 9999 on one line". A pill fits exactly one line. |
| 8 | 33s | Radius · 04 Pill | The same card with 9999 becomes an ellipse. Multi line needs a real number. |
| 9 | 39s | Radius · 05 Edges | Phone with a share sheet floating on all four corners; sidebar with left edge 0, toast with bottom edge 0. |
| 10 | 45s | Radius · 05 Edges | The sheet goes flush to the bottom: 16px 16px 0 0. A corner needs space beyond it. |
| 11 | 48s | Radius · 06 Ring | Pricing cards, selected Team card outlined; loupes: ring 8 on card 8 pinches, ring 10 on card 8 is concentric. |
| 12 | 55.5s | Radius · 06 Ring | Formula flips to outer = inner + gap, the selection ring goes teal. Eight in, ten out. |
| 13 | 60s | Radius · 07 Images | Image with radius 0 inside a rounded card; loupe: square corner pokes out. |
| 14 | 64.5s | Radius · 07 Images | overflow: hidden on the card; loupe: clipped by the card. |
| 15 | 69s | Radius · System | The finished card with the six rules ticked: Nested, Scale, Pill, Edges, Ring, Images. Follow / Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="br">
  <div class="br-card" id="card">
    …
    <div class="br-tray" data-nested data-padding="4">…</div>
  </div>
</div>
<script type="module">
  import { installScale, applyNested, ring, edgeRadius, RADIUS_SCALE } from './pattern.js';
  installScale();                                          // --br-sm … --br-full on :root
  applyNested(document.getElementById('card'), RADIUS_SCALE.lg);   // tray radius = 12 - 4 = 8
  const off = ring(document.querySelector('.br-price.is-selected'), { gap: 2, color: '#2fe0ad' }); // ring = inner + 2
  sheet.style.borderRadius = edgeRadius(16, ['bottom']);  // "16px 16px 0px 0px"
</script>
```

`RADIUS_SCALE` is the five-step scale. `nestedRadius(outer, padding)` and `ringRadius(inner, gap)` are the two formulas; `applyNested(container, outer)` writes them onto `[data-nested]` children as `--br-inner`. `edgeRadius(r, edges)` zeroes the corners that touch an edge. `fitsPill(el)` tells you whether an element is one line tall and may take the full radius.

## Where it belongs

Every component with a corner: chips, buttons, inputs, cards, sheets, modals, toasts, avatars, toggles and the images and rings inside or around them. Anywhere two rounded shapes nest or sit side by side, the radii must come from the same scale and the same arithmetic.
