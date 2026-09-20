# Button Feedback

> This button feels good. That's not an accident.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DUDy5gNDBVM/) (8,452 views). Category: feedback. Instagram-only reel: the insights and do/don't below are derived from the on-screen copy.

## The rule

A button that feels good does three invisible things: it eases (never moves linearly), it answers every press within a frame (ripple, glow, state change), and it anticipates (a small squash before the action, a spring after it). Without them, an app feels dead.

## Key insights

- Secret 1, easing: linear motion reads as robotic; ease-out motion decelerates like a real object and reads as alive. This is why cheap apps feel "off".
- Secret 2, feedback: silence equals anxiety. A button that does nothing when pressed leaves the user asking "...hello?". A ripple plus a "Confirmed!" state answers immediately.
- Secret 3, anticipation: Disney knew this in 1937. A squash before the move and a spring after it turns a flat, lifeless drop into a satisfying one.
- Put all three on one control (a "Send Payment" button that eases, squashes on press and flips to a green check) and the whole form feels finished.
- The details are felt, never seen: button pulse, notification slide-in, toggle overshoot, instant like/check feedback.

## Do / Don't

- **Do:** ease out every movement; use a spring or overshoot curve for knobs and toggles.
- **Do:** answer every press within a frame: ripple, glow, label change or a confirmed state.
- **Do:** squash slightly on pointer-down and spring back on release, so the control feels physical.
- **Do:** finish an action with a visible end state (green check) rather than just returning to idle.
- **Don't:** animate with linear timing.
- **Don't:** leave a pressed button silent while the request runs.
- **Don't:** stack all three effects on every control; reserve the full treatment for the primary action.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Blue toggle with four floating tiles. "This button feels good. That's not an accident." |
| 2 | 3s | Showcase: Button Pulse | Subscribe pill with an expanding ring. |
| 3 | 5.5s | Showcase: Notification | "Changes saved!" toast slides in. |
| 4 | 8s | Showcase: Toggle Switch | Toggle flips with overshoot. |
| 5 | 10s | Showcase: Instant Feedback | Pink heart and green check pop in. |
| 6 | 11.5s | Secret 1: Easing | Linear vs ease-out slider race, with Robotic and Alive curve graphs drawing underneath. |
| 7 | 19.5s | Secret 2: Feedback | "No response" Submit vs "With ripple" Submit that lights up and reads "Confirmed!". |
| 8 | 27s | Secret 3: Anticipation | No prep vs squash blobs, resting at the top. |
| 9 | 27s | Secret 3: Anticipation (landed) | Same blobs dropped onto the floor line, the blue one squashed. |
| 10 | 34.5s | Now watch them work together | Payment Details card, Send Payment button, Easing and Anticipation tags. |
| 11 | 34.5s | Confirmed | Button eases to green with a check, Feedback tag appears. |
| 12 | 40s | Without them, an app feels dead. | Text card. |
| 13 | 41.5s | Outro | "Want more UI secrets?" with a glowing Follow button. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="bf">
  <button class="bf-toggle" id="t"><div class="bf-toggle__knob"></div></button>
  <button class="bf-btn bf-btn--primary" id="submit">Submit</button>
  <button class="bf-pay__btn" id="pay"><span>Send Payment</span><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>
</div>
<script type="module">
  import { Toggle, ripple, squash, confirmButton, toast } from './pattern.js';
  Toggle(document.getElementById('t'));
  ripple(document.getElementById('submit')); squash(document.getElementById('submit'));
  confirmButton(document.getElementById('pay'), { request: () => fetch('/api/pay', { method: 'POST' }) });
</script>
```

`Toggle` flips `.is-on` with an overshoot curve. `ripple` spawns a ripple at the pointer and lights the button. `squash` scales down on pointer-down and springs back on release. `confirmButton` runs the request then flips the button to its green `.is-done` check state (event `bf:confirmed`). `toast(host, text)` slides in a "Changes saved!" notice. `EasingRace(root).replay()` restarts the linear vs ease-out demo.

## Where it belongs

Primary actions, toggles, submit buttons, likes and saves: anything the user presses and expects an answer from. The full stack (ease, feedback, anticipation) goes on the one control that matters on the screen; secondary controls get the easing and a press state only.
