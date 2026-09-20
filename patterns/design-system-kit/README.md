# Design System Kit

> Random hex and eyeballed pixels don't scale. A token system does.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/design-system-kit](https://www.designmotionhq.com/patterns/design-system-kit). Category: visual.

## The rule

Store every colour, size, space and duration as a named token on a numbered scale, then build components as variants, sizes and states that read those tokens. Nothing inline, nothing eyeballed.

## Key insights

- Swap hardcoded hex for semantic tokens like `var(--brand)` or `var(--error)`. Intent survives every redesign, and a single rename updates the whole app.
- Build a numbered colour scale (100 to 900) so every shade is systematic instead of a lucky guess, then map it to semantic names such as brand, success and error.
- Define a type scale with fixed sizes and weights. Same size and weight everywhere means no hierarchy; a real scale separates heading from body at a glance.
- Base spacing on a 4px scale, space-1=4 up to space-16=64. Random gaps like 7px, 23px or 11px read as sloppy, while scale-based gaps feel deliberate.
- Standardise components as variants, sizes and states: primary/secondary/ghost/destructive buttons, small/medium/large sizing, and default/focus/error/disabled inputs.
- Match motion to intent: ease-out to enter, ease-in-out to move, ease-in to exit, and keep a duration scale from 100ms micro-interactions to 500ms complex transitions.

## Do / Don't

- **Do:** store every value as a named token so colour, type and spacing stay consistent across the app.
- **Do:** build numbered scales (colour 100 to 900, spacing 4 to 64) so choices are systematic, not improvised.
- **Do:** tie easing and duration to the interaction's intent: entering, moving or leaving.
- **Don't:** hardcode raw hex or pixel values inline.
- **Don't:** pick spacing by eye, 7px here and 23px there.
- **Don't:** give every text the same size and weight, killing all hierarchy.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Intro | Five kit cards (colours, type, easing curve, components, spacing) floating on a maroon glow. |
| 2 | 3s | 01 Colors | Before (raw hex) vs After (`var(--brand)`, `var(--bg-surface)`, `var(--border)`, `var(--error)`). |
| 3 | 7.5s | 01 Colors | After wins a green check. Primary scale 900 to 100 pops in, then bg-primary, brand, success, error tokens. |
| 4 | 21s | 02 Typography | Before: same size everywhere, "No hierarchy ✗". After: 31px heading, "Clear hierarchy ✓". |
| 5 | 24s | 02 Typography | Type scale text-5xl to text-base with px/weight, then Regular 400, Medium 500, Bold 700, Extrabold 800. |
| 6 | 33s | 03 Spacing | Random 7px / 23px gaps vs System 16px / 16px. |
| 7 | 36s | 03 Spacing | space-1 4px to space-16 64px bars growing in sequence. |
| 8 | 42s | 03 Spacing | A dashboard mock snapped to a 4px grid. |
| 9 | 45s | 04 Components | Buttons: Primary, Secondary, Ghost, Destructive; Small, Medium, Large. |
| 10 | 46.5s | 04 Components | Email input in the focus state. |
| 11 | 48s | 04 Components | Email input in the error state, "Required field". |
| 12 | 49.5s | 04 Components | Input disabled, gradient card with Action, badges New / Active / Pending / Error. |
| 13 | 57s | 05 Motion | ease-out (Enter / appear), ease-in-out (Move / resize), ease-in (Exit / leave). |
| 14 | 60s | 05 Motion | Duration scale 100ms to 500ms with 300ms marked MAX, then fade-in, slide-up, scale-in, bounce. |
| 15 | 69s | Outro | Design System Kit, $14, Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dk">
  <button class="dk-btn dk-btn--primary">Primary</button>
  <div class="dk-field" id="email">
    <div class="dk-field__label">Email</div>
    <input class="dk-field__input" placeholder="you@example.com">
    <div class="dk-field__msg">Required field</div>
  </div>
</div>
<script type="module">
  import { applyTokens, FieldStates, snapSpace } from './pattern.js';
  applyTokens();                                   // --primary-500, --brand, --space-4, --text-5xl… on :root
  const field = FieldStates(document.getElementById('email'));
  field.set('error');                              // default | focus | error | disabled
  snapSpace(23);                                   // → 24
</script>
```

`tokens` holds the whole kit (colour scale, semantic colours, type scale, weights, spacing, easing, durations). `applyTokens()` writes them as CSS custom properties. `FieldStates` drives the input states, `DurationScale` marks the MAX row, `snapSpace` rounds a stray value onto the 4px scale.

## Where it belongs

At the root of any product UI: one token sheet feeding buttons, inputs, cards, badges and motion. Not for one-off marketing pages where a single bespoke layout is the point.
