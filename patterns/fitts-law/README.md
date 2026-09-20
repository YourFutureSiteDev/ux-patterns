# Fitts's Law

> The rule behind every great button: T = a + b × log₂(D / W + 1).

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DV84QvajG4R/) (14.9K views, Instagram only, no site page). Category: interaction.

## The rule

The time to reach a target grows with its distance and shrinks with its size. Make targets bigger (44pt minimum) and put them closer, ideally under the cursor or thumb, and the click gets faster without the user noticing why.

## Key insights

- Time to click follows T = a + b × log₂(D / W + 1): a small target 360px away reads as 9.6s, the same distance with a bigger target 5.4s, the bigger target close by 3.0s.
- Two levers only: make targets bigger, put them closer.
- On a phone the primary action belongs where the thumb already is. A "Buy Now" at the top of the screen tapped 12%; the same button pinned at the bottom tapped 34%.
- 32px icons are too small for fingers; 48px+ targets are comfortable. Apple's guideline is 44pt minimum.
- The distance trick reduces D to zero: right-click menus appear at the cursor, a floating action button stays within reach, inline editing edits in place with no modal.
- The best target is already under your cursor.

## Do / Don't

- **Do:** size every tap target to at least 44pt, keeping the visible glyph smaller if you like.
- **Do:** put the primary mobile action at the bottom of the screen, in thumb reach.
- **Do:** open menus and editors where the pointer already is.
- **Don't:** ship 20 to 32px icon buttons and call them tappable.
- **Don't:** park the primary action at the top of a phone screen.
- **Don't:** send users across the screen (or into a modal) for an action they could do in place.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Fitts's Law | Track with cursor, D span, small far target, W marker. Time to click 9.6s. |
| 2 | 4.5s | Bigger target | 72px "Click" target at the same distance: 5.4s. "Bigger target = faster clicks". Formula pill. |
| 3 | 7.5s | Closer target | Target moved next to the cursor: 3.0s. "Closer target = faster clicks". Cards: Make targets BIGGER / Put them CLOSER. |
| 4 | 12s | Secret 01: Size in action | Bad phone (Buy Now at the top) vs Good phone (big Buy Now at the bottom). |
| 5 | 16s | Tap rates | Thumbs on both buttons, reach line on the bad phone. 12% tap rate vs 34%. |
| 6 | 21s | Touch target sizes | 32px targets "Too small for fingers" vs 48px+ "Comfortable tap targets". Apple's guideline: 44pt minimum. |
| 7 | 27s | Secret 02: The distance trick | Right-click menu: menu appears at cursor, D = 0. |
| 8 | 30s | All three tricks | Floating Action Button (always within reach), Inline editing (no modal needed). "The best target is already under your cursor". |

The outro ("Design smarter, not harder" + Follow) is a pure CTA and is not built. The word-by-word subtitle pill under each scene is reproduced for the shot frame.

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="fl">
  <div class="fl-track" id="track">
    <i class="fl-track__line"></i><i class="fl-track__d"></i><b class="fl-track__dl">D</b>
    <svg class="fl-track__cursor" style="left:66px">…pointer…</svg>
    <button class="fl-target" style="left:417px;width:72px;height:42px;top:7px">Click</button>
    <i class="fl-track__wline"></i><b class="fl-track__wl">W</b>
  </div>
  <div class="fl-time"><span>Time to click</span><b id="t">5.4s</b></div>
</div>
<script type="module">
  import { FittsTrack, fittsTime, meetsTouchTarget } from './pattern.js';
  FittsTrack(document.getElementById('track'), { timeEl: document.getElementById('t') });
</script>
```

`fittsTime(D, W)` returns the predicted seconds. `FittsTrack(root, { timeEl, onChange })` makes the target draggable (move to change D, drag its right edge to change W) and keeps the D/W markers and readout in sync, firing `fl:change`. `meetsTouchTarget(el, 44)` checks a control against the 44pt minimum.

## Where it belongs

Any primary button, mobile CTA placement, icon toolbar, context menu or inline editor. Use it in design review to justify a 44pt hit area and a bottom-of-screen primary action.
