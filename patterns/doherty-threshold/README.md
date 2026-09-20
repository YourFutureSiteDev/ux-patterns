# Doherty Threshold

> Cross 400ms and your user checks out. Perceived speed is a design choice.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/doherty-threshold](https://www.designmotionhq.com/patterns/doherty-threshold). Category: feedback.

## The rule

Respond within 400 ms or the user mentally disconnects. Under 200 ms feels instant, 200 to 400 ms is tolerable, past 400 ms engagement breaks. The real work can take longer, as long as the interface reacts inside the threshold: paint a skeleton, update optimistically, or show honest progress.

## Key insights

- The Doherty Threshold is 400ms: respond faster and you hold attention, respond slower and users mentally disconnect.
- Response time splits into zones: under 200ms feels instant, 200 to 400ms is tolerable, and over 400ms starts breaking engagement.
- What matters is perceived speed, not raw speed. The real work can take longer as long as the interface reacts within the threshold.
- Skeleton loading paints placeholder shapes the instant a screen opens, so it never looks frozen while data arrives.
- Optimistic UI updates the screen as if the action already succeeded, then reconciles only if the server rejects it.
- Progress feedback (spinners, progress bars, inline status) keeps an unavoidable wait feeling responsive instead of stalled.

## Do / Don't

- **Do:** give visible feedback within 400ms of any interaction, even if it's just a skeleton or acknowledgment.
- **Do:** update the interface optimistically for actions that almost always succeed.
- **Do:** show progress feedback whenever the real work has to exceed the threshold.
- **Don't:** leave the screen blank or frozen while data loads in the background.
- **Don't:** wait for a server round-trip before giving any visual response.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Submit | Cyan Submit button on a faint green glow. |
| 2 | 0s | 117 ms | Counter in the instant zone, green. |
| 3 | 0s | 357 ms | Counter in the tolerable zone, yellow, glow swells. |
| 4 | 0s | 400 ms | Counter goes red and large: "After this, your user disconnects". Doherty threshold bar. |
| 5 | 7.9s | Skeleton loading | Without: three dots at 320ms. With: skeleton shapes, "Feels ~200ms". |
| 6 | 7.9s | Skeleton loading (later) | Same at 770ms. |
| 7 | 12.6s | Optimistic UI | Without: spinner at 270ms. With: heart already shown, "Response: 0ms". |
| 8 | 12.6s | Optimistic UI (confirmed) | Without: heart at 720ms. With: "Server confirmed in background". |
| 9 | 17.3s | Progress feedback | Without: spinner at 550ms. With: Uploading 37%, Upload done. |
| 10 | 17.3s | Progress feedback (90%) | 1675ms vs 90%, Process done. |
| 11 | 17.3s | Progress feedback (complete) | 2000ms vs Complete! 100%, all steps done. "User stays engaged". |
| 12 | 21.5s | Split feed | Without: blank. With: skeleton on the right of the divider. |
| 13 | 21.5s | Split feed (loaded) | Content painted across both halves. |
| 14 | 26s | Outro | "< 400ms or the illusion of it." Skeleton, Optimistic, Progress tags. @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dt">
  <div class="dt-counter" id="timer"><b>0</b><small>ms</small></div>
  <div class="dt-up" id="upload"><div class="dt-up__title">Uploading...</div><div class="dt-up__bar"><i></i></div><div class="dt-up__pct">0%</div><div class="dt-up__steps"><span>Upload</span><span>Process</span><span>Done</span></div></div>
</div>
<script type="module">
  import { ResponseTimer, zone, optimistic, Progress, skeleton } from './pattern.js';
  const t = ResponseTimer(document.getElementById('timer')); t.start(); await fetchThing(); t.stop();
  const p = Progress(document.getElementById('upload')); p.set(37);
</script>
```

`zone(ms)` returns instant, tolerable or disconnect. `ResponseTimer(el)` counts real elapsed time into a `.dt-counter` and colours it by zone, capping at 400 and firing `dt:disconnect`. `optimistic(el, request)` flips `.is-on` now and reverts on rejection. `Progress(root).set(pct)` drives the bar, percent, title and step ticks. `skeleton(container, load)` shows the `.dt-feed--skel` layer until the promise resolves, then fades in `.dt-feed--live`.

## Where it belongs

Every screen open, list fetch, form submit, like, upload or save. Pick the technique by the wait: skeleton for loads, optimistic for reversible actions that almost always succeed, progress for work that genuinely takes longer than 400 ms.
