# Input Masking

> Type 16 digits. Watch them become a card.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/input-masking](https://www.designmotionhq.com/patterns/input-masking) · [Instagram](https://www.instagram.com/reel/DZZ5y8cNZiE/) (22.1K views). Category: forms.

## The rule

Group the digits four by four as they are typed, keep the caret right after the character just typed, name the brand from the first digit, strip junk on paste, validate on blur, and store the raw digits, never the formatting.

## Key insights

- Group digits four-by-four. A space every four characters turns an unreadable 16-digit run into scannable chunks like 4242 4242 4242 4242.
- The leading digit names the brand: 4 is Visa, 5 is Mastercard, 3 is Amex. Surface the matching card mark inline as the user types.
- When you auto-insert a separator, keep the caret right after the character just typed. Jumping it to the end is disorienting and breaks editing.
- Validate on blur, not on keystroke. Flagging "Invalid card" mid-entry reads as premature; stay neutral until they leave the field, then confirm success.
- Strip junk on paste. When a value arrives with dashes or spaces, clean it and reformat to your own grouping instead of rejecting it.
- Show formatted, store raw. Render the grouped value for the user, but persist the unformatted digits as the stored value.

## Do / Don't

- **Do:** group long numbers into fixed chunks so they stay readable as they are typed.
- **Do:** detect the card brand from the leading digit and show its mark inline.
- **Do:** reformat pasted values instead of erroring on their separators.
- **Don't:** let the caret jump to the end when a separator is auto-inserted.
- **Don't:** flag a validation error on the first keystroke instead of waiting for blur.
- **Don't:** save the formatting characters with the value. Keep the stored data raw.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 16 digits become a card | Live masked input with VISA mark. |
| 2 | 3s | Group them four by four | "Hard to read" 4242424242424242 vs "Readable" 4242 4242 4242 4242. |
| 3 | 9s | First digit names the brand | Visa / Mastercard / Amex list, empty focused field. |
| 4 | 12s | First digit names the brand | "5" typed, Mastercard row lit, mark appears in the field. |
| 5 | 15s | Keep the caret where it was | "Caret jumps" (pink caret at the end) vs "Caret held" (after the 4). |
| 6 | 24s | Validate on blur, not keystroke | "Premature" errors mid-typing vs "Patient" stays neutral. |
| 7 | 30s | Validate on blur, not keystroke | Patient field blurred: full number, check badge, "Looks good". |
| 8 | 33s | Strip pasted junk | "Pasted" chip, regrouped number, "dashes removed · re-grouped". |
| 9 | 39s | Show formatted, store raw | What the user sees vs the JSON `"cardNumber": "4242424242424242"`. |
| 10 | 45s | Outro | Follow for more form UX. Save this for your next checkout. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="im">
  <div class="im-card im-card--hero">
    <input class="im-input" id="card" inputmode="numeric" autocomplete="cc-number">
    <span class="im-brand" id="brand"></span>
  </div>
</div>
<script type="module">
  import { CardMask } from './pattern.js';
  const mask = CardMask(document.getElementById('card'), {
    onBrand: b => { document.getElementById('brand').dataset.brand = b; },
    onValidate: (ok, raw) => { /* ok = Luhn passed; raw = digits only, store this */ }
  });
</script>
```

`CardMask(input, { maxDigits, validate, onBrand, onValidate })` formats on input, preserves caret position across inserted separators, intercepts paste and strips non-digits, validates (Luhn by default) on blur, and exposes `.raw`, `.formatted`, `.brand` and `.set(value)`. Events: `im:change`, `im:paste`, `im:validate`. Helpers `groupFour`, `stripJunk`, `brandOf`, `luhn` are exported too.

## Where it belongs

Card numbers, phone numbers, IBANs, sort codes, licence keys: anything long, numeric and fixed-shape. Not for free text or values where the separator is meaningful.
