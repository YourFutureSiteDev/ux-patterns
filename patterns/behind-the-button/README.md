# Behind the Button

> Six things happen before the spinner stops.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/behind-the-button](https://www.designmotionhq.com/patterns/behind-the-button) · [Instagram](https://www.instagram.com/reel/DbdABtaNMs0/) (40.9K views). Category: interaction.

## The rule

A click on Buy is a six-step round trip: validate on the client for speed, ship the request, re-validate on the server for trust, run the business logic, write every row in one transaction, then repaint with the server's answer. Cheap reversible actions may repaint first; money waits for the server.

## Key insights

- Client-side validation exists for speed, not safety. Green checks and inline errors fire with 0 network calls because catching mistakes instantly is a frontend job.
- The server re-runs every check the client already did, only stricter. Never trust the client: anyone can forge a request, so re-compute the total from your own catalog instead of believing the price the browser sent.
- Wrap the related writes (order, items, inventory, payment) in one transaction. If a single row fails, every row rolls back, so an order never lands half-written. All of it, or none of it.
- When the response returns, repaint the UI with server truth, the real order ID the server created, not a value you guessed locally.
- Optimistic UI fits cheap, reversible actions: a like, a favorite, a rename can repaint instantly and reconcile in the background. Money is different, so hold the spinner until the server actually confirms.

## Do / Don't

- **Do:** validate on the client for speed and on the server for trust, never one instead of the other.
- **Do:** re-compute prices and totals server-side from your own source of truth.
- **Do:** wrap multi-row writes in one transaction so any failure rolls back the whole thing.
- **Don't:** trust values the client sends, including the price, since a request is trivial to forge.
- **Don't:** reach for optimistic UI on payments or other irreversible actions; make them earn the spinner.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | "You click Buy. Six things happen before the spinner stops." 2x3 graph: validate, request, server, logic, write, respond. Step bar unlit. |
| 2 | 3s | Steps 1-2 · The request | lumen.shop/checkout with Email, Card number, Billing zip all green. Network row: browser, api.lumen.shop. Step 1 lit. |
| 3 | 9s | Steps 1-2 · The request | "0 network calls" badge, "instant feedback · a frontend job", POST /api/orders packet ({ "items": 1, "total": 89.00 }, Bearer ey•••) flying down the wire. Steps 1-2 lit. |
| 4 | 15s | Steps 3-4 · Backend | api.lumen.shop re-validates: schema + types, token verified, total re-computed. A forged curl with "total": 0.01 gets 403 rejected. Logic cards dim. Step 3 lit. |
| 5 | 24s | Steps 3-4 · Backend | Stock check, Price check, Payment charge run and pass. Step 4 lit. |
| 6 | 30s | Step 5 · Database | orders_db, TRANSACTION: INSERT orders #4127, INSERT order_items, UPDATE inventory 4 → 3, INSERT payments $89.00. COMMIT — atomicity. Step 5 lit. |
| 7 | 39s | Step 6 · Response | 200 OK { "order_id": "#4127", "status": "confirmed" } comes back while the browser still shows Processing payment... All steps lit. |
| 8 | 42s | Step 6 · Response | Order confirmed, Order ID #4127, receipt to sarah@acme.co, arrives Jul 28. "server truth — not a guess". |
| 9 | 45s | The twist · Optimistic UI | A like card (128) and a payment card (Buy now · $89.00), both at rest, cursors over each. |
| 10 | 48s | The twist · Optimistic UI | Like repaints to 129 instantly and is later server confirmed; Buy spins, "waiting for server… pending — by design". "cheap actions repaint now — money waits". |
| 11 | 54s | The twist · Optimistic UI | Both confirmed: like repaint = instant, payment confirm = real. |
| 12 | 57s | Outro | The full round trip, a dot travelling the graph, @designmotionhq, Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="bb">
  <div class="bb-steps" id="trip">
    <div class="bb-step"><i>1</i>validate</div><div class="bb-step"><i>2</i>request</div><div class="bb-step"><i>3</i>server</div>
    <div class="bb-step"><i>4</i>logic</div><div class="bb-step"><i>5</i>write</div><div class="bb-step"><i>6</i>respond</div>
  </div>
  <button class="bb-buy" id="buy">Buy now · $89.00</button>
</div>
<script type="module">
  import { RoundTrip, validateForm, PessimisticBuy } from './pattern.js';
  const trip = RoundTrip(document.getElementById('trip'));
  PessimisticBuy(document.getElementById('buy'), {
    request: () => trip.run({
      validate: () => { const v = validateForm(document.querySelector('form')); if (!v.ok) throw v; },
      request: () => fetch('/api/orders', { method: 'POST', body: JSON.stringify(cart) }).then(r => r.json()),
      respond: res => res            // repaint with the server's order_id, never a local guess
    })
  });
</script>
```

`RoundTrip(bar).run(phases)` lights one `.bb-step` as each phase resolves and fires `bb:step`. `validateForm` is the 0-network-call client check, `recomputeTotal(items, catalog)` is the server-side price the client never gets to set, `transaction(writes)` applies every write or rolls all of them back. `OptimisticLike` repaints first and reconciles; `PessimisticBuy` shows the spinner until the request settles and only then paints "Order confirmed".

## Where it belongs

Checkout, payments, bookings, anything that writes money or inventory: hold the spinner and paint the server's answer. Likes, favourites, renames and other cheap reversible actions can repaint first.
