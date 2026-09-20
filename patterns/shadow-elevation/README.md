# Shadow Elevation

> Shadows aren't decoration. They encode hierarchy and depth.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/shadow-elevation](https://www.designmotionhq.com/patterns/shadow-elevation) · [Instagram](https://www.instagram.com/reel/DWRLx9zsJnx/) (13.8K views). Category: visual.

## The rule

Build depth from three stacked shadows (a tight contact shadow, a mid-distance shadow, a wide tinted glow) plus a small 3D lift, and reserve the strongest elevation for the element that matters most.

## Key insights

- Real depth comes from stacking multiple shadows, not one blur: a tight contact shadow, a mid-distance shadow, and a wide soft spread shadow layered together.
- The tight contact shadow (~0 1px 3px) anchors the element to the surface. It is what makes the card feel physically placed rather than floating.
- A subtle coloured glow (a low-opacity blur in an accent hue) adds a premium, branded feel that plain black shadows can't.
- Match the glow colour to the product context: purple for creative tools, blue for fintech, green for health, so elevation reinforces brand identity.
- A 3D lift (perspective + a small rotateX + translateZ) adds genuine depth beyond a flat drop shadow, making the surface read as tilted toward the viewer.
- Elevation is a hierarchy signal: the more elevated an element, the more important it reads, which is why a premium tier looks lifted while a basic one stays flat.

## Do / Don't

- **Do:** layer three shadows (tight contact, mid-distance, wide soft spread) for believable depth.
- **Do:** tint the glow to your brand accent so elevation reinforces identity.
- **Do:** reserve the strongest elevation for the elements that matter most.
- **Don't:** rely on a single flat drop shadow for every surface.
- **Don't:** treat shadows as decoration; they communicate depth and hierarchy.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Shadow Layers | Basic $9 card sits flat; Pro $29 card floats with contact, mid and purple glow. FLAT vs FLOATS. |
| 2 | 3s | 3 Layers of Depth: contact | Premium Card with only the contact shadow. `0 1px 3px rgba(0,0,0,0.4)`, "Tight shadow anchors it". |
| 3 | 6s | 3 Layers of Depth: glow, elevation | Glow `0 0 60px rgba(139,92,246,0.15)` and `perspective(1000px) rotateX(2deg) translateZ(20px)` added. |
| 4 | 10.5s | Combined CSS | Card lifts up; the full box-shadow and transform block appears below. |
| 5 | 15s | Tint Your Glow: creative | Creative App dashboard card with purple glow, `rgba(139, 92, 246, 0.35)`. |
| 6 | 18s | Tint Your Glow: all three | Creative (purple), Fintech (blue, `rgba(59, 130, 246, 0.35)`), Health (green, `rgba(34, 197, 94, 0.35)`). |

The "Follow + Save for more" outro is a pure CTA with no UI and is not rebuilt.

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="se">
  <div class="se-card" id="card">…</div>
  <div class="se-app se-app--blue">…</div>
</div>
<script type="module">
  import { Elevation, tintGlow, tints } from './pattern.js';
  const e = Elevation(document.getElementById('card'), { glow: 'rgba(139,92,246,0.15)' });
  e.contact().glow().lift();          // or e.all(); e.css gives the combined rule
  tintGlow(document.querySelector('.se-app--blue'), tints.fintech);
</script>
```

`Elevation(el, opts)` adds the layers one at a time (`contact`, `glow`, `lift`, `all`, `reset`) and fires `se:elevation` on each change; `.css` returns the combined `box-shadow` and `transform`. `tintGlow(el, rgba)` swaps only the glow colour. The classes `.se-card--contact`, `.se-card--glow`, `.se-card--lift` and `.se-app--purple|blue|green` are the static equivalents.

## Where it belongs

Pricing tiers, feature cards, dashboards, modals, hover-lifted cards: any surface whose importance should be read at a glance. Keep secondary surfaces flat so the elevated one stays the focal point.
