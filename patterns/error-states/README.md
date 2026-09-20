# Error States

> Same error. Better recovery.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/error-states](https://www.designmotionhq.com/patterns/error-states) · [Instagram](https://www.instagram.com/reel/DX84_9QKwCF/) (27.9K views). Category: feedback.

## The rule

Match the error type to its surface (validation inline, network as a toast, server and permission on their own surface), let severity decide how much space it takes, give every error an exit, write the copy for humans, and prevent most errors before submit with live validation.

## Key insights

- Match the error type to its surface. A validation error belongs inline under the field, a lost connection reads as a banner or toast, and a server crash or permission block needs its own prominent space. Each type has a natural home.
- Let severity drive the surface. Minor issues stay inline, transient ones surface as a toast, and blocking failures earn a modal. The more an error interrupts the user, the more space it should occupy, and the reverse.
- Every error needs an exit. A dead-end "OK" button leaves people stuck. Give a real way out: a Retry, a link to support, or expandable technical details for those who want to dig in.
- Write copy for humans, not machines. "Error 500, An error occurred" tells the user nothing. Say what broke, why, and what to do next in plain, specific language.
- Prevent errors before they happen. Live inline validation, checking each rule as the user types and turning criteria green, stops most mistakes before submit. Validating only on submit just tells people they failed after the fact.
- Keep field-level validation small, inline, and specific: anchored to the input it describes, not floating in a generic alert.

## Do / Don't

- **Do:** offer a clear recovery action on every error: retry, undo, or a path to help.
- **Do:** match the surface to severity: inline for field errors, toast for transient issues, modal for true blockers.
- **Do:** validate inline as the user types so problems surface before submit.
- **Don't:** ship dead-end errors whose only option is "OK".
- **Don't:** surface raw codes like "Error 500" or "An error occurred" with no guidance.
- **Don't:** interrupt a minor validation slip with a full-screen modal.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | White "Error 500 / OK" modal dims; "Lost connection. Try again / Refresh page" card lights up pink. |
| 2 | 3s | 4 errors. 4 patterns. | Validation (inline), Network (toast), Server (full surface), Permission (gated). |
| 3 | 3s | 4 errors (later) | Same grid plus "Don't show a 500 modal for a typo." |
| 4 | 13.5s | Recovery | "Something went wrong." with a lone OK button. |
| 5 | 13.5s | Recovery (fixed) | Add recovery actions: Try again, Contact support, What happened, 1. Retry 2. Escalate 3. Explain. "Always offer a way out." |
| 6 | 22.5s | Hierarchy | Inline (recoverable) sign-up, Toast (transient) inbox, Modal (blocking) delete account. Low to high severity bar. |
| 7 | 22.5s | Hierarchy (later) | Plus "Most apps overuse modals." |
| 8 | 31s | Copy | "An error occurred. Code: 0x80004005". |
| 9 | 31s | Copy (rewritten) | "Lost connection. Reconnecting in 4 seconds..." |
| 10 | 39s | Prevention | After submit: the form before the mistake shows. |
| 11 | 39s | Prevention (typing) | After submit: "Password must contain a number". Live validation: first rule ticks as the user types. |
| 12 | 39s | Prevention (done) | All three rules green, Sign up enabled. "Inline validation kills 80% of errors." |
| 13 | 47.5s | 5 rules | Checklist: match the type to the surface, always offer a way out, severity drives surface, write copy for humans, prevent with live validation. |
| 14 | 50s | Outro | "Save this for your next error state." |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="es">
  <div class="es-input" id="pw"></div>
  <div class="es-rule" id="r1"><i><svg>…check…</svg></i>At least 8 characters</div>
  <button class="es-btn es-btn--primary" id="submit">Sign up</button>
</div>
<script type="module">
  import { showError, liveValidate, countdown, surfaceFor, humanize } from './pattern.js';
  liveValidate(document.getElementById('pw'), [{ el: document.getElementById('r1'), test: v => v.length >= 8 }], document.getElementById('submit'));
  fetch('/api/save').catch(() => showError({ type: 'network' }, { host: document.body, onRetry: save }));
</script>
```

`surfaceFor(err)` maps validation to inline, network to toast, and server or permission to a modal. `humanize(err)` returns plain-language title, body and the actions the surface must offer. `showError(err, opts)` renders on the right surface with Try again, Contact support or Sign in and a "What happened?" block. `liveValidate(input, rules, submit)` ticks each rule as the user types and enables submit only when all pass. `countdown(el, from)` drives the "Reconnecting in N seconds" copy.

## Where it belongs

Forms, saves, uploads, sign-in, payment, sync and any request that can fail. Field errors go inline; connectivity goes in a toast; server failures and permission blocks get their own surface with a retry, an escalation and an explanation.
