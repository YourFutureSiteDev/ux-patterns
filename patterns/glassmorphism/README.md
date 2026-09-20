# Glassmorphism

> 4 lines of CSS. Pour in transparency, mix in the blur, a pinch of border, finish with shadow.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DVdixdNjGhC/) (45.4K views). Category: visual.

## The rule

A glass surface is a translucent white fill over a colourful backdrop, blurred behind, edged with a faint white border and lifted by a soft shadow. Four declarations, in that order.

## Key insights

- Pour in transparency: `background: rgba(255,255,255, 0.35)`. The card has to let the colours behind it through, or nothing else works.
- Mix in the blur: `backdrop-filter: blur(20px)`. The blur is what turns "see-through" into "frosted"; without it the content behind competes with the content in front.
- A pinch of border: `border: 1px solid rgba(255,255,255, 0.5)`. A half-white hairline reads as the lit edge of a pane of glass and separates the card from the backdrop.
- Finish with shadow: `box-shadow: 0 8px 32px rgba(0,0,0,0.15)`. A soft, low-opacity shadow floats the pane without turning it into a dark slab.
- Glass only works on a busy, colourful backdrop (gradients, blobs, imagery). On a flat colour there is nothing to blur and the effect disappears.
- The same four lines scale from a music player to weather, message, profile and timer widgets: it is a surface treatment, not a component.

## Do / Don't

- **Do:** keep the fill white at around 0.3 to 0.4 alpha on dark backdrops, so text stays readable.
- **Do:** put something colourful behind the glass, or the blur has nothing to show.
- **Do:** use a translucent white border, not a solid one; the edge should glow, not outline.
- **Don't:** stack many glass layers; each blur costs GPU time and the effect muddies.
- **Don't:** use a heavy dark shadow; it fights the lightness of the pane.
- **Don't:** skip `-webkit-backdrop-filter` if Safari matters.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 4 Lines of CSS. | Finished glass music player tilted over colour blobs. |
| 2 | 3s | 01 / 04 Pour in transparency | The card before any glass: solid dark. |
| 3 | 4.5s | 01 / 04 Pour in transparency | Opacity slider at 0.35, `background: rgba(255,255,255, 0.35);`, one box ticked. Live: drag the slider. |
| 4 | 12s | 02 / 04 Mix in the blur | Blur slider at 20px, `backdrop-filter: blur(20px);`, two ticked. |
| 5 | 21s | 03 / 04 A pinch of border | `border: 1px solid rgba(255,255,255, 0.5);`, three ticked. |
| 6 | 30s | 04 / 04 Finish with shadow | Shadow slider at 0.15, `box-shadow: 0 8px 32px rgba(0,0,0,0.15);`, all four ticked. |
| 7 | 39s | Save for later | Weather, New Message, Midnight Dreams, Sarah Chen, Focus Time widgets, all glass. |
| 8 | 45s | Save for later | glass.css window with the six-line `.glass-card` rule typing in. |
| 9 | 48s | Outro | "Save this recipe", glass Follow pill, @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="gm">
  <div class="gm-glass gm-player" id="card">…</div>
  <div class="gm-slider" id="blur">…</div>
</div>
<script type="module">
  import { Glass, GlassSlider } from './pattern.js';
  const glass = Glass(document.getElementById('card'), { opacity: .35, blur: 20, border: .5, shadow: .15 });
  GlassSlider(document.getElementById('blur'), glass, 'blur', css => console.log(css));   // "backdrop-filter: blur(24px);"
  glass.step(2);          // preview with only the first two lines applied
  glass.css();            // the full .glass-card rule as text
</script>
```

`.gm-glass` is the four lines as one class driven by `--gm-glass`, `--gm-blur`, `--gm-edge`, `--gm-shadow`. `Glass(el)` sets those tokens; `step(n)` applies the first n lines; `GlassSlider` binds a slider to one line. The `recipe` export lists the four lines with labels, ranges and defaults.

## Where it belongs

Overlays and widgets that sit on rich backdrops: media players, notification cards, dashboard tiles, hero panels over gradients. Not for dense data UI or anything on a flat background.
