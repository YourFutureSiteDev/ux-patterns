# Modal Backdrop and Depth

> Same modal. Different feeling. Here's how: 3 secrets to premium modals.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DUy5XFaDHqZ/) (46.7K views). Category: visual.

## The rule

A modal reads as premium when it springs in with a slight overshoot and eases out on close, floats over a blurred and darkened backdrop instead of a flat overlay, and every control inside it responds to hover and press.

## Key insights

- Entrance: scale springs from 0.9 to 1 with a small overshoot (peaks at about 1.033) while opacity springs 0 to 1. The exit is the reverse, eased, not sprung: scale down to 0.95 and fade out over about 400 ms.
- Stagger the contents: the panel lands first, the body copy fades in about 300 ms later and the buttons after that.
- Backdrop: `backdrop-filter: blur(20px)` plus a dark tint. The blur animates in with the modal, not as a hard cut. A flat dark overlay is the cheap tell.
- Depth: a deep, wide shadow under the panel and a hairline border so it floats above the blurred app instead of sitting on it.
- Micro-interactions: hover on the danger button brightens it and adds a red glow, press scales it down and bounces back, and even the close button gets a hover circle and a press bounce.
- Same copy, same layout: spring entrance, blur backdrop and micro-interactions are the whole difference between the cheap version and the premium one.

## Do / Don't

- **Do:** open with a spring (slight overshoot) and close with a plain ease-out; the two should not be symmetrical.
- **Do:** blur and darken the app behind the modal, and let that blur animate in.
- **Do:** give every control in the modal a hover state and a press bounce, including the close button.
- **Don't:** fade a modal in at scale 1 over a flat black overlay: it reads as a default browser dialog.
- **Don't:** ship a danger button with no hover feedback; cheap buttons are the first thing people notice.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Cheap vs premium | Two Delete project? modals side by side: 4px radius and flat vs 12px radius, glow and shadow. "Same modal. Different feeling." |
| 2 | 1s | Here's how | One modal, three lines: Same modal. Different feeling. Here's how. |
| 3 | 3s | 3 secrets to premium modals | Preview cards cycle every 1.5 s: Entrance & Exit, Backdrop & Depth, Micro-interactions. COMING UP. |
| 4 | 8.75s | Secret #1 Entrance & Exit | Spring entrance with live `scale()` / `opacity()` readout and a +0f, +5f, +10f, +15f ladder; mid-overshoot then settled. |
| 5 | 15s | Secret #1 exit | Scale down to 0.950, opacity 0.00. |
| 6 | 22.2s | Secret #2 Backdrop & Depth | Projects app behind; blur animates 0 to 20px with a live `backdrop-filter: blur()` readout while the modal springs in. "Now it floats". |
| 7 | 31.5s | Secret #3 Micro-interactions | Compact modal with close button. Hover on Delete (glow), hover on the close circle, press bounce. |
| 8 | 43.5s | Put it all together | Sharp app, then blurred app with Spring entrance, Blur backdrop and Micro-interactions chips and the finished modal. |
| 9 | 49.5s | Outro | Design is in the details. Follow for more, with the three secret emoji floating. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="mb">
  <div class="mb-app">…your page…</div>
  <div class="mb-backdrop" id="bd" hidden></div>
  <div class="mb-modal" id="dlg">
    <div class="mb-modal__icon">…</div>
    <h2 class="mb-modal__title">Delete project?</h2>
    <p class="mb-modal__body">This action cannot be undone. All files and data will be permanently removed.</p>
    <div class="mb-modal__row"><button class="mb-btn" id="cancel">Cancel</button><button class="mb-btn mb-btn--danger" id="del">Delete</button></div>
  </div>
</div>
<script type="module">
  import { PremiumModal } from './pattern.js';
  const dlg = PremiumModal({ backdrop: bd, modal: document.getElementById('dlg'), closers: [cancel, del] });
  dlg.open();
</script>
```

`SpringModal(el, { readout })` exposes `open()`, `close()` and `seek(t, phase)`; `BlurBackdrop(el, { readout, max, ms })` animates the blur and prints its value; `PressBounce(root)` adds the press scale to `.mb-btn` and `.mb-close`; `spring(t, { omega, zeta })` is the underlying damped spring. Variants: `.mb-modal--cheap`, `.mb-modal--compact`, `.mb-modal--wide`.

## Where it belongs

Confirmation dialogs, destructive-action prompts, sheets and any overlay that interrupts the page. Not for toasts or inline popovers, which should not blur the whole app.
