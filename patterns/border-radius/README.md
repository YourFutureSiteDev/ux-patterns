# Border Radius

> Same card. One looks off, one looks expensive. The gap is one CSS rule.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/border-radius](https://www.designmotionhq.com/patterns/border-radius). Category: visual.

## The rule

Inner radius = outer radius − padding. Pull every value from one scale (4 · 8 · 12 · 16 · 24), size the radius with the surface (tooltip 4, input 8, card 12, modal 16, panel 24), and pick the end of the range that matches the brand: sharp reads corporate, round reads friendly.

## Key insights

- Nested corners follow math: inner radius = outer radius − padding. When the concentric curves line up, a card reads as intentional instead of "off."
- Pull every value from one radius scale (4 · 8 · 12 · 16 · 24) instead of picking numbers per component. Consistency is what makes UI look expensive.
- Scale radius with element size: tooltips ~4px, inputs ~8px, cards ~12px, modals ~16px, panels ~24px. Bigger surfaces earn bigger corners.
- Radius carries personality. Small/sharp reads corporate, large/round reads friendly. Pick the range that matches your brand's tone.
- The difference is subtle but felt: off-scale, mismatched corners are exactly what separates "something's wrong here" from polished.

## Do / Don't

- **Do:** derive the inner radius from the outer radius minus padding so nested corners stay concentric.
- **Do:** commit to a single radius scale and reuse it across every component.
- **Do:** scale radius with element size. Larger surfaces get larger corners.
- **Don't:** pick radius values at random for each component.
- **Don't:** nest a rounded card inside another without adjusting the inner corner.
- **Don't:** mix a playful, oversized radius into a brand meant to feel serious, or the reverse.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Something's off... | Edit Profile modal with a 12px shell, 2px group, 16px inputs, 2px buttons. |
| 2 | 1s | One rule. | Same modal at Outer 16px, Inner 8px, Button 8px. |
| 3 | 6s | The Rule | Outer 16px card with padding 8px. |
| 4 | 9s | The Rule | Inner 8px, 16 − 8 = 8 ✓; inner 16px = outer looks bloated. |
| 5 | 13.5s | Radius Scale, before | Tooltip 12px, Input 20px, Card 6px, Modal 30px, Panel 10px. |
| 6 | 16.5s | Radius Scale, after | Tooltip 4, Input 8, Card 12, Modal 16, Panel 24 with the axis. |
| 7 | 22.5s | Radius = Personality | Corporate card (2px) vs friendly card (20px). |
| 8 | 25.5s | Radius = Personality | CORPORATE / FRIENDLY chips, Serious ↔ Playful slider. Choose for your brand. |
| 9 | 30s | Outro | Inner = Outer - Padding, 4 · 8 · 12 · 16 · 24, Match Your Brand. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="br">
  <div class="br-modal br-modal--rule" data-nest style="--radius:16px;padding:8px">…</div>
  <div class="br-card br-card--corp" id="a">…</div>
  <div class="br-slider__track" id="dial"><div class="br-slider__thumb"></div></div>
</div>
<script type="module">
  import { nestedRadius, snapRadius, applyNesting, PersonalityDial, Slider, roles } from './pattern.js';
  applyNesting(document.querySelector('[data-nest]'));   // sets --inner-radius = --radius − padding
  snapRadius(10);                                          // 8
  roles.modal;                                             // 16
  Slider(document.getElementById('dial'), PersonalityDial([document.getElementById('a')]), .2);
</script>
```

`nestedRadius(outer, padding)` is the rule; `applyNesting(el)` applies it to an element and every `[data-nest]` inside. `radiusScale` and `roles` hold the scale; `snapRadius` forces stray values onto it. `PersonalityDial(cards).set(0..1)` moves surfaces from serious to playful and `Slider` wires a track to it.

## Where it belongs

Every nested surface: modals with grouped fields, cards with buttons, inputs inside panels. Decide the scale once per product and let the personality slider land where the brand does.
