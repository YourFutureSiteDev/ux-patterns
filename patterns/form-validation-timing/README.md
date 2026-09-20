# Form Validation Timing

> The error fires while you're still typing.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/form-validation-timing](https://www.designmotionhq.com/patterns/form-validation-timing) · [Instagram](https://www.instagram.com/reel/DaPx5yytc9Q/) (150K views). Category: forms.

## The rule

Validate a field on blur, the moment focus leaves it. Once a field has errored, switch that field to live validation so the error clears as soon as it is fixed. Confirm correct fields with a green check, not only the broken ones.

## Key insights

- Validating on submit is too late. Users fill ten fields, commit, then get hit with a wall of errors all at once.
- Validating on every keystroke is too early. It flags a field as wrong before they have even finished typing the word.
- The sweet spot is on blur: check a field the moment focus leaves it, so feedback lands after they are done but before they submit.
- Once a field has errored, switch to live validation for that field so the error clears the instant they correct it.
- Success is feedback too. A green check tells users a field is right, not only when something is wrong.

## Do / Don't

- **Do:** validate a field on blur, once the user has moved on from it.
- **Do:** after a field errors, revalidate live so the message clears the moment it is fixed.
- **Do:** confirm correct fields with a green check, not just flag the broken ones.
- **Don't:** hold every error until submit and reveal them all at once.
- **Don't:** fire red errors on each keystroke before the user finishes typing.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Still typing. Already wrong? | Error fires on "alex@ema" mid-word. "The timing is the whole thing." |
| 2 | 3s | On submit | Five-field form, teal Submit button. "Too late." |
| 3 | 6s | On submit | Every field errors at once (Required, Invalid email, Too short, Invalid number). |
| 4 | 12s | On keystroke | "alex" flagged invalid, "4 checks fired · 1 per key". Types a, l, e, x live. "Correct, but cruel." |
| 5 | 21s | On blur | Typing "al", nothing fires. |
| 6 | 24s | On blur | Tab away: "alex@email.com", Looks good, check badge. "Check on blur." |
| 7 | 30s | After an error | Field errored on blur: "alex@ema", Invalid email. |
| 8 | 33s | After an error | Now live: fixed to "alex@email.com", Looks good. "On error → Live". |
| 9 | 39s | On success | Silence: valid field with no feedback, "feels judged". |
| 10 | 42s | On success | Confirm: green ring, check, "feels safe". "Confirm right, not only wrong." |
| 11 | 48s | Outro | "Timing is the UX." Live field, Follow CTA. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="fvt">
  <div class="fvt-field" id="email">
    <label class="fvt-label" for="email-input">Email</label>
    <div class="fvt-box"><input class="fvt-input" id="email-input" type="email"><span class="fvt-icon"></span></div>
    <div class="fvt-help"></div>
  </div>
</div>
<script type="module">
  import { ValidationField, emailRule } from './pattern.js';
  ValidationField(document.getElementById('email'), { timing: 'blur-then-live', validate: emailRule });
</script>
```

`ValidationField(root, { timing, validate, successMessage })` supports four timings: `submit` (only via `validateOnSubmit`), `keystroke` (the cruel control), `blur`, and `blur-then-live` (the rule). It toggles `is-focus`, `is-error`, `is-success`, fills the icon and helper, sets `aria-invalid`, and fires `fvt:state` with the running check count. `validateOnSubmit(form, fields)` checks every field at once. `typeInto(el, text)` is the demo typewriter.

## Where it belongs

Any form with format rules: email, password, phone, card number, usernames. Not for search boxes or free text where there is nothing to be wrong about.
