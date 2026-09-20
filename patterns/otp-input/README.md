# OTP Input

> Your OTP input is a system, not six boxes.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/otp-input](https://www.designmotionhq.com/patterns/otp-input) · [Instagram](https://www.instagram.com/reel/DZmkBhghnD8/) (188K views). Category: forms.

## The rule

Model the code as one string and render the six boxes as a view of it. Paste fills every box, focus auto-advances, backspace on an empty box jumps back, resend hides behind a visible countdown, and submit gives instant feedback: shake and clear, or lock green.

## Key insights

- Treat paste as the primary path: when a code is pasted into any box, strip spaces and non-digits (`value.replace(/\D/g, "")`) and distribute the digits across all six boxes at once.
- Auto-advance focus as each digit lands, and make backspace on an empty box jump back to the previous one and clear it, so correcting a typo never traps the cursor.
- Model the field as one string, not six independent values. `useState("847291")` beats `useState(["","","","","",""])`; the boxes are just a view of a single source of truth.
- On mobile, wire up `inputmode="numeric"` and `autocomplete="one-time-code"` so the OS surfaces the SMS code as a one-tap autofill above the keypad.
- Throttle resend behind a visible 30s countdown. Without it, impatient users spam the button, hit `429 Too Many Requests`, and get temporarily banned by the server.
- Give instant feedback on submit: a wrong code shakes and clears back to focus, a correct code locks each box green with a check and a "Verified" state.

## Do / Don't

- **Do:** store the full code as a single string and render the six boxes as a view of it.
- **Do:** strip non-digits from pasted input and spread the code across every box automatically.
- **Do:** gate the resend button behind a visible countdown timer to avoid rate-limit bans.
- **Don't:** rely on one wide input. Pasted codes with spaces overflow and choke it.
- **Don't:** leave a wrong code sitting silently. Shake, clear, and refocus instead.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Paste once | Clipboard chip 847291, six boxes filled, box 2 focused. Live. |
| 2 | 3s | The paste problem | "One input chokes": 847 291 04 in a single pink field. |
| 3 | 6s | The paste problem | `value.replace(/\D/g, "") → 847291`, six green boxes. "One paste, six boxes, done." |
| 4 | 12s | Auto-advance | 8, 4 typed, box 3 focused. Keypad row with backspace lit. "backspace on empty → jump back". |
| 5 | 18s | State architecture | Six boxes tagged input[0]..input[5]. Struck `useState([...])`, `useState("847291")`. |
| 6 | 21s | State architecture | One "847291" chip fanning dotted lines to six boxes. |
| 7 | 27s | Mobile autofill | Phone mockup, "Your code is 847291", numeric keypad, inputmode and autocomplete chips. |
| 8 | 33s | Resend, throttled | No timer (Resend code, 429 Too Many Requests) vs 30s timer ring at 0:22. |
| 9 | 37.5s | Resend, throttled | Ring at 0:04. "No throttle = they rate-limit themselves." |
| 10 | 40.5s | Instant feedback | Wrong code shakes, clears, box 1 refocused. |
| 11 | 43.5s | Instant feedback | Right code locks every box green with a check. "Verified". Silent fail vs Instant feedback. |
| 12 | 51s | Outro | Follow for more UI systems. Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="otp">
  <div class="otp-boxes" id="otp">
    <input class="otp-box" maxlength="1"><input class="otp-box" maxlength="1"><input class="otp-box" maxlength="1">
    <input class="otp-box" maxlength="1"><input class="otp-box" maxlength="1"><input class="otp-box" maxlength="1">
  </div>
  <button class="otp-resend" id="resend" disabled>Resend in <span class="otp-resend__t">0:30</span></button>
</div>
<script type="module">
  import { OtpInput, ResendTimer } from './pattern.js';
  OtpInput(document.getElementById('otp'), { verify: code => fetch('/api/verify', { method: 'POST', body: code }).then(r => r.ok) });
  ResendTimer(document.getElementById('resend'), null, { seconds: 30 }).start();
</script>
```

`OtpInput(root, { length, verify })` keeps one code string, sets `inputmode="numeric"` and `autocomplete="one-time-code"`, distributes pastes and OS autofill, auto-advances, handles backspace and arrows, and on a full code calls `verify`: true locks the boxes green (`otp:verified`), false shakes and clears (`otp:rejected`). `shakeAndClear(root)` is exported on its own. `ResendTimer(button, ringEl, { seconds })` disables the button, drives the countdown ring and re-enables at zero.

## Where it belongs

SMS and email verification codes, 2FA prompts, device pairing PINs. Not for passwords or anything longer than a handful of digits.
