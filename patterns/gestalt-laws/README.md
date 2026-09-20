# Gestalt Laws

> Same elements. One is chaos. The other clicks instantly.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/gestalt-laws](https://www.designmotionhq.com/patterns/gestalt-laws). Category: visual.

## The rule

The brain groups and completes automatically. Work with the five laws (closure, similarity, continuity, figure-ground, common region) and a layout reads as organised before anyone consciously looks at it.

## Key insights

- Closure: the eye completes incomplete shapes, so icons and outlines still read even with gaps; you don't need every line drawn for a shape to register.
- Similarity: elements sharing a property (colour, shape, size) read as one group; recolouring rows instantly splits a flat grid into Navigation, Content and Actions.
- Continuity: the eye follows the smoothest path, so aligning items on a shared axis lets it flow, while scattered placement forces it to jump around erratically.
- Figure-ground: blurring and dimming the background pushes a modal forward as the focal figure, which is what makes a dialog feel deliberate instead of floating.
- Common region: a shared border or container groups elements even when they sit far apart; wrapping settings in cards signals belonging without moving them closer.
- These laws are pre-attentive: the brain groups and completes automatically, so working with them makes a layout feel instantly organised rather than busy.

## Do / Don't

- **Do:** give related items a shared property (colour, shape or size) so they read as one group at a glance.
- **Do:** align related controls on a common axis so the eye flows down a single clean path.
- **Do:** wrap loosely placed elements in a bordered card when proximity alone can't group them.
- **Don't:** scatter navigation or list items at varied angles and positions; the eye jumps and nothing reads as connected.
- **Don't:** lean on a modal alone without dimming what's behind it; it competes with the background instead of standing out.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 5 Gestalt Laws | Kanizsa triangle: three pac-man discs, "Your brain sees a shape that doesn't exist." |
| 2 | 6s | Secret 01 Closure | A ring drawn 83% of the way round. "You see a circle." |
| 3 | 12s | Secret 01 Closure | Home, search, heart and person icons with gaps in their strokes. |
| 4 | 15s | Secret 02 Similarity | 4x4 grid of identical grey dots. "16 identical elements". |
| 5 | 21s | Secret 02 Similarity | Rows recoloured blue / green / purple: Navigation, Content, Actions. "Change one property. Instant hierarchy." |
| 6 | 24s | Secret 03 Continuity | Home, Products, About, Blog, Contact scattered at angles. "Scattered. No flow." |
| 7 | 27s | Secret 03 Continuity | The same pills aligned on one axis with a connecting path. "Aligned. Effortless." |
| 8 | 30s | Secret 04 Figure-ground | A dashboard mock, slightly soft. |
| 9 | 33s | Secret 04 Figure-ground | App blurred and dimmed, "Delete Project?" dialog with Cancel / Delete. "Instant focus. Zero confusion." |
| 10 | 39s | Secret 05 Common region | Icons, chips and toggles scattered. "9 elements. No structure." |
| 11 | 40.5s | Secret 05 Common region | The same nine gathered into Profile, Notifications, Privacy cards. "Cards create meaning." |
| 12 | 43.5s | Outro | 01 to 05 list. "Save this for your next project". |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="gl">
  <div class="gl-app" id="app">…</div>
  <div class="gl-modal" id="modal" hidden>…</div>
  <div class="gl-grid" id="grid">…16 .gl-dot…</div>
</div>
<script type="module">
  import { FigureGround, Similarity, Continuity, Ring, Toggle } from './pattern.js';
  const fg = FigureGround(document.getElementById('app'), document.getElementById('modal'));
  fg.open();                                                     // blur + dim the app, pop the dialog
  Similarity(document.getElementById('grid'), { nav: [0], content: [1, 2], actions: [3] }).group();
  Continuity([...document.querySelectorAll('.gl-pill')]).align();
  Ring(document.getElementById('ring')).set(0.83);
</script>
```

`Ring(root).set(fraction)` draws part of a circle. `Similarity(grid, groups)` colours rows into groups. `Continuity(pills).align()` moves scattered pills onto one axis. `FigureGround(app, modal)` blurs the ground when the figure opens. `CommonRegion(scene, rows)` draws bordered cards around loose controls. `Toggle(btn)` is the switch.

## Where it belongs

Any screen with more than a handful of controls: settings pages, nav menus, icon sets, confirm dialogs. The laws are the reason a layout feels calm; use them before adding more visual weight.
