# Animation Timing

> Same modal, two timings: one feels premium, one feels broken. It's all milliseconds.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/animation-timing](https://www.designmotionhq.com/patterns/animation-timing) · [Instagram](https://www.instagram.com/reel/DYAEELCKCp1/) (17.5K views). Category: motion.

## The rule

Five numbers cover almost every UI animation: entrances land at 200-300ms with an ease-out, exits run about 40% faster, press feedback fires under 100ms, attention-grabbing motion takes 500-800ms with a bounce, and list items stagger 50ms apart. Save the numbers; the feel follows.

## Key insights

- **Entrances** land best at 200–300ms with a cubic ease-out — fast enough to feel responsive, slow enough to read as deliberate.
- **Exits** should be faster than entrances: pair a 250ms entrance with a ~150ms exit so dismissals feel snappy instead of dragging.
- **Feedback** on taps and button presses must fire in under 100ms — anything slower reads as lag, even when the action itself is instant.
- **Attention**-grabbing motion like notifications can run longer, 500–800ms, and use a bounce or overshoot to pull the eye.
- **Stagger** list items about 50ms apart — 30ms blurs them into one blob, 100ms makes the whole list crawl in.
- Match the easing curve to intent: ease-out for entrances, and reserve springs and bounce for moments that genuinely need attention.

## Do / Don't

- **Do:** Use ease-out curves for entrances so motion decelerates into place
- **Do:** Make exits roughly 40% faster than their entrance so dismissals feel instant
- **Do:** Keep tap and press feedback under 100ms so the interface feels alive
- **Don't:** Stretch entrances past ~300ms — they start to feel sluggish and in the way
- **Don't:** Use symmetric in/out timing — a matched-length exit feels like the UI is dragging
- **Don't:** Reach for linear easing on entrances — it reads mechanical and cheap

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Two phones, same Confirm dialog, 500ms vs 250ms. |
| 2 | 3s | Secret 01 Entrance | Too fast 50ms, perfect 250ms, too slow 700ms modals looping in and out. |
| 3 | 12s | 200-300ms | "Page transitions. Modals. Panels." |
| 4 | 13.5s | Secret 02 Exit | Correct: in 250ms / out 150ms. Wrong: in 250ms / out 250ms. "Same speed = sluggish exit". |
| 5 | 21s | 250 in, 150 out | "Exits are 30% faster. The user already decided." |
| 6 | 24s | Secret 03 Feedback | Laggy 200ms, OK 100ms, instant 50ms "Click me" buttons with cursors. |
| 7 | 31.5s | <100ms | "Press. Hover. Toggle. The Doherty threshold — feels instant." |
| 8 | 34.5s | Secret 04 Attention | Smooth fade (boring) vs bouncy + shake (eye-catching) error toasts. |
| 9 | 40.5s | 500-800ms + bounce | Bell, "Errors. Alerts. Slow enough to notice." |
| 10 | 45s | Secret 05 Stagger | Three settings lists staggering at 30 / 50 / 100ms. |
| 11 | 51s | 50ms | "Lists. Menus. The sweet spot." |
| 12 | 52.5s | Cheat sheet | Entrance 250ms, Exit 150ms, Feedback <100ms, Attention 500-800ms + bounce, Stagger 50ms. |
| 13 | 55.5s | Outro | "Save these numbers." Follow @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="at">
  <div class="at-modal" id="modal" hidden>…</div>
  <button class="at-cta at-cta--green" id="go">Click me</button>
  <ul id="menu"><li class="at-item">Account</li><li class="at-item">Privacy</li></ul>
</div>
<script type="module">
  import { enter, exit, pressFeedback, attention, stagger, TIMING } from './pattern.js';
  enter(modal);                       // 250ms ease-out
  exit(modal);                        // 150ms, ~40% faster
  pressFeedback(go);                  // <100ms scale + brighten on pointerdown
  attention(errorToast);              // 650ms bounce + shake
  stagger(menu.children, { gap: 50 }); // 50ms apart
</script>
```

`TIMING` holds the five numbers and the two curves. Every helper uses the Web Animations API, respects `prefers-reduced-motion`, and returns the animation's `finished` promise. `pattern.css` also ships the looping demo keyframes (`at-cycle-*`, `at-toast-*`, `at-press`, `at-bounce`, `at-item`) used by the reel scenes.

## Where it belongs

Modals, sheets, toasts, dropdowns, buttons, lists and menus. Not for continuous motion (spinners, marquees) where duration is not a "feel" decision.
