# Loading States System

> Stop using skeletons for everything. Loading is a system, not a default.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/loading-states-system](https://www.designmotionhq.com/patterns/loading-states-system) · [Instagram](https://www.instagram.com/reel/DXW0KiCslIW/) (102K views). Category: feedback.

## The rule

Pick the loading pattern from what you know about the wait: known shape and over 300ms is a skeleton, short unknown wait is a spinner, known percentage over 3s is a progress bar, reversible action is optimistic UI, and anything under 300ms shows nothing at all.

## Key insights

- Loading is a system: match the pattern to what you actually know about the wait (its shape, its duration, its progress). One default applied everywhere is the tell of a lazy UI.
- Skeletons are for when you know the content's shape (cards, lists, articles) and the wait exceeds ~300ms. They preview the layout that is about to load.
- Spinners fit short waits of unknown duration, under ~3s. Never stretch one across a full-page load: an endless spinner with no context reads as frozen.
- Progress bars belong to waits over ~3s where you know the percentage (uploads, installs, exports). Pair the bar with real meta (time remaining, speed) so the number earns trust.
- Optimistic UI is the move for reversible actions like likes, saves and bookmarks: update instantly, reconcile with the server in the background, roll back only on failure.
- Under ~300ms, show nothing at all. A brief flash of a loading state feels more broken than a slight delay.

## Do / Don't

- **Do:** pick the pattern from what you know: known shape, skeleton; known percentage, progress; short unknown wait, spinner.
- **Do:** apply the response instantly for reversible actions, then sync in the background and roll back only on failure.
- **Do:** let sub-300ms responses land with no loading indicator at all.
- **Don't:** reach for a skeleton on every fetch regardless of the content shape or how long it takes.
- **Don't:** cover a whole page with a spinner for long or open-ended loads.
- **Don't:** flash any loading state for a response that resolves in under 300ms.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 5 loading patterns | Five tiles (skeleton, spinner, progress, optimistic, nothing). "1 right choice per context." |
| 2 | 3s | 01 · Skeleton | Article card as shimmering bones. |
| 3 | 4.5s | 01 · Skeleton (loaded) | Marcus Lee, "The Loading State Hierarchy". Chips: KNOWN SHAPE, > 300ms. |
| 4 | 12s | 02 · Spinner, right | "Save changes" form, pink button with spinner "Saving...". |
| 5 | 15s | 02 · Spinner, wrong | Full-panel spinner "Loading dashboard..." No context. No progress. No trust. Chips: UNKNOWN DURATION, < 3s. |
| 6 | 21s | 03 · Progress bar | project-build.zip at 44%, 6.2 of 14.2 MB, 1.5 MB/s, 4s remaining (climbs live). |
| 7 | 25.5s | 03 · Progress bar (done) | 100%, green check, "✓ Uploaded". Chips: KNOWN %, > 3s, BUILDS TRUST. |
| 8 | 30s | 04 · Optimistic UI | @designmotionhq post, 12,423 likes, cursor over the heart. |
| 9 | 31.5s | 04 · Optimistic UI (liked) | Heart filled, 12,424 likes, "✓ Synced", 0ms click to 300ms synced timeline. |
| 10 | 33s | 04 · Optimistic UI (chips) | Working like button. Chips: INSTANT FEEDBACK, ROLLBACK ON FAIL. |
| 11 | 39s | 05 · Show nothing | "With skeleton flash" (bones flash) vs "Show nothing" (content lands). |
| 12 | 42s | 05 · Show nothing (verdict) | ✕ / ✓ badges, "200ms of skeleton feels broken". Chips: < 300ms, SHOW NOTHING. |
| 13 | 48s | Outro | Five labelled tiles, "Save this for your next UI.", follow pill. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ls">
  <article class="ls-article" id="post">
    <div class="ls-article__content">…</div>
    <div class="ls-skel"><span class="ls-bone" style="…"></span>…</div>
  </article>
  <div class="ls-upload" id="upload">…</div>
</div>
<script type="module">
  import { pickLoadingState, Skeleton, SpinnerButton, UploadProgress, OptimisticLike, withDelayedLoader } from './pattern.js';
  pickLoadingState({ expectedMs: 800, knownShape: true });   // -> 'skeleton'
  const skel = Skeleton(document.getElementById('post'), { delay: 300 });
  skel.load(fetch('/api/post').then(r => r.json()));           // bones only if it takes longer than 300ms
  UploadProgress(document.getElementById('upload')).set({ pct: 44, done: '6.2', total: '14.2', speed: '1.5', remaining: 4 });
</script>
```

`pickLoadingState` returns the pattern name for a wait. `Skeleton` shows bones only past the flash guard. `SpinnerButton` swaps a button into its busy state. `UploadProgress.set()` drives the bar, percentage and meta. `OptimisticLike` flips the like on tap, shows "Synced" when the server agrees and rolls back on failure. `withDelayedLoader` is the generic "show nothing under 300ms" wrapper.

## Where it belongs

Every fetch, save, upload and toggle in an app. Skeleton on feeds and detail pages, spinner on buttons and small fetches, progress bar on uploads and exports, optimistic on likes and saves, nothing on anything that resolves in under 300ms.
