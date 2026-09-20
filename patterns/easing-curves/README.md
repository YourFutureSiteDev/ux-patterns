# Easing Curves

> Same distance, different feel: the easing curve is what decides how motion reads.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/easing-curves](https://www.designmotionhq.com/patterns/easing-curves) (no Instagram post). Category: motion.

## The rule

Keep the distance and the duration, change only the curve, and the motion reads completely differently. Linear is mechanical, ease-out settles like a real object, spring overshoots and feels alive. spring > ease > linear. Always. Use the same handful of curves everywhere so the interface feels like one thing.

## Key insights

- An easing curve maps how a value changes over time. Keep the same distance and duration but swap the curve, and the motion **feels** completely different — that shape is what your eye actually reads.
- **Linear** moves at a constant speed. It looks mechanical and cheap, so reserve it for continuous motion like spinners or marquees — never for UI that starts and stops.
- **Ease-out** starts fast then decelerates into place. It's the safest default for elements entering the screen because it mirrors how real objects settle.
- **Spring** overshoots slightly then settles, adding a bounce that reads as alive and premium — ideal for button presses, modals, and playful confirmations.
- Apply the same handful of curves everywhere: button press, card cascade, sheet open. Consistent easing is a big part of why an interface feels coherent instead of stitched together.
- Stagger list and card entrances a few frames apart so they cascade in, rather than snapping onto the screen as one rigid block.

## Do / Don't

- **Do:** Default to ease-out for elements entering the screen so they decelerate naturally into place.
- **Do:** Add a subtle spring overshoot to presses, modals, and confirmations to make the UI feel alive.
- **Do:** Stagger card and list entrances a few frames apart for a cascade instead of a single hard snap.
- **Don't:** Reach for linear easing on UI that starts and stops — it reads as mechanical and cheap.
- **Don't:** Push spring stiffness or bounce so high the element wobbles; a little overshoot sells premium, too much feels broken.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Same distance. Different feel. | Three sliders racing the same 567px: linear (grey), ease-out (blue), spring (green ✓). |
| 2 | 4.5s | Button press | Three Submit buttons pressing with each curve, the curve graph under each, "↑ the bounce". |
| 3 | 9s | Card entrance | Three columns of five cards cascading in with each curve. |
| 4 | 13.5s | Modal open | Three phones, bottom sheet sliding up: linear, ease-out, spring (premium). |
| 5 | 18s | The curve shapes the feel | Each curve drawn from its real function beside a ball dropping down a track with it. |
| 6 | 24s | Outro | spring > ease > linear. Always. @designmotionhq |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ec">
  <button class="ec-btn ec-green" id="go">Submit</button>
  <svg class="ec-graph ec-green" viewBox="0 0 188 134" data-curve="spring"><path/></svg>
</div>
<script type="module">
  import { EASE, curvePath, slide, press, springEasing } from './pattern.js';
  press(go, { easing: EASE.spring.css });                       // scale down and bounce back
  slide(card, { y: 40, easing: EASE.easeOut.css, duration: 400 }); // entrance
  document.querySelector('[data-curve] path').setAttribute('d', curvePath(EASE.spring.fn, 188, 134));
  const softer = springEasing({ stiffness: 400, damping: 30 });  // a CSS linear() string
</script>
```

`EASE` holds the three curves as CSS strings (`linear`, `cubic-bezier(.16,1,.3,1)`, and a spring sampled into `linear()`) plus the matching JS functions, so graphs and animations always agree. `pattern.css` exposes them as `--ec-linear`, `--ec-ease-out`, `--ec-spring`; the `.ec-grey`, `.ec-blue`, `.ec-green` classes set `--c` (colour) and `--e` (curve) together for buttons, cards, sheets and tracks.

## Where it belongs

Every transition that starts and stops: presses, entrances, sheets, cascades. Linear only for spinners, marquees and progress that must read as constant.
