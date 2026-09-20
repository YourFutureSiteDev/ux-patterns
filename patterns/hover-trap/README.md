# Hover Trap

> Hover works on your laptop but is dead on mobile.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/hover-trap](https://www.designmotionhq.com/patterns/hover-trap) · [Instagram](https://www.instagram.com/reel/Dbp5G_otN_c/) (79K views). Category: interaction.

## The rule

Touch has no hover. Gate hover styles on `@media (hover: hover)`, never bury a primary action behind hover, give hover-only extras a touch-reachable home (in the card, behind a swipe, in a bottom sheet), and pad every icon button to a 44px hit area.

## Key insights

- Touch has no hover, so the browser fakes one: the first tap is spent becoming a sticky hover that freezes the revealed actions in place until the user taps somewhere else.
- Never bury a primary action behind hover. Hover should surface extras only, never something the user cannot otherwise reach.
- Give hover-only actions a touch-reachable home: put them in the card, behind a swipe, or inside a bottom sheet.
- Gate hover styles with `@media (hover: hover)` instead of sniffing the user agent, so a tablet with a mouse still gets the full treatment.
- Pair it with `pointer: coarse` to grow controls when the pointer is a thumb rather than a mouse.
- A 20px icon passes design review but misses the thumb. Pad the hit area to 44px and keep the glyph small.

## Do / Don't

- **Do:** reveal only secondary extras on hover, keeping every primary action reachable by tap.
- **Do:** gate hover effects behind `@media (hover: hover)` so pointer capability decides, not device type.
- **Do:** pad tap targets to 44px while keeping the visible icon around 20px.
- **Don't:** hide primary actions behind a hover state that touch users can never trigger.
- **Don't:** detect touch by sniffing the user agent instead of querying the pointer.
- **Don't:** size the tap target to the 20px icon and leave the thumb missing.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Touch has no hover. | Desktop browser: hovered card shows Favorite / Compare / Quick view. Phone (390 × 844): a tap lands on the chair and nothing appears. |
| 2 | 3s | Sticky hover | Phone with the faked :hover frozen open; "Still :hover 3.6s, nobody hovered"; tap 1 → :hover (spent on the hover), tap 2 → click. "one tap, two meanings". |
| 3 | 12s | Media query | cards.css diff: `if (isMobile)` out, `@media (hover: hover)` in. Laptop + mouse answers hover: hover / pointer: fine; phone and tablet pending. |
| 4 | 18s | Every pointer answered | Phone: hover: none ✕ / pointer: coarse; tablet + mouse: hover: hover ✓. targets.css: `@media (pointer: coarse) { .icon-btn { padding: 12px; /* 44px target */ } }`. "one query, every pointer". |
| 5 | 24s | Give it a real home | 01 In the card (inline actions), 02 Behind a swipe (swiped row with three actions), 03 In a bottom sheet (open). `.card .actions { opacity: 0 }` gone on mobile. |
| 6 | 30s | The primary action | Sheet closed; "the primary action: always visible" lit. "hover reveals extras, never the primary action". |
| 7 | 36s | Pad the box, not the icon | 20 px hit area: the thumb misses the heart ("passed design review"). 44 px hit area beside it. Hit area bars: 20 px vs 44 px, Apple HIG 44 pt · Material 48 dp. |
| 8 | 39s | Hits every time | Thumb on the 44 px target hits; "icon still 20 px". "pad the hit area, not the icon". |
| 9 | 45s | Touch has no hover. | Four-rule summary (Sticky hover, hover: hover, Never hide the primary, 44 px targets), @designmotionhq, Follow / Save this. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ht">
  <div class="ht-card ht-card--desk">…<div class="ht-actions"><span>Favorite</span></div></div>   <!-- hover reveals extras only under @media (hover: hover) -->
  <div class="ht-row ht-row--swiped" id="row"><div class="ht-row__body">…</div><div class="ht-swipe">…</div></div>
  <div class="ht-home"><div class="ht-card ht-card--home">…</div><div class="ht-sheet" id="sheet">…</div></div>
</div>
<script type="module">
  import { watchPointer, SwipeActions, BottomSheet, padHitArea } from './pattern.js';
  watchPointer();                                  // <html data-hover="hover|none" data-pointer="fine|coarse">
  SwipeActions(document.getElementById('row'));    // drag left to reveal, tap outside to close
  BottomSheet(document.getElementById('sheet'));   // tap the card beneath to open
  document.querySelectorAll('.icon-btn').forEach(b => padHitArea(b, 44));
</script>
```

`hoverCapable()` / `coarsePointer()` wrap the two media queries; `watchPointer()` mirrors them onto `<html>` and keeps them live. `StickyHoverTimer(el, bar, seconds)` drives the "still :hover" counter. `SwipeActions` and `BottomSheet` are the two touch homes for hover extras (events `ht:swipe`, `ht:sheet`). `padHitArea(btn, 44)` pads an icon button without changing the glyph.

## Where it belongs

Product cards, list rows, toolbars and any UI with hover-revealed actions that also ships to phones and tablets. Hover-only reveals are fine for extras; the primary action stays visible everywhere.
