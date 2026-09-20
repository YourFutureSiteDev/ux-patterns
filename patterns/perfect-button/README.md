# Perfect Button

> Same button, different feeling: three secrets. Hover, press, ripple.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DUoZ4_GDMWp/) (140K views). Category: visual.

## The rule

A button people tolerate becomes a button people enjoy with three states: a hover lift (scale +5%, deeper shadow, subtle glow), spring press feedback (0.95x on press, 1.05x bounce on release) and a ripple from the click point on a spring ease-out instead of a linear one.

## Key insights

- Hover states: a button that just sits there reads as cheap. Scale it up 5% on hover, deepen the shadow for depth and add a subtle glow.
- Press feedback: when you click, scale down to 0.95x, then bounce to 1.05x and settle. That tactile overshoot is what makes it feel physical.
- Ripple: a circle that grows from the click point confirms the action where the finger landed, not in the abstract.
- Easing: the same motion on a linear curve feels robotic; on a spring curve (overshoot, then settle) it feels natural and fluid. One click, maximum satisfaction.
- The three together on a real pricing card: hover, press, ripple. Design is in the details.

## Do / Don't

- **Do:** give primary buttons a hover lift of about 5% with a deeper, slightly coloured shadow.
- **Do:** press to 0.95x and release through 1.05x on a spring curve; keep the whole cycle under half a second.
- **Do:** start the ripple at the pointer position and let it fade as it covers the button.
- **Don't:** animate with `linear`; it reads as robotic even when the values are right.
- **Don't:** put the lift, press and ripple on flat secondary buttons; the contrast is the point.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Before vs After | Flat grey Get Started vs the purple one; cursor moves from before to after. "Same button, different feeling." |
| 2 | 3s | Secret #1 Hover States | Without / With; hover lifts the purple button. Chips: Scale +5%, Shadow deepens, Subtle glow. |
| 3 | 18s | Secret #2 Press Feedback | Flat / Spring; 0.95x press to 1.05x bounce readout; pressed state. "Tactile feedback." |
| 4 | 30s | Secret #3 Ripple + Easing | No Ripple / Ripple with a ripple from the click; LINEAR (Robotic) vs SPRING (Natural) sliders. "One click. Maximum satisfaction." |
| 5 | 45s | Pricing card | PRO PLAN $29/mo card with all three on its Get Started button. Chips 1. Hover, 2. Press, 3. Ripple. |
| 6 | 55.5s | Outro | Want more design secrets? Follow for daily tips. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="pb">
  <button class="pb-btn" id="cta">Get Started</button>
</div>
<script type="module">
  import { PerfectButton } from './pattern.js';
  PerfectButton(document.getElementById('cta'), { hoverScale: 1.05, pressScale: 0.95, bounceScale: 1.05, ripple: true });
</script>
```

`PerfectButton(el, opts)` wires hover (CSS), press and release (spring bounce) and the ripple, with keyboard support; it returns `{ press, release, ripple }`. `ripple(el, x, y)` can be used on its own. `SPRING_EASE` and `LINEAR_EASE` are the two curves the sliders compare. `.pb-btn--flat` is the control, `.pb-btn--wide` the card-width variant.

## Where it belongs

Primary calls to action: sign up, get started, buy, submit. Not on secondary or destructive buttons, and never on links.
