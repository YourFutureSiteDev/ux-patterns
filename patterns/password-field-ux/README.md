# Password Field UX

> Eight characters, one symbol: still weak. Strength lives in real-time feedback.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/password-field-ux](https://www.designmotionhq.com/patterns/password-field-ux) · [Instagram](https://www.instagram.com/reel/DZ7NPPItOoJ/) (115K views). Category: forms.

## The rule

Score strength as entropy, not a checkbox tally. Show the rules and a live meter while the user types, let them reveal and paste, and offer a generated password as the default path.

## Key insights

- Strength is entropy, not a checkbox tally. A longer passphrase beats a mandatory symbol every time: P@ssw0rd! is 28 bits and cracks in 2 hours, wrong-mango-battery-sky is 73 bits and takes 3 centuries.
- Show the requirements checklist as they type and tick each rule green before they hit submit. Never reveal the rules only after a failed attempt.
- A live strength meter coaches in real time: a growing bar says "almost", while post-submit errors only punish after the fact.
- Add an eye toggle to unmask the field. Masked dots cause silent typos users can't catch.
- Never block paste. Password managers fill longer, stronger passwords than anyone types by hand.
- The strongest pattern is to offer a generated password: one tap for a unique, saved, never-reused credential.

## Do / Don't

- **Do:** surface a live checklist and strength meter that update on every keystroke.
- **Do:** offer a visibility toggle plus a one-tap generated password.
- **Do:** allow paste so password managers can fill strong credentials.
- **Don't:** hide the rules until after submit, then punish with red errors.
- **Don't:** treat a capital-and-symbol checkbox as proof of real strength.
- **Don't:** block paste or force users to retype long passwords manually.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Passes the rules. Still weak. | Signup card, both rules ticked, meter one pink segment, "Weak". |
| 2 | 3s | Strength is entropy | P@ssw0rd! (28 bits, 2 hours) vs wrong-mango-battery-sky (73 bits, 3 centuries). "Length beats symbols." |
| 3 | 13.5s | Show the rules early | Rules after submit (three red errors) vs checklist while typing (four green ticks). "Green before they hit the button." |
| 4 | 21s | Strength meter | "tango" is Weak with one tag; "tango-r1ver-Lamp" is Strong with four tags. Meters coach, errors punish. |
| 5 | 30s | Reveal & paste | Eye toggle on Summer24!, "Paste disabled" vs a manager pasting horse-velvet-anchor-42. |
| 6 | 39s | The strongest pattern | "Use suggested password" fills kV9#mQ2-xT8&wNp4: Generated, Unique, Saved to keychain. 0 typing, 0 weak choices, 0 reuse. |
| 7 | 51s | Outro | Follow for more form UX. Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="pf">
  <div class="pf-input" id="field"><input type="password" autocomplete="new-password"><button class="pf-eye" id="eye">…</button></div>
  <div class="pf-meter" id="meter"><i class="pf-meter__seg"></i><i class="pf-meter__seg"></i><i class="pf-meter__seg"></i><i class="pf-meter__seg"></i></div>
  <div class="pf-meter__row" id="row"><span>Strength</span><b class="pf-meter__word">—</b></div>
  <div class="pf-rules" id="rules"><div class="pf-rule" data-rule="length"><span class="pf-rule__dot"></span>8+ characters</div>…</div>
  <button class="pf-btn" id="submit">Create account</button>
</div>
<script type="module">
  import { PasswordField, generatePassword } from './pattern.js';
  PasswordField(document.getElementById('field'), { meter, row, rules, eye, submit });
</script>
```

`PasswordField` scores every keystroke with `scoreEntropy` (bits), maps it to a 0 to 4 level, ticks the rules, enables submit when all pass, toggles reveal, and never blocks paste (fires `pf:pasted`). `generatePassword(16)` returns a ~98-bit suggestion; `crackTime(bits)` prints "2 hours" or "3 centuries".

## Where it belongs

Any signup or change-password form. The meter and checklist go on the create-password field only; on login fields keep the eye toggle and paste, drop the meter.
