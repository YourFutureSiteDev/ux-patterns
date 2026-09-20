# Buy Button CSS

> How Stripe designed a button that converts.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DUQqwPBDLhL/) (18.1K views). Category: visual.

## The rule

A buy button is four psychological layers of CSS stacked in order: colour for trust, shape for friendliness, depth for a premium feel, and motion for action. Strip them all and you get the browser's grey default; add them back one at a time and every line does a job.

## Key insights

- Colour = Trust. `background: #6366f1; color: white; padding: 20px 64px;` turns a grey default into something that reads as a brand, and the generous padding makes it feel deliberate.
- Shape = Friendly. `border-radius: 14px` softens the box, and `font-family: Inter; font-weight: 600; font-size: 28px` gives the label the weight of a decision rather than a form control.
- Depth = Premium. `box-shadow: 0 4px 20px rgba(99,102,241,0.4)` lifts the button off the page with a glow in its own colour, not a grey drop shadow.
- Motion = Action. `&:hover { transform: scale(1.05); }` makes the button answer the cursor, which is the cue that it will do something when pressed.
- The finished button back inside the checkout form is the same twelve lines. Every CSS choice is a psychological decision.

## Do / Don't

- **Do:** build the button in layers and be able to name what each layer is for.
- **Do:** tint the shadow with the button's own colour so depth reads as glow rather than dirt.
- **Do:** give the hover state a small, fast scale so the button feels responsive, not bouncy.
- **Don't:** ship the browser default; a grey outset box reads as "form", not "buy".
- **Don't:** pile on effects that have no job (gradients, borders, animations) once the four layers are in place.
- **Don't:** let the hover scale run past about 1.05 or the button starts to feel like a toy.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | "How Stripe designed a button that converts" over the Pay with Stripe checkout card. |
| 2 | 3s | The finished button | Gradient Buy Now with glow, and the full style.css beneath it. |
| 3 | 6s | Remove all CSS | The browser default: grey outset box, black system text, empty editor. |
| 4 | 12s | Color = Trust | background, color, padding typed in; the button turns flat #6366f1. |
| 5 | 21s | Shape = Friendly | border-radius 14px, Inter 600 28px; corners round, label gets weight. |
| 6 | 30s | Depth = Premium | box-shadow 0 4px 20px rgba(99,102,241,0.4); the button glows. |
| 7 | 36s | Motion = Action | &:hover { transform: scale(1.05) }; cursor on the button, button grows. Live: the button rebuilds itself layer by layer. |
| 8 | 42s | Back in the checkout | The finished button inside the Pay with Stripe card. "Every CSS choice is a psychological decision." |
| 9 | 48s | Outro | "What UI element should I decode next?" Follow @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="bb">
  <button class="bb-btn is-color is-shape is-depth is-motion">Buy Now</button>
</div>
```

The four layer classes are independent, so `is-color is-shape` is a flat rounded button and all four is the Stripe one. For the walkthrough:

```html
<script type="module">
  import { BuyButtonWalkthrough, applyLayers, LAYERS } from './pattern.js';
  applyLayers(btn, 2);                       // colour, shape, depth; no motion
  BuyButtonWalkthrough({ btn, body: editorPre, label }).run();   // types each layer's CSS and reveals it
</script>
```

`LAYERS` holds the label, class and CSS lines for each layer. `highlight(line)` and `renderCode(pre, lines)` draw the editor; `typeCode(pre, lines)` types it character by character.

## Where it belongs

The primary purchase or sign-up button on a checkout, pricing page or landing page. One per screen. Secondary actions stay flat so this one keeps its depth and motion to itself.
