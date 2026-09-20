# Toggle Anatomy

> Two toggles. One snaps. One morphs, and the difference is everything.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/toggle-anatomy](https://www.designmotionhq.com/patterns/toggle-anatomy) · [Instagram](https://www.instagram.com/reel/DY9avLYtAri/) (43.2K views). Category: forms.

## The rule

Make the rail twice the knob and pad the knob by its own radius, then morph rail colour, knob position, knob shadow and label together over 250ms. Toggle on Space, show a focus ring, announce aria-checked. For async settings flip first, spin inside the knob, and roll back if the server fails.

## Key insights

- Proportions hold the shape together: make the rail twice the knob's diameter, and pad the knob by its own radius so it sits centered in both states.
- A good toggle morphs, it doesn't snap. Animate the flip over ~250ms with an ease-out curve instead of jumping instantly between on and off.
- Four properties change at once during the flip: rail color, knob position (translateX), knob shadow, and the state label. All moving together, not in sequence.
- Build in accessibility: Space toggles the control when focused, a visible focus ring shows keyboard position, and aria-checked lets screen readers announce the state.
- For async toggles, go optimistic: flip immediately on click, spin a loader inside the knob while the request is pending, then roll back (with a shake and an error toast) if the server fails.

## Do / Don't

- **Do:** morph rail color, knob position, shadow, and label together over ~250ms with an ease-out curve.
- **Do:** flip optimistically, show a spinner inside the knob while pending, and roll back on failure.
- **Do:** support Space to toggle, a visible focus ring, and aria-checked for screen readers.
- **Don't:** snap the knob instantly between states. The hard jump reads as broken, not responsive.
- **Don't:** leave the toggle ambiguous during a network request. An un-spun switch looks stuck.
- **Don't:** ship a toggle that only responds to a mouse click and skips keyboard and screen-reader users.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | SNAP (grey rail, no transition) beside MORPH (teal, 250ms). "Two toggles. One snaps. One morphs." |
| 2 | 3s | Anatomy | 600px rail, 260px knob, 20px padding, dimension lines. "rail = 2× knob · pad = knob radius" |
| 3 | 9s | The transition (OFF) | Notifications card, four property cards dim. "250ms · ease-out" |
| 4 | 15s | The transition (ON) | Rail color, Knob slide, Knob shadow, Label all lit teal. |
| 5 | 21s | Accessibility: Space | Space key cap, dashed arrow, OFF switch, "Space" chip lit. |
| 6 | 24s | Accessibility: focus ring | ON switch with teal focus ring, "Focus ring" chip lit. |
| 7 | 27s | Accessibility: ARIA | Screen reader bubble `aria-checked="true"`, all three chips lit. |
| 8 | 30s | Loading state: pending | Client flipped ON with a spinner in the knob; server POST /api/settings pending. |
| 9 | 33s | Loading state: failed | 500 Internal Server Error, switch rolled back OFF, "Couldn't save — try again" toast. |
| 10 | 36s | Outro | Follow for more UI components. Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="tg">
  <button class="tg-switch" id="notif" role="switch" aria-checked="false" aria-label="Notifications">
    <span class="tg-switch__knob"></span>
    <span class="tg-switch__label tg-switch__label--off">OFF</span>
    <span class="tg-switch__label tg-switch__label--on">ON</span>
  </button>
</div>
<script type="module">
  import { Toggle } from './pattern.js';
  const t = Toggle(document.getElementById('notif'), {
    request: on => fetch('/api/settings', { method: 'POST', body: JSON.stringify({ notifications: on }) }).then(r => { if (!r.ok) throw r; })
  });
  document.getElementById('notif').addEventListener('tg:error', () => toast("Couldn't save — try again"));
</script>
```

`Toggle` sets `role="switch"`, flips `aria-checked` on click, Space and Enter, and when `request` is given adds `.is-pending` (spinner in the knob) until it resolves; on rejection it restores the previous state, plays `.is-shake` and fires `tg:error` (`tg:saved` on success). `SnapToggle` is the comparison control with every duration zeroed. `fakeRequest({ latency, fail })` is the demo server. Sizes come from `--tg-w`, `--tg-h`, `--tg-knob`, `--tg-pad`.

## Where it belongs

Settings, preferences, notification and privacy switches, feature flags. Anything binary the user flips and expects to see change at once. Not for actions that need a confirmation step or that are not immediately reversible.
