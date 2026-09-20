# Optimistic UI

> Click like. One waits. One feels instant.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/optimistic-ui](https://www.designmotionhq.com/patterns/optimistic-ui) · [Instagram](https://www.instagram.com/reel/DaclzgJNUeQ/) (185K views). Category: feedback.

## The rule

Update the UI the instant the user acts, sync with the server in the background, and roll back cleanly if the request fails. Reserve it for reversible, low-stakes actions.

## Key insights

- Update the UI the instant the user acts, then sync with the server in the background. Don't block on the response.
- The brain reads anything under 400ms as instant; a spinner past that threshold makes the action feel broken.
- When the request fails, roll back the UI cleanly: undo the like, restore the count, as if it never happened.
- The core bet: trust the success case (which is almost always what happens) and handle the rare failure gracefully.
- Reserve it for reversible, low-stakes actions (likes, toggles, reorders) where an occasional rollback costs nothing.

## Do / Don't

- **Do:** update the interface immediately, then reconcile with the real server response behind the scenes.
- **Do:** roll back to the previous state the moment a request fails, so the UI never lies for long.
- **Do:** apply it to reversible interactions like likes, favourites and list reordering.
- **Don't:** use it for payments, transfers or anything you can't safely undo.
- **Don't:** show a charge, booking or confirmation before the server has actually cleared it.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Same tap. Same network. | Two like cards: one waits 0.8s (pink), one instant (teal). "One didn't wait." |
| 2 | 3s | Update strategy | Slow: client waits for server. Fast: client updates, server syncs after. |
| 3 | 12s | Perceived latency | 240° gauge, 0 to 1000ms, teal under 400ms. Needle sweeps 49, 261, 720. |
| 4 | 24s | Failure path | Card rolled back 248 to 247, "Network error" toast. |
| 5 | 33s | Assume the happy path | User acts, Render now, Reconcile. 99% of the time the bet was correct. |
| 6 | 42s | Boundaries | Optimistic OK (Like, Follow, Save, Bookmark) vs Show the truth (Pay, Transfer, Delete, Processing payment). |
| 7 | 51s | Outro | Make it feel instant. Working optimistic like button. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ou">
  <button class="ou-like__btn" id="like"><svg>…heart…</svg></button>
  <span class="ou-like__count" id="count">248</span>
</div>
<script type="module">
  import { OptimisticLike } from './pattern.js';
  OptimisticLike(document.getElementById('like'), document.getElementById('count'), {
    request: () => fetch('/api/like', { method: 'POST' }).then(r => { if (!r.ok) throw r; })
  });
</script>
```

`OptimisticLike` flips state and count on click, fires the request, and rolls back on rejection (events `ou:confirmed`, `ou:rolledback`). `LatencyGauge(root).set(ms)` drives the gauge. `PessimisticLike` is the comparison control.

## Where it belongs

Like, follow, save, bookmark, toggle, reorder. Never on pay, transfer, delete, or anything that needs the server's word first.
