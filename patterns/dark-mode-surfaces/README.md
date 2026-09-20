# Dark Mode Surfaces

> Pure black isn't dark mode. It's a terminal.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DctFPo-tTQO/) (84.4K views). Category: visual. Instagram-only reel: the insights below are read off the on-screen copy.

## The rule

Dark mode is a system of six decisions, not an inverted palette: a near-black page with room for layers, lightness instead of shadow for elevation, one white at three alphas for text, an accent calmed to the same hue but lighter and softer, alpha hairlines instead of fixed greys, and photos dimmed while illustrations are redrawn.

## Key insights

- **01 Surface:** #000 + #FFF = zero depth. Pure black saves OLED battery but kills depth. Start at #0B0D10 (page, L 5%), then #13161B (card, L 9%) and #1A1E25 (chip, L 12%): room for layers.
- **02 Elevation:** `box-shadow: 0 24px 64px #000` does nothing on a dark page. Raise with lightness, not shadow: 0 page #0B0D10, 1 card #13161B, 2 menu #1A1E25, 3 modal #222730.
- **03 Text:** never pure white. One color, three alphas: primary `rgb(255 255 255 / .87)`, secondary 60%, disabled 38%.
- **04 Accent:** a saturated accent glows past its edges and steals the headline. Keep the hue (H 218 locked), drop saturation 85% → 45%, raise lightness 48% → 70%: #2563EB becomes #7FA6E8. Same hue, lighter, softer.
- **05 Hairline:** `border: none` gives no edge and no shape; a fixed grey #2A2A2A drifts as surfaces change (Δ 9). `1px rgb(255 255 255 / .08)` adapts: Δ constant. Alpha adapts, hex doesn't.
- **06 Images:** a bright photo is stolen attention. Dim it with `filter: brightness(.9)`. Illustrations don't dim well (still glare): redraw a dark variant.
- Dark mode is a system: Surface, Elevation, Text, Accent, Hairline, Images.

## Do / Don't

- **Do:** put the page at roughly 5% lightness and step each surface up by lightness, not by shadow.
- **Do:** define text as one white at three opacities so it stays consistent on every surface.
- **Do:** calm the accent by hue-locked desaturation and lightening; keep its identity, lose the glow.
- **Do:** draw hairlines with a white alpha so they read the same on page, card and modal.
- **Don't:** ship #000 backgrounds, #FFF text or a fixed-grey border and call it dark mode.
- **Don't:** dim an illustration and hope; redraw it for the dark surface.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Black background. | Acme Analytics dashboard on #000 with #FFF, a terminal prompt typing, "#000 + #FFF = zero depth". |
| 1b | 2s | Not dark mode. A terminal. | The same, prompt finished: `dark-mode --invert`. |
| 2 | 5s | 01 Surface (black) | page / card / chip slabs all #000000, L 0%. "saves OLED battery ✓", "kills depth ✕". |
| 2b | 13.5s | 01 Surface (near black) | Slabs at #0B0D10 / #13161B / #1A1E25, L 5 / 9 / 12%. "#0B0D10 · room for layers". |
| 3 | 17s | 02 Elevation (shadow) | Struck-through box-shadow, four lightness swatches 0 page to 3 modal. |
| 3b | 23.5s | 02 Elevation (lightness) | Export menu opens on the lighter #1A1E25 surface. "Raise with lightness, not shadow". |
| 4 | 28s | 03 Text (pure white) | `color: #FFFFFF;` primary / secondary / disabled all 100%. "Never pure white". |
| 4b | 37.5s | 03 Text (three alphas) | 87% / 60% / 38% chips on the dashboard, `rgb(255 255 255 / .87)`. "One color, three alphas". |
| 5 | 42s | 04 Accent (saturated) | #2563EB, S 85%, the headline dims under the glow. "Saturated glows past its edges". |
| 5b | 49.5s | 04 Accent (calm) | #7FA6E8, S 45%, L 70%, "H 218 locked". "Same hue · lighter · softer". |
| 6 | 54s | 05 Hairline (none) | `border: none`, the search field has no edge. "No edge, no shape". |
| 6b | 58.5s | 05 Hairline (alpha) | fixed gray #2A2A2A Δ 9 vs alpha 8% Δ constant. "Alpha adapts. Hex doesn't." |
| 7 | 64.5s | 06 Images (bright) | Sunset photo at brightness 100%, glowing light-variant illustration. "Bright image, stolen attention". |
| 7b | 70.5s | 06 Images (dimmed) | `filter: brightness(.9)`, illustration redrawn as a dark variant. "Photos: dim. Illustrations: redraw." |
| 8 | 75s | Dark mode is a system. | The finished dashboard, six ticks, Follow and Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ds" id="app">…surfaces use var(--ds-page) / var(--ds-card) / var(--ds-menu) / var(--ds-modal), text var(--ds-text-1..3), var(--ds-accent-calm), var(--ds-hairline)…</div>
<script type="module">
  import { DarkSystem, surfaces, textTiers, calmAccent, hairline, photoFilter } from './pattern.js';
  surfaces({ hue: 220 });        // { page, card, menu, modal } at L 5 / 9 / 12 / 16%
  textTiers();                   // { primary: rgb(255 255 255 / .87), secondary: .6, disabled: .38 }
  calmAccent('#2563eb');         // '#7fa6e8': same hue, S 45%, L 70%
  hairline(.08);                 // '1px solid rgb(255 255 255 / 0.08)'
  photoFilter(.9);               // 'brightness(0.9)'
  DarkSystem(document.getElementById('app'), { hue: 220, accent: '#2563eb' }); // writes all of it as custom properties
</script>
```

The demo stamps every dashboard from one `<template>` and themes it through `DarkSystem`; `Typewriter` drives the terminal prompt and freezes at the right character for screenshots.

## Where it belongs

Any dark theme with more than one surface: app shells, dashboards, settings, editors. Set the six tokens once and every card, menu, modal, hairline and photo follows.
