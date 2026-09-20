# Build a Design System

> The difference is a system. Here's how to build one.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DVC2fsoiEFC/) (254K views, no site page). Category: visual.

## The rule

A design system is four decisions made once: a colour harmony from the wheel, a modular type scale, one spacing unit, and components composed from those tokens (atoms into molecules into organisms). Small tokens. Big systems.

## Key insights

- **01 · Colors.** Pick a harmony on the wheel instead of random hues. Monochromatic: one hue, vary lightness and saturation (primary, secondary, ghost buttons). Complementary: two opposites for maximum contrast (an alert banner with a Fix now button). Analogous: three neighbours, harmonious and natural (a row of stat cards).
- **02 · Typography.** A modular scale: each step is a fixed ratio, not a random size. Caption 14px (0.875×), Body 18px (base), Heading 32px (1.78×), Display 48px (2.67×). Mathematical ratios are always harmonious; one font family and four sizes give instant hierarchy.
- **03 · Spacing.** One unit, 8px, stacked to make every spacing value: 8 / 16 / 24 / 32 / 48 (xs to xl). Applied to a card that is 24px padding, 16px between blocks, 24px again. Random spacing (18 / 22 / 10) reads as noise; the 8px grid reads as rhythm.
- **04 · Atomic components.** Atoms (Color, Type, Space, Radius) compose into a molecule (a Get Started button: primary, Inter 700, 16 × 28, r:12) which composes into an organism (a Pro Plan card: heading, body text, button, 24px pad).

## Do / Don't

- **Do:** choose one colour harmony and derive every button, banner and card colour from it.
- **Do:** generate type sizes from a base and a ratio, and name them (caption, body, heading, display).
- **Do:** put every margin and padding on the 8px grid.
- **Do:** build bigger components only out of the tokens the smaller ones use.
- **Don't:** pick colours, sizes or gaps per screen.
- **Don't:** ship a button whose padding or radius exists nowhere else in the system.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | The difference is a system. | NO SYSTEM (my app, click here / SUBMIT / cancel) vs DESIGN SYSTEM (MyApp dashboard, Get Started / Learn More). |
| 2 | 4.5s | 01 Colors · Monochromatic | The wheel with one hue lit, four swatches, Primary / Secondary / Ghost buttons. |
| 3 | 9s | 01 Colors · Complementary | Red and cyan opposite each other, Alert Banner with Fix now. |
| 4 | 13.5s | 01 Colors · Analogous | Three green neighbours, $12k Revenue / +28% Growth / $4.2k Profit. |
| 5 | 22.5s | 02 Typography · Modular Scale | Caption 14px, Body 18px, Heading 32px filling in. |
| 6 | 22.5s (27s) | 02 Typography · Display | Display 48px joins; "Mathematical ratios → always harmonious". |
| 7 | 28.5s | 02 Typography · Hierarchy in Action | The Future of Design article card tagged Display / Heading / Body / Caption. |
| 8 | 28.5s (36s) | 02 Typography · one family | "One font family. 4 sizes. Instant hierarchy." |
| 9 | 37.5s | 03 Spacing · One unit: 8px | Stacked blocks 8 / 16 / 24 / 32 / 48. |
| 10 | 37.5s (45s) | 03 Spacing · Applied to a card | Card Title, description, Action with 24 / 16 / 24 guides. |
| 11 | 46.5s | 03 Spacing · Spot the Difference | RANDOM (18 / 22 / 10) vs 8PX GRID (16 / 16 / 16). |
| 12 | 55.5s | 04 Atomic Components · atoms, molecule | Color, Type, Space, Radius; Get Started with primary · Inter 700 · 16 × 28. |
| 13 | 55.5s (69s) | 04 Atomic Components · organism | r:12 added; Pro Plan card with Heading · Body text · Button · 24px pad. "Small tokens. Big systems." |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ds">
  <svg class="ds-wheel" id="wheel" viewBox="0 0 300 300"></svg>
  <div class="ds-bars" id="bars"></div>
</div>
<script type="module">
  import { ColorWheel, typeScale, spacingScale, SpacingChart, onGrid } from './pattern.js';
  const wheel = ColorWheel(document.getElementById('wheel'), { mode: 'analogous', base: 4 });
  wheel.set('complementary', 0);           // wheel.colors -> ['#ee3a4a', '#2ecfd6']
  typeScale(18);                            // { caption: {px: 14, ratio: '0.778×'}, body: {px: 18, ratio: 'base'}, ... }
  SpacingChart(document.getElementById('bars'), { unit: 8 });
  onGrid(22);                               // false
</script>
```

`WHEEL` and `HARMONIES` hold the twelve hues and the three harmony rules; `ColorWheel(svg, opts)` draws them and exposes `set(mode, base)` and `colors`. `typeScale(base, steps, ratio)` builds a modular scale; `REEL_SCALE` is the reel's 14 / 18 / 32 / 48. `spacingScale(unit)` and `onGrid(px)` cover spacing; `SpacingChart(el)` renders the stacked blocks. `TOKENS` lists the atoms the Get Started molecule is built from.

## Where it belongs

The start of any product: before the first screen, decide the colour harmony, the type scale, the spacing unit and the component tiers. Also the audit checklist for an existing UI that feels inconsistent.
