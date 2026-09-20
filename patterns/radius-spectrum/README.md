# Radius Spectrum

> One CSS property changes everything: the psychology behind rounded corners.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DVZOM4HDJif/) (70.9K views, no site page). Category: visual.

## The rule

Pick border-radius for the brand, not by taste. 0px reads as authority, 8px as professional, 20px as friendly, a full pill as playful. Sharp corners snag the eye; rounded ones let it flow through. Stop guessing radius and match it to who the product is for.

## Key insights

- A single value, border-radius, moves the same card from "feels corporate" at 2px to "feels friendly" at 40px. Nothing else on the card changes.
- Sharp corners create a 90 degree stop. Your eye snags on the corner before it moves on.
- Round them out and the eye flows right through the curve. Motion designers use the corner as a path, not a wall.
- The spectrum: 0px Authority (banks, law firms), 8px Professional (SaaS, enterprise), 20px Friendly (consumer apps), 50% Playful (social, Gen Z). Every pixel changes the vibe.
- Radius is a brand decision. Zero pixels says authority, twenty says friendly, a pill says social. Match it to your brand for impact.

## Do / Don't

- **Do:** choose one radius scale for the product and apply it to cards, buttons, chips and inputs together.
- **Do:** go sharper (0 to 8px) for trust and authority, rounder (16 to 24px) for warmth, full pill for play.
- **Do:** keep the accent colour and the radius telling the same story (cool blue with sharp, warm orange with round).
- **Don't:** mix a 0px card with a pill button; the vibes fight.
- **Don't:** pick a radius because it looks nice in isolation; test it on the whole screen.
- **Don't:** round a corner past half the element's height; anything above that is a pill and reads as playful whether you meant it or not.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 2px, feels corporate | Preview card with corner brackets, blue avatar and button, slider at 2px. |
| 2 | 1.5s | 40px, feels friendly | Same card at 40px: circle avatar, pill button, orange glow. "The psychology behind rounded corners." |
| 3 | 4.5s | Sharp corners create | A square card corner on a line grid. |
| 4 | 6s | Sharp corner = Eye snags | 90 degree corner in red with a pulsing target where the eye stops. |
| 5 | 7.5s | Rounded = flows | 30px green dashed curve with dots flowing through it. |
| 6 | 10.5s | The Spectrum: 0px | Authority. Banks, law firms. Square card and button. |
| 7 | 13.5s | 8px | Professional. SaaS, enterprise. Blue. |
| 8 | 16.5s | 20px | Friendly. Consumer apps. Orange. |
| 9 | 19.5s | 50% | Playful. Social, Gen Z. Pink pill. |
| 10 | 22.5s | Outro | Stop guessing radius. Match it to your brand. Follow @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="rs" id="radius">
  <div class="rs-feel">Feels corporate</div>
  <div class="rs-preview"><div class="rs-preview__avatar"></div><button class="rs-preview__btn"></button></div>
  <div class="rs-slider">
    <div class="rs-slider__head"><span class="rs-slider__label">border-radius:</span><span class="rs-slider__value">2px</span></div>
    <input type="range" min="0" max="40" value="2">
  </div>
</div>
<script type="module">
  import { RadiusSpectrum, SpectrumStepper, SPECTRUM } from './pattern.js';
  const rs = RadiusSpectrum(document.getElementById('radius'), { value: 2 });
  rs.animateTo(20, 800);   // every .rs- element reads --rs-r and --rs-accent
</script>
```

`RadiusSpectrum(root)` drives `--rs-r`, `--rs-accent` and the feeling chip from one value (0 to 40px); `set(px)` and `animateTo(px, ms)` are the API, `rs:change` the event. `SpectrumStepper(root)` steps a `.rs-spec` card through the four named stops in `SPECTRUM`. `feelingFor(px)` maps a radius to its label and accent.

## Where it belongs

Design tokens and brand setup: decide the radius scale once, at the start, alongside colour and type. Then cards, buttons, inputs, chips and modals all inherit it.
