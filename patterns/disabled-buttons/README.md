# Disabled Buttons

> The button is disabled, and nobody tells you why.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/disabled-buttons](https://www.designmotionhq.com/patterns/disabled-buttons) · [Instagram](https://www.instagram.com/reel/DbvCsRetjhR/) (82.6K views). Category: interaction.

## The rule

Keep the submit button live. Validate on click, light up the fields that block it, move focus to the first one, and name the blocker in reachable text. While a request runs, use a busy state (spinner + `aria-busy`), never `disabled`.

## Key insights

- A disabled button drops out of the tab order, so keyboard users skip right past it and screen readers stay silent. The block exists, but nothing announces it.
- Pointer events are dead on a disabled element, so a tooltip meant to explain the block never fires. The reason is unreachable by design.
- Greyed-out labels usually fail contrast. A disabled state can land near 1.9:1, well under the 4.5:1 threshold, so the text is hard to read on top of being blocked.
- Keep the button live and validate on click instead. Light up the fields that are blocking submit, then move focus to the first one so the path forward is visible.
- Disabled and loading are different states. During a request, hold focus, show a spinner, and report `aria-busy`; greying the button out throws the user's place away.

## Do / Don't

- **Do:** keep the button enabled, validate on click, then flag the blocking fields and move focus to the first one.
- **Do:** for async actions, use a busy state that holds focus, spins, and sets aria-busy.
- **Do:** name the blocker in reachable text, not a tooltip attached to a dead control.
- **Don't:** disable submit and leave the user to guess what is missing.
- **Don't:** rely on a tooltip to explain a disabled control, since pointer events never fire on it.
- **Don't:** treat loading as disabled; greying out mid-request drops focus and the user's place.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | New project form, disabled Create project, three clicks logged: "no state change", events 0. |
| 2 | 3s | Tab order (stop 1/5) | Focus ring on Project name, screen reader announces it, contrast "measuring…". |
| 2b | 9s | Tab order (stop 5/5) | Tab jumps from Terms to Cancel; "skipped · tabindex -1" over the button. |
| 2c | 12s | Tab order (contrast) | Screen reader silent on the button, label contrast 1.9:1, FAIL · WCAG AA. |
| 3 | 15s | Pointer events | Hover on the disabled button: `pointer-events: none`, ghost tooltip. Hover test: enabled shows "Saves to your drafts", disabled shows "no event". |
| 4 | 24s | Validate on click | Live teal Create project, validation "runs on submit", nothing blocked yet. |
| 4b | 27s | Validate on click | Two blockers lit amber (Region, Terms), focus moved to Region, "2 to fix". |
| 4c | 33s | Validate on click | eu-west-1 set, terms accepted, "all clear", both rows fixed. |
| 5 | 36s | Loading state | disabled (focus lost) vs busy (`aria-busy="true"`, spinner, focus kept) vs done. State audit table. |
| 6 | 45s | Outro | Don't disable. Explain. Four takeaways, @designmotionhq, Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<form class="db">
  <div class="db-field"><label class="db-label">Region</label><div class="db-input" tabindex="0">…</div><div class="db-msg"></div></div>
  <div class="db-field"><label class="db-label">Terms</label><div class="db-input" tabindex="0">…</div><div class="db-msg"></div></div>
  <button class="db-submit db-submit--live" id="create">Create project</button>
</form>
<script type="module">
  import { ValidateOnClick, BusyButton } from './pattern.js';
  const [region, terms] = document.querySelectorAll('.db-field');
  ValidateOnClick(document.getElementById('create'), [
    { field: region, message: 'Pick a region', valid: () => !!state.region },
    { field: terms,  message: 'Accept the terms', valid: () => state.terms }
  ], { onSubmit: () => api.create() });
  BusyButton(document.getElementById('create'), { label: 'Creating…', done: 'Project created', request: () => api.create() });
</script>
```

`ValidateOnClick` keeps the button enabled, and on click paints every failing field (`.is-invalid`, amber label, `.db-msg--warn` with the message), moves focus to the first failing control and fires `db:blocked`; when all rules pass it fires `db:submit`. `BusyButton` swaps the label for a spinner, sets `aria-busy="true"` while the request runs, never sets `disabled`, ignores repeat clicks, and returns focus to the button when done (`db:busy`, `db:done`, `db:failed`). `contrastRatio(fg, bg)` returns the WCAG ratio so you can catch the 1.9:1 grey-on-grey label.

## Where it belongs

Form submits, create/save buttons, checkout, anything gated on fields the user still has to fill. Not for actions that genuinely cannot happen in this context (those get hidden, not disabled).
