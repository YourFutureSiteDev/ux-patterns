# Optical Corrections

> 5 optical corrections. Math is not always right. Your eyes are the judge.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DVqncGUjLec/) (23.9K views). Category: visual.

## The rule

When the mathematically correct value looks wrong, the eye wins. Shift the play triangle right, make circles bigger than squares, keep nested corners concentric, drop a font weight in dark mode, and centre text on its cap height instead of its line box.

## Key insights

- Play button: a triangle centred on its bounding box looks off to the left. Shift it right by about 8% of the box it sits in (`shift += bbox_width × 0.08`) so its visual centroid lands on the centre. YouTube, Spotify and Apple all do it.
- Shape sizing: a 200px circle beside a 200px square reads smaller. Make the circle about 13% larger (`circle_size = square × 1.13`); the brain reads area, not pixels. Icon grids use this.
- Border radius: an inner element with the same radius as its container gets pinched corners. Use `inner = outer − padding` (32px outer, 14px gap, 18px inner) so the curves stay concentric. Apple added this to the iOS guidelines.
- Dark mode weight: light text on a dark background bleeds outward (the irradiation illusion), so weight 600 looks heavier than the same weight on white. Drop one step in dark mode: `dark_mode: weight − 100`.
- Text centering: CSS centres the line box, which includes descender space below the baseline, so the letters sit low. Nudge them up about 2px so the cap height is centred.

## Do / Don't

- **Do:** offset play icons, arrows and other asymmetric glyphs toward their visual weight, not their bounding box.
- **Do:** scale circles and diamonds up relative to squares of the "same" size in icon sets.
- **Do:** compute nested radii from the outer radius minus the padding.
- **Do:** reduce font weight by one step when the same text moves to a dark theme.
- **Don't:** trust `align-items: center` for button labels; check the cap height and nudge.
- **Don't:** reuse one radius token for a card and the button inside it.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Big play circle with crosshair and bbox: "✓ Mathematically perfect." then the triangle shifts right: "✓ Optically correct." |
| 2 | 4.5s | #1 Play Button | bbox center (pink) vs visual centroid (green), `shift += bbox_width × 0.08`, YouTube, Spotify, Apple note. |
| 3 | 19.5s | #2 Shape Sizing | 200px square vs 200px circle ("✗ Circle looks smaller"), circle grows to 226px, `circle_size = square × 1.13`. |
| 4 | 31.5s | #3 Border Radius | ×4 corner diagram plus nested Get Started button: inner 32px pinched vs inner 18px smooth, `inner = outer − padding`. |
| 5 | 43.5s | #4 Dark Mode Weight | The quick brown fox at 600/600 ("✗ Dark mode looks heavier") then 600/500, `dark_mode: weight − 100`. |
| 6 | 55.5s | #5 Text Centering | Get Started pill: text sits too low (descender space) vs cap-height aligned, `padding-top: +2px`. |
| 7 | 64.5s | Summary | 5 optical corrections list: Play Button, Shape Sizing, Border Radius, Font Weight, Text Center. Your eyes are the judge. |
| 8 | 70.5s | Outro | More design secrets? @designmotionhq, + Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="oc">
  <button class="oc-play" id="play" style="width:64px;height:64px"><span class="oc-play__icon" style="width:18px;height:18px"><svg viewBox="0 0 58 58"><path d="M1 1.5 57 29 1 56.5z"/></svg></span></button>
</div>
<script type="module">
  import { OpticalPlay, opticalCircle, NestedRadius, applyDarkModeWeight, capHeightCenter } from './pattern.js';
  OpticalPlay(document.getElementById('play'), { box: 64 }).correct();   // shifts the triangle 5px right
  opticalCircle(24);                                                     // 27: the circle icon size to pair with a 24px square
  NestedRadius(card, card.firstElementChild, { outer: 24, gap: 12 });    // inner radius 12
  applyDarkModeWeight(heading, 600);                                     // 500 when the OS is in dark mode
  capHeightCenter(button, 2);
</script>
```

`opticalShift(boxWidth, ratio)`, `opticalCircle(square, k)`, `innerRadius(outer, padding)` and `darkModeWeight(weight, step)` are the pure rules; the capitalised helpers apply them to elements. `CountUp` drives the 200px to 226px readout in the demo.

## Where it belongs

Icon buttons with asymmetric glyphs, icon sets mixing circles and squares, any card with a button or image inside it, dark-theme typography, and every pill or button with a text label.
