# Design Tokens

> 47 changes, or just one. Design tokens change everything.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/design-tokens](https://www.designmotionhq.com/patterns/design-tokens). Category: visual.

## The rule

Name tokens by role, layer them primitive to semantic to component, snap every value to a scale, and swap alias sets for themes. One change at the top cascades everywhere below.

## Key insights

- Name tokens by meaning, not value. `color-primary` survives a rebrand, while `color-blue-500` becomes a lie the moment blue turns teal.
- Structure tokens in three layers: primitives (raw values), semantic (meaning) and component (usage), each referencing the layer above.
- Change one primitive and it cascades through every component that points to it: one edit instead of 47 hunted-down values.
- Define a scale and snap everything to it. A stray 13px padding or 17px gap collapses to 12 and 16, so consistency stops being a guess.
- Dark mode isn't inverting colours, it's swapping one token set for another. Same components, alias tokens, a completely different feel.
- Tokens are your single source of truth for colour, spacing and type. The design system is only as strong as they are.

## Do / Don't

- **Do:** name tokens by role (`color-primary`, `spacing-md`, `font-body`) so they hold through a rebrand.
- **Do:** layer tokens primitives to semantic to component so a single change cascades.
- **Do:** snap arbitrary spacing and font sizes onto a fixed scale.
- **Don't:** bake literal values into names like `color-blue-500` or `spacing-16`.
- **Don't:** treat dark mode as inverting colours instead of swapping token sets.
- **Don't:** hardcode raw values across components instead of referencing tokens.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Design Tokens | Twelve raw values scattered (#3b82f6, 24px, 0.5, 400…). "47 → 1 source of truth". |
| 2 | 3s | Naming matters | Fragile (color-blue-500, spacing-16, font-14) vs Resilient (color-primary, spacing-md, font-body). |
| 3 | 9s | Naming matters | Rebrand: fragile fades, "5 manual updates" vs "0 changes needed". |
| 4 | 12s | 4-point scale | Scale 4 to 48 beside a card spec with padding 13px and gap 17px off-scale. |
| 5 | 15s | 4-point scale | SNAPPED: 12px, 16px land on the scale; border-radius 23px and font-size 15px still off. |
| 6 | 18s | 4-point scale | Card and modal both on-scale. "Same scale, same rhythm". |
| 7 | 22.5s | Alias tokens | Light phone: --surface #ffffff, --on-surface #111111, --primary #8b5cf6. |
| 8 | 24s | Alias tokens | Toggle to dark: same names, --surface #12121a, --primary #a78bfa. "Same tokens. Different values." |
| 9 | 30s | Token architecture | Primitives: blue-500, gray-100, space-4. |
| 10 | 33s | Token architecture | Semantic and component layers draw in; blue-500 becomes #14B8A6 and primary, btn-bg light up. |
| 11 | 36s | Cascade | "Change one. Cascade everywhere." |
| 12 | 40.5s | Outro | "Your design system is only as strong as its tokens". Follow for more. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="tk tk-theme is-light" id="app">
  <button class="tk-toggle__sw" id="toggle"></button>
  <div class="tk-phone">…</div>
</div>
<script type="module">
  import { Theme, TokenGraph, snap } from './pattern.js';
  const theme = Theme(document.getElementById('app'));
  document.getElementById('toggle').onclick = theme.toggle;     // swaps --surface, --on-surface, --primary
  const g = TokenGraph({ primitives: { 'blue-500': '#3b82f6' }, semantic: { primary: 'blue-500' }, component: { 'btn-bg': 'primary' } });
  g.set('blue-500', '#14b8a6');                                  // → ['primary', 'btn-bg'] cascade
  snap(13);                                                      // → 12
</script>
```

`TokenGraph` resolves a token through the layers and lists everything that depends on it. `Theme` swaps an alias set on an element. `snap` / `snapSpec` pull values onto the 4-point scale.

## Where it belongs

Every product with more than one screen, the moment a second person touches the CSS. Especially before a rebrand or a dark mode.
