# Skeleton Loading

> Your loading spinner is making the wait feel longer

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/skeleton-loading](https://www.designmotionhq.com/patterns/skeleton-loading) · [Instagram](https://www.instagram.com/reel/DWzKurXMLn4/) (288K views). Category: feedback.

## The rule

Show the shape of what is coming instead of a spinner. Mirror the final layout, shimmer in the reading direction, hold the skeleton under about two seconds, and skip loading states entirely for actions the user just performed.

## Key insights

- A spinner tells users "something is happening" but gives zero information about what or how long. That uncertainty is what makes waits feel slow.
- Skeleton screens preview the shape of the incoming content (avatar circle, text bars, image block) so the brain starts parsing the layout before the data arrives.
- The shimmer sweep matters: a static skeleton reads as "broken", an animated one reads as "in progress".
- Match the skeleton to the real content dimensions. A skeleton that jumps to a different layout on load is worse than a spinner.
- For actions the user just performed (posting, liking), skip loading states entirely: render the result optimistically and reconcile in the background.

## Do / Don't

- **Do:** shape skeletons to mirror the final layout, animate them, and keep them under ~2 seconds before showing partial content.
- **Don't:** use skeletons for sub-300ms loads (a flash of skeleton is noise) or mix spinners and skeletons in the same view.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Spinner vs Skeleton | Two Sarah Chen cards loading: a spinner over grey bars, a shimmering skeleton. Both load at 1s. "Same time. Different feel." |
| 2 | 3s | Secret 01 · The Brain | WAITING orb (spinner, STRESS meter 75%) vs PREDICTING orb (skeleton, ENGAGEMENT meter 90%). |
| 3 | 7.5s | Wait. / Here's what's coming. | Pink WAIT. left of a gradient divider, green HERE'S WHAT'S COMING. right. |
| 4 | 9s | Anxiety → Anticipation | ANXIETY fades down as ANTICIPATION rises under a pink-to-green arrow. |
| 5 | 12s | Secret 02 · Shimmer Direction | → NATURAL ✓ card sweeps left to right, ← REVERSED ✗ sweeps right to left, then dims. "Follow the reading flow". |
| 6 | 18s | Secret 03 · Content-aware | GENERIC (LAZY) three-bar skeleton vs CONTENT-AWARE (SMART) skeleton that mirrors the post. |
| 7 | 25.5s | Same 2 seconds | Both load the same post. Perceived: 2.4s (orange) vs 1.2s (green). "Same 2 seconds. Different perception." |
| 8 | 28.5s | Secret 04 · Optimistic UI | Alex Rivera post; the cursor taps like, 142 → 143 turns red instantly, INSTANT floats up. |
| 9 | 33s | Success vs Failure | Click → Show result → Server confirms (✓); failure path stops at Show result, then "Server fails". |
| 10 | 34.5s | User sees vs Server reality | Click → Result (0ms) beside Click → Request → Response (200ms). "The gap is invisible." |
| 11 | 37.5s | Waiting → Previewing → Anticipating | Three step boxes: spinner, bars, green preview. |
| 12 | 39s | Outro | Boxes shrink to the top, Design Psychology, Follow pill, @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="sk" id="post" style="position:relative;width:584px;height:325px">
  <div data-skeleton class="sk-card" style="inset:0">
    <div class="sk-sweep"></div>
    <div class="sk-bone sk-bone--circle" style="left:19px;top:48px;width:40px;height:40px"></div>
    <div class="sk-bone" style="left:69px;top:58px;width:78px;height:9px"></div>
    <div class="sk-bone sk-bone--block" style="left:21px;top:152px;width:542px;height:90px"></div>
  </div>
  <div data-content></div>
</div>
<script type="module">
  import { Skeleton, skeletonFrom, OptimisticToggle } from './pattern.js';
  Skeleton(document.getElementById('post'), {
    load: () => fetch('/api/post/1').then(r => r.text()),   // resolves with the real markup
    minShow: 300, maxShow: 2000
  });
</script>
```

`Skeleton` keeps the bones up for at least `minShow` (no flash under 300ms), fires `sk:slow` at `maxShow` so you can show partial content, and crossfades to the real markup (`sk:loaded`). `skeletonFrom(template)` builds bones sized from a content template's `data-bone` elements so nothing jumps. `Shimmer(el, 'rtl')` flips the sweep to follow the reading direction. `OptimisticToggle` renders a like instantly and rolls back on failure.

## Where it belongs

Feeds, cards, profiles, dashboards, anything whose layout is known before its data. Not for sub-300ms loads, not mixed with spinners in the same view, and not for the user's own actions (like, post, follow): render those optimistically.
