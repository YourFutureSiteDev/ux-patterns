# Atomic Design

> Atomic design system is the key. Colors, type, spacing, components, motion: five layers, one token file.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DXCMEljsw3w/) (41.7K views). Category: visual.

## The rule

Never type a raw value into a component. Every colour, size, gap, weight and duration comes from a named token on a fixed scale, and every component is assembled from those tokens. When the system is the source of truth, screens look like one product instead of forty decisions.

## Key insights

- Colours: replace `#3b82f6` with `var(--brand)`. A 900 to 100 primary scale plus four semantic tokens (bg-primary, brand, success, error) covers a whole product.
- Typography: hierarchy comes from a scale (text-5xl 48/800 down to text-base 20/400) and four weights (Regular 400, Medium 500, Bold 700, Extrabold 800), not from eyeballing headings.
- Spacing: random gaps (7px, 23px) read as sloppy; a 4px grid (space-1 4px to space-16 64px) makes every layout line up.
- Components: buttons (primary, secondary, ghost, destructive, three sizes), inputs with real states (focus, error, disabled), cards and badges all draw from the same tokens.
- Motion: three easings with jobs (ease-out enters, ease-in-out moves, ease-in exits), five durations with a 300ms MAX for UI, and four named presets (fade-in, slide-up, scale-in, bounce).

## Do / Don't

- **Do:** put every colour, size and duration behind a custom property and reference the property.
- **Do:** derive a type scale and a spacing scale first, then build components on top.
- **Do:** give inputs explicit default, focus, error and disabled states.
- **Don't:** hard-code hex values or pixel gaps inside components.
- **Don't:** invent a new button size or radius for one screen.
- **Don't:** let UI transitions run past about 300ms.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Intro | Five tiles: Colors, Type, Spacing, Components, Motion. |
| 2 | 3s | 01 Colors | Before (hex values, red) vs After (`var(--brand)`, green). |
| 3 | 9s | 01 Colors | After panel checked; Primary scale 900 to 100; bg-primary, brand, success, error tokens. |
| 4 | 21s | 02 Typography | No hierarchy ✗ vs Clear hierarchy ✓. |
| 5 | 27s | 02 Typography | Type scale text-5xl to text-base; Regular, Medium, Bold, Extrabold. |
| 6 | 33s | 03 Spacing | Random (7px, 23px) vs System (16px, 16px). |
| 7 | 36s | 03 Spacing | space-1 4px to space-16 64px bars grow in. |
| 8 | 40.5s | 03 Spacing | A card laid out on the 4px grid. |
| 9 | 45s | 04 Components | Primary, Secondary, Ghost, Destructive; Small, Medium, Large. |
| 10 | 46.5s | 04 Components | Email input in its error state: Required field. |
| 11 | 51s | 04 Components | Disabled input, gradient card with Action, badges New Active Pending Error. |
| 12 | 58.5s | 05 Motion | ease-out / ease-in-out / ease-in; 100ms to 500ms with 300ms MAX. |
| 13 | 64.5s | 05 Motion | Presets fade-in, slide-up, scale-in, bounce. |
| 14 | 69s | Outro | Design System Kit, $14, Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ad">
  <button class="ad-btn">Primary</button>
  <button class="ad-btn ad-btn--secondary ad-btn--sm">Small</button>
  <div class="ad-field" id="email" data-state="default">
    <label>Email</label><input type="email" placeholder="you@example.com">
    <span class="ad-field__hint"></span>
  </div>
</div>
<script type="module">
  import { tokens, applyTokens, FieldState } from './pattern.js';
  applyTokens();                                  // --color-brand, --space-4, --duration-300 … on :root
  FieldState(document.getElementById('email'), 'error', 'Required field');
</script>
```

`tokens` is the single source (colour, scale, type, weight, space, duration, easing). `applyTokens(el)` writes them as custom properties. `FieldState(field, state, message)` switches an `.ad-field` between default, focus, error and disabled; `cycleFieldStates` runs the reel's loop; `replay(panel)` restarts the easing and preset demos.

## Where it belongs

Any product with more than one screen. Start the token file before the first component; retrofit it the moment two buttons disagree.
