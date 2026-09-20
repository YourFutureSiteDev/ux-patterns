# Color Harmony

> 60 : 30 : 10. The only color rule you need.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DVLUTTWDHpz/) (60.6K views). Category: visual. Instagram-only reel: the insights below are read off the on-screen copy.

## The rule

Pick one dark colour and let it cover 60% of the screen. Use the same hue, slightly lighter, for the 30% that is cards, nav and containers. Spend the last 10% on one warm, high-contrast accent, and only on CTAs and key actions.

## Key insights

- **Dominant (60%):** pick ONE dark color. It covers 60% of your screen. "60% is just background."
- **Secondary (30%):** same hue, slightly lighter (#0f172a → #1e293b). Cards, nav, containers.
- **Accent (10%):** ONE bold color, warm and at max contrast. Only for CTAs and key actions.
- The "no system" dashboard uses a blue header, a teal revenue card, a purple users row and red, blue and purple bars: every element competes. The 60 : 30 : 10 version reads in one glance because only the Upgrade, View All and Settings actions carry colour.
- 3 colors. Zero guesswork.

## Do / Don't

- **Do:** derive the secondary surface from the base by lifting lightness, not by picking a new hue.
- **Do:** keep the accent for the actions you want tapped: Upgrade to Pro, View All, the highlighted bar.
- **Do:** let the base dominate. Empty dark space is the design, not a gap to fill.
- **Don't:** give every card its own colour. If a chart, a header and a row are all saturated, nothing is important.
- **Don't:** use a cool accent on a cool base. The warm complement is what makes 10% feel like 10%.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 60 : 30 : 10 | The rule as a headline over a dashboard split by an orange line: NO SYSTEM on the left, 60 : 30 : 10 on the right. |
| 2 | 4s | 01 Dominant 60% | Ring with the 60% arc lit, an empty dashboard.app window ("60% IS JUST BACKGROUND"), #0f172a swatch. |
| 3 | 11s | 02 Secondary 30% | Nav, stat cards and chart appear in #1e293b; slider "Same hue · +lightness". |
| 4 | 17s | 03 Accent 10% | Upgrade to Pro, View All, +12% and the last bar turn #f59e0b; slider "Warm · max contrast". |
| 5 | 22.5s | 3 colors. Zero guesswork. | The finished dashboard at reading size. |

The closing "Stop guessing colors. Follow @designmotionhq" card is a pure CTA and is not rebuilt.

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ch" id="app">…your UI using var(--ch-base), var(--ch-card), var(--ch-accent)…</div>
<script type="module">
  import { harmonize, SixtyThirtyTen, RatioRing, SplitCompare } from './pattern.js';
  harmonize('#0f172a');                         // { base: '#0f172a', cards: '#1e2a45', accent: '#f5a20b' }
  SixtyThirtyTen(document.getElementById('app'), '#0f172a', { accentHue: 38 }); // writes the three vars
  RatioRing(document.querySelector('.ch-ring')).set(30);                        // light one segment
  SplitCompare(document.querySelector('.ch-split')).set(324);                   // move the divider
</script>
```

`harmonize` lifts lightness for the 30% surface and picks the warm complement for the 10%; `SixtyThirtyTen` writes the result onto any element as CSS custom properties. `RatioRing` draws the 60/30/10 arcs on one circle and lights the active one. `SplitCompare` drives the no-system vs system reveal.

## Where it belongs

Any app shell, dashboard or landing page palette. Base for backgrounds, cards for surfaces and nav, accent for the primary action only.
