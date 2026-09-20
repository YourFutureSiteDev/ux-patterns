# Double Submit Guard

> Prevent double tap on your critical submit button.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DcYUpuzthq-/) (49.2K views, no site page). Category: forms.

## The rule

One tap, one charge. Disable the button on the first tap, keep the spinner in place with the width locked, guard the handler on the client and dedupe on the server with an idempotency key, resolve to a check or an error on the button itself, and re-enable on the response, never on a timer.

## Key insights

- Disable on the first tap. Extra taps while the request is in flight are ignored on the client and never reach the server: one intent, one request.
- Swap the label for a spinner in place and lock the button's width. A button that shrinks reflows the layout underneath (+30px, ×2 jumps a session); a locked one moves nothing.
- UI off isn't enough. Guard the handler with an `inFlight` flag and send an `Idempotency-Key`; the server returns the same charge when it sees the key again, so a retry captures one charge, not two.
- Land on a check or an error, right on the button. Success shows a check and "Payment confirmed"; failure shows "Card declined" and "Try another card, nothing was charged".
- Re-enable on the response, not a timer. `setTimeout(enable, 2000)` is a guess that leaves the button live while the charge is still pending; `onSettled(() => enable())` enables the instant the response lands.

## Do / Don't

- **Do:** flip the button to disabled and pending on the first tap, before the request leaves.
- **Do:** lock the button's width so the spinner never shifts the layout below it.
- **Do:** send an idempotency key with every submit and dedupe on the server.
- **Do:** show the outcome on the button (check or error) and say why nothing was charged.
- **Don't:** rely on the disabled attribute alone; guard the handler too.
- **Don't:** re-enable after a fixed delay while the request is still in flight.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1a | 0s | State · Disable | Northform checkout, Pay $49 tapped, disabled chip, Network slow · 3G 0.6s, POST /pay in flight. |
| 1b | 3s | Extra taps ignored | 3.4s in flight, 2nd tap and 3rd tap ignored, "1 intent → 1 charge". |
| 2a | 9s | State · Spinner | Reflows (button shrinks, layout shift +30px, ×1) vs Locked (0px · nothing moved, ×0). |
| 2b | 15s | Spinner (after) | Both back to Pay $49; reflows counted ×2. |
| 3a | 18s | State · Guard | Client code with `if (inFlight) return;` and the Idempotency-Key header, POST /pay to the server, charges captured 1. |
| 3b | 21s | Retry | Retry hits the server, key seen → return the same charge, still 1. |
| 4a | 27s | State · Resolve | Success: check + Payment confirmed. Error: Card declined + Try another card, nothing was charged. |
| 4b | 30s | Resolve (pending) | Both buttons spinning in place. |
| 5 | 36s | State · Re-enable | setTimeout(enable, 2000) GUESS vs onSettled(() => enable()) RESPONSE. |
| 6 | 42s | Outro | One tap, one charge. The five steps, designmotionhq.com, link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dsg">
  <button class="dsg-btn" id="pay">
    <span class="dsg-btn__label">Pay $49</span>
    <span class="dsg-btn__state"><span class="dsg-spin"></span><svg class="ic dsg-check"><use href="#i-check"/></svg><span class="dsg-err"><span>Card declined</span></span></span>
  </button>
</div>
<script type="module">
  import { SubmitGuard, payWithKey } from './pattern.js';
  SubmitGuard(document.getElementById('pay'), {
    request: key => payWithKey('/pay', { amount: 4900 }, key),
    onSettled: () => console.log('re-enabled on the response')
  });
</script>
```

`SubmitGuard` locks the width, sets `data-state` to `pending`, `success` or `error`, ignores taps while a request is in flight (`dsg:ignored`), reuses the same idempotency key for a retry of the same intent, and re-enables in `finally`. `payWithKey` sends the `Idempotency-Key` header; `idempotentHandler` is the reference server-side dedupe.

## Where it belongs

Pay, transfer, place order, send, book: any submit whose second request costs money or sends something twice.
