# Perceived Performance

> Same loading time. Different feeling. Here's how.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DUEjWRukT_2/) (984K views). Category: feedback. Instagram-only reel; insights and do/don't are derived from the on-screen copy.

## The rule

Perception is reality. With the same real duration, three tricks make a wait feel faster: show the layout before the content (skeleton screens), assume success and update instantly (optimistic UI), and front-load the progress bar so it starts fast (progress illusions).

## Key insights

- Same loading time, different feeling: the brain judges speed by what it sees during the wait, not by the clock.
- Secret #1, skeleton screens: a blank screen with a spinner gives the brain nothing; a skeleton previews the layout and the brain fills in the gaps.
- Secret #2, optimistic UI: don't wait for the server. Assume success, update the like instantly, and reconcile in the background.
- Secret #3, progress illusions: linear progress and psychological progress finish at the same moment, but a fast start reads as speed. Same duration, different curve.
- All three combined on one upload: skeleton placeholder, fast-start bar, instant "Done". Perception is reality, make it feel fast.

## Do / Don't

- **Do:** show a skeleton of the incoming layout instead of a blank panel and spinner.
- **Do:** flip likes, toggles and saves instantly, then confirm with the server.
- **Do:** race a progress bar to ~80% early and ease into the last stretch, while reporting the real time remaining.
- **Don't:** leave the user staring at an empty screen while the request runs.
- **Don't:** hold the UI hostage to a round-trip for a reversible action.
- **Don't:** lie about completion: the fast-start curve still lands on the true finish.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Two bars, same time vs feels faster. "Same loading time. Different feeling. Here's how." |
| 2 | 6s | Tricks your brain doesn't notice | 💀 Skeleton Screens, coming up. |
| 3 | 9s | Tricks your brain doesn't notice | ⚡ Optimistic UI, coming up. |
| 4 | 12s | Tricks your brain doesn't notice | 📊 Progress Illusions, coming up. |
| 5 | 15s | Secret #1 | ❌ Blank screen (spinner) vs ✅ Skeleton preview (shimmering bones). "Your brain fills in the gaps." |
| 6 | 22.5s | Secret #1 (loaded) | Both show Alex Chen's post; the skeleton side landed in the same shape. |
| 7 | 27s | Secret #2 | ❌ Wait for server vs ✅ Instant feedback, both at 143 (live like buttons). "Assume success. Update instantly." |
| 8 | 39s | Secret #3 | Linear 46% vs Psychological 80%, "2.2s remaining". |
| 9 | 43.5s | Secret #3 (finish) | 96% vs 99%, "0.2s remaining". "Fast start = perceived speed." |
| 10 | 51s | All three techniques combined | vacation_photo.jpg at 75%: Skeleton, Fast start, Instant UI. |
| 11 | 58.5s | All three (done) | Photo lands, "✓ Done!", green. "Perception is reality. Make it feel fast." |
| 12 | 63s | Outro | "Want more UX tricks? Follow for daily tips", + Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="pp">
  <article class="pp-post is-loading" id="post">…content + .pp-post__skel bones…</article>
  <button class="pp-like" id="like"><span class="pp-like__heart">…svg…</span><span class="pp-like__count">142</span></button>
  <div class="pp-bar pp-prog__bar pp-prog__bar--purple" id="bar"><div class="pp-bar__fill"></div></div>
</div>
<script type="module">
  import { SkeletonPost, OptimisticLike, ProgressBar, curves, remaining, UploadCard } from './pattern.js';
  SkeletonPost(document.getElementById('post')).load(fetch('/api/post'));          // bones until the data lands
  OptimisticLike(document.getElementById('like'), { count: 142, request: () => fetch('/api/like', { method: 'POST' }) });
  ProgressBar(document.getElementById('bar'), { curve: curves.psychological, duration: 3000 }).run();
  remaining(800, 3000);   // "2.2s remaining"
</script>
```

`SkeletonPost` toggles bones and content. `OptimisticLike` updates instantly and rolls back on failure (pass `optimistic: false` for the pessimistic control). `ProgressBar` drives a bar along `curves.linear` or `curves.psychological` over a fixed duration; `remaining` reports the honest time left. `UploadCard` combines all three on one upload.

## Where it belongs

Feeds and detail pages (skeleton), likes, saves and toggles (optimistic), uploads, installs and exports (fast-start progress). Anywhere the real wait can't shrink but the felt wait can.
