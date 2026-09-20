# Depth Layers

> Same layout, same colors: three properties turn flat cards into real depth.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/depth-layers](https://www.designmotionhq.com/patterns/depth-layers) (no Instagram post). Category: visual.

## The rule

Do not redesign to add depth. Keep the layout and the palette and add three things: layered shadows (2px tight, 12px spread, 32px ambient), parallax scroll (background slow, foreground fast) and a z-translation on hover (`translateZ(20px) scale(1.03)`).

## Key insights

- You don't need to redesign to add depth. **Same layout, same colors**: three CSS properties do the whole job.
- **Layered shadows** beat a single drop shadow: stack a tight one (~2px), a mid spread (~12px), and a large ambient one (~32px) to mimic how real light falls off.
- **Parallax scroll** sells distance by moving layers at different speeds: background slow, midground medium, foreground fastest (roughly 1x / 2.5x / 5x).
- **Z-translation on hover** makes an element react to the cursor: lift it toward the viewer with `translateZ` plus a slight `scale(1.03)` and a soft glow.
- Depth also lives in the border and shadow intensity, not just position: brightening the border on hover reinforces the lift.
- Stack all three techniques and the interface reads as fully dimensional while still feeling flat and clean.

## Do / Don't

- **Do:** Stack multiple shadows at increasing blur and offset instead of one flat drop shadow.
- **Do:** Keep hover lifts subtle: a few pixels plus ~3% scale reads as physical, not cartoonish.
- **Do:** Vary scroll speed per layer so background, mid, and foreground imply real distance.
- **Don't:** Redesign the layout or palette to fake depth when three properties already do it.
- **Don't:** Push parallax offsets or hover scale so far they pull attention off the content.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Same layout. Same colors. | FLAT (bordered, grey) vs DEPTH (shadowed, white) lists. "3 properties. That's it." |
| 2 | 4.5s | Layer 1 · Layered Shadows | Four cards, the first note: 2px tight. |
| 3 | 9s | Layer 1 · the three shadows | 2px tight, 12px spread, 32px ambient; purple dots on every card. |
| 4 | 13.5s | Layer 2 · Parallax Scroll | Hero Section (background, 1x) and the cards (foreground) scroll at different speeds. |
| 5 | 13.5s (18s) | Layer 2 · mid scroll | Same scroll, 4.5s in, with the 1x BG / 2.5x MID / 5x FG legend. |
| 6 | 13.5s (21s) | Layer 2 · late scroll | Same scroll, 7.5s in; the hero has gone behind the cards. |
| 7 | 22.5s | Layer 3 · Z-Translation on Hover | Dashboard lifted under the cursor. |
| 8 | 22.5s (27s) | Layer 3 · Messages | Messages lifted; `transform: translateZ(20px) scale(1.03)`. |
| 9 | 22.5s (30s) | Layer 3 · Profile | Profile lifted. |
| 10 | 33s | Shadows + Parallax + Z-Translation | The finished list: Dashboard / Analytics overview, Messages / 3 unread, Settings / Preferences, Profile / Edit account. |

The "Save this." outro is a plain CTA with no UI and is not built.

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dl">
  <div class="dl-hover" id="list">
    <div class="dl-card">Dashboard</div><div class="dl-card">Messages</div>
  </div>
  <div class="dl-px" id="scroll">
    <div class="dl-px__layer" data-speed="1"><div class="dl-px__bg">Hero Section</div></div>
    <div class="dl-px__layer" data-speed="2"><div class="dl-px__fg">Dashboard</div></div>
  </div>
</div>
<script type="module">
  import { layeredShadow, Parallax, ZLift, LAYERED_SHADOW } from './pattern.js';
  ZLift(document.getElementById('list'));               // hover lifts a card: translateZ(20px) scale(1.03)
  Parallax(document.getElementById('scroll')).play(21); // layers move at data-speed x the scroll
  layeredShadow(el, { tight: 2, spread: 12, ambient: 32 });
</script>
```

`LAYERED_SHADOW` is the three-stop shadow string; `layeredShadow(el, opts)` applies it. `Parallax(root)` returns `{ scrollTo(px), play(pxPerSecond), stop }` and moves every `[data-speed]` layer. `ZLift(root)` wires pointerenter/leave on each `.dl-card` and exposes `hover(i)` / `clear()`.

## Where it belongs

Card lists, nav panels, settings groups, dashboards: anywhere a stack of flat panels needs to read as layered without changing the design.
