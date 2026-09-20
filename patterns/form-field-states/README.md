# Form Field States

> Six field states, one system. Miss one and you ship a bug.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/form-field-states](https://www.designmotionhq.com/patterns/form-field-states) · [Instagram](https://www.instagram.com/reel/DXthiVKNCDd/) (19.8K views). Category: forms.

## The rule

A text field has six states: default, focus, error, success, disabled and loading. Design every one explicitly, keep the label outside the field, and make each state readable by more than colour alone.

## Key insights

- A text field has six states (default, focus, error, success, disabled, loading) and each needs an explicit design. Forget one and it becomes a bug in production.
- At rest, keep the label outside the field with helper text below it. A placeholder-as-label vanishes the moment someone starts typing.
- On focus, make the active target obvious with a focus ring of at least 3:1 contrast. A soft blue glow looks pretty but fails accessibility checks.
- For errors, combine colour + icon + message together. A border-only red is invisible to the roughly 12% of users with colour-vision deficiency. Name what is wrong and how to fix it.
- Confirm success inside the field, where the user's attention already is. Toasts steal focus and disappear before they are read.
- Keep disabled and loading visually distinct: disabled uses a grayscale fill with a not-allowed cursor, loading shows an in-field spinner and blocks input to prevent double submits.

## Do / Don't

- **Do:** place the label above the field and helper text below, so nothing disappears on input.
- **Do:** signal every error with colour, an icon and a written message at once.
- **Do:** disable the input and show a spinner during async checks to stop double submits.
- **Don't:** use a placeholder as the label. It vanishes as soon as typing begins.
- **Don't:** rely on a border-only red for errors; roughly 12% of users will not perceive it.
- **Don't:** fake a disabled state with opacity 0.5. It reads as a loading state instead.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 6 form states | Two-by-three grid of the six states. "Most apps ship two." |
| 2 | 3s | 01/06 Default: At rest | Empty field, label outside, helper below. Rule / Avoid pills. This field is live. |
| 3 | 12s | 02/06 Focus: In focus | Teal 2px ring with glow, caret mid-word, "Contrast 4.6:1" badge. |
| 4 | 18s | 03/06 Error: Validation failed | Red ring, alert icon in the field, message "Email format is invalid — check the @ symbol". |
| 5 | 30s | 04/06 Success: It worked | Green ring, check icon in the field, "Email available". |
| 6 | 36s | 05/06 Disabled: Locked | Grayscale, dimmed, "Account locked — contact support". |
| 7 | 45s | 06/06 Loading: Async in flight | Spinner in the field, input blocked, "Checking availability…". |
| 8 | 54s | Outro | "One forgotten = one bug." Six state chips, save CTA. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ffs">
  <div class="ffs-field" id="email" data-state="default">
    <label class="ffs-label" for="email-input">Email</label>
    <div class="ffs-box"><input class="ffs-input" id="email-input" type="email"><span class="ffs-icon"></span></div>
    <div class="ffs-help">We’ll never share your email</div>
  </div>
</div>
<script type="module">
  import { EmailField } from './pattern.js';
  EmailField(document.getElementById('email'), {
    check: v => fetch('/api/email-available?e=' + encodeURIComponent(v)).then(r => r.json()).then(j => j.available)
  });
</script>
```

`FieldState(root)` returns `.set(state, message)` for the six states and updates `data-state`, the in-field icon, the helper text, `disabled` and `aria-invalid`. `EmailField(root, { validate, check })` wires a real input: focus, blur-validate, optional async check with the loading state, and live revalidation once a field has errored. Fires `ffs:state` on every change.

## Where it belongs

Every text input in a form: email, password, username, anything with async validation. Not for toggles, selects or read-only display values.
