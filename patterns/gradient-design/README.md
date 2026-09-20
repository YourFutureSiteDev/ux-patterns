# Gradient Design

> Why your gradients look cheap

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/gradient-design](https://www.designmotionhq.com/patterns/gradient-design) · [Instagram](https://www.instagram.com/reel/DWrDNSNjFFC/) (98.6K views). Category: visual.

## The rule

Keep the two hues within 60° of each other, run the gradient at 135°, use a soft mesh of a few colour points as ambiance behind content rather than a wash on top of it, and put the gradient on one headline only. Body text stays solid.

## Key insights

- Cheap-looking gradients usually travel too far across the hue wheel. Neighbouring hues (violet to blue, teal to cyan) blend cleanly; opposites (red to green, orange to blue) create a muddy grey dead zone in the middle.
- Direction sets the mood: 0° reads flat, 135° (top-left to bottom-right) is the premium angle.
- Gradients work best as ambiance, not surface: a soft mesh of two or three colour points behind content beats a full-bleed linear wash on top of it.
- Keep lightness moving in one direction; a gradient that gets darker, lighter, then darker again reads as banding.
- One gradient headline is a statement. A rainbow headline and rainbow body copy are unreadable. Keep body text solid.
- Subtle grain on top of a gradient hides banding on cheap displays and adds perceived texture.

## Do / Don't

- **Do:** stay within 60° of hue travel, run it at 135°, add 2 to 3% noise, and test on a low-quality screen.
- **Do:** use a mesh (three colour points) as a background glow behind a hero, then keep the card surface solid.
- **Do:** put the gradient on one headline and keep the CTA gradient in the same pair.
- **Don't:** put body text directly on a gradient's mid-transition zone. Contrast is unpredictable there.
- **Don't:** run 180° apart hues (red to green) or mix a rainbow into copy.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Cheap vs Premium | Two "Get Started" buttons: purple-orange-blue (cheap) vs violet-blue (premium). |
| 2 | 3s | Rule 01: Adjacent Hues | The hue wheel with a 60° wedge; the harmonious card slides in. |
| 3 | 7.5s | Rule 01: pairs | 60° apart "Harmonious" (violet to magenta) vs 180° apart "Clashing" (red to green). |
| 4 | 15s | Rule 02: Direction | The same pair at 0° (flat), 45°, 90°. |
| 5 | 24s | Rule 02: 135° | Everything else dims; 135° lights up: "The Premium Angle". |
| 6 | 30s | Rule 03: Linear | One 600px panel, linear, 2 colors. |
| 7 | 33s | Rule 03: Mesh | The same panel as a mesh of 3 colour points, then the Acme Creative Studio hero card that uses one. |
| 8 | 39s | Rule 04: Unreadable | Rainbow "Premium Design" headline and rainbow body copy. |
| 9 | 42s | Rule 04: Statement | Gradient headline, solid body. "✓ STATEMENT". |
| 10 | 45s | Rule 04: annotated | "Gradient headline ⟶", "⟵ Solid body text", Start Creating CTA. |
| 11 | 48s | Outro | 4 Gradient Rules: 60° Hues, 135° Direction, Mesh Points, Text Only. @designmotionhq, Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="gd">
  <button class="gd-btn" style="position:static;width:240px;height:56px">Get Started</button>
  <h1 class="gd-h gd-text-grad" style="position:static">Premium Design</h1>
  <div class="gd-mesh is-mesh" id="mesh" style="position:relative;width:600px;height:360px"></div>
</div>
<script type="module">
  import { hueDistance, isHarmonious, gradient, Mesh } from './pattern.js';
  isHarmonious(262, 217);   // violet vs blue: true (45° apart)
  isHarmonious(0, 120);     // red vs green: false
  gradient('#8b5cf6', '#3b82f6', 135);
  Mesh(document.getElementById('mesh'), [
    { x: .25, y: .3, color: '#8b5cf6' }, { x: .75, y: .6, color: '#3b82f6' }, { x: .5, y: .85, color: '#a78bfa', r: 90 },
  ]).mesh();
</script>
```

Tokens: `--gd-a` and `--gd-b` are the pair (60° apart); `--gd-grad` is the 135° gradient built from them. `.gd-text-grad` clips the gradient to text. `Mesh(root, points)` paints blurred blobs and returns `{ linear(), mesh() }` to flip between a flat 2-colour fill and the mesh. `WheelWedge(wheel, from, span)` draws the wedge on a `.gd-wheel`.

## Where it belongs

Hero backgrounds, primary CTAs, one display headline, brand glows behind cards. Never behind body copy, never across opposite hues, never as the only thing separating a section from the page.
