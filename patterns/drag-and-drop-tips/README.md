# Drag and Drop Tips

> Five upload signals: the zone answers back, progress is honest, a failure retries inline, the result shows a preview, and every file gets its own lane.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DZ2Dp5wt0pJ/) (1.2M views; Instagram-only, no site page). Category: interaction. Caption: "Drag and drop UX tips".

## The rule

A file drop is five moments, and each one needs a signal: border + glow + copy while the file hovers, a real percentage with time left while it uploads, an inline Retry that resumes from where it died, a thumbnail with type, size and proof when it lands, and independent rows so one failure never blocks the rest.

## Key insights (from the on-screen copy)

- Signal 01, drag feedback: users hesitate when nothing moves. The zone has to answer back with three signals before the drop: a border, a glow, and the copy flipping to "Release to upload" with the file name and size.
- Signal 02, honest progress: a spinner hides the truth. Show the percent, the time left and the speed so the user can decide to wait or walk away.
- Signal 03, inline retry: it dies at ninety percent. Keep the file in memory, say "Paused at 90%", and let one tap resume from 90% instead of starting over.
- Signal 04, upload preview: a filename is not feedback. Show the thumbnail, the type, the size and the proof ("Uploaded just now"), with Replace and Remove right there.
- Signal 05, independent queue: every file, its own lane. Five files means five bars and five states; one failure gets its own Retry and never blocks the others.

## Do / Don't

- **Do:** change the border, add a glow and swap the copy the moment a file is dragged over the zone.
- **Do:** show percent, time left and speed during the upload.
- **Do:** keep the file loaded on failure and resume from the pause point on Retry.
- **Do:** render a preview card (thumbnail, type, size, proof) once the upload lands.
- **Don't:** show a static zone that does nothing until the drop.
- **Don't:** replace progress with a spinner and "Uploading...".
- **Don't:** make a failed upload start from zero, or let one failed file stall the queue.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Same brief.pdf dragged over a dead grey zone and a live teal one. |
| 1b | 1.5s | Hook | BROKEN: spinner, "Uploading...". SAFE: check, "brief.pdf uploaded". |
| 2 | 3s | Signal 01 · Drag feedback | "Nothing reacts." hero-banner.png over a zone that does not respond. |
| 2b | 9s | Signal 01 · Drag feedback | "It has to answer back." Border, Glow, Copy: "Release to upload · hero-banner.png — 2.4 MB". |
| 3 | 15s | Signal 02 · Honest progress | Mystery spinner vs honest card: 99%, 0s left, 1.9 MB/s. percent · time left · wait or walk away. |
| 4 | 24s | Signal 03 · Inline retry | demo-recording.mp4 at 90%, "Paused at 90% — file kept in memory", Upload failed · Retry. |
| 4b | 27s | Signal 03 · Inline retry | Resuming from 90%… 99%. connection lost · file kept loaded · one tap resumes. |
| 5 | 30s | Signal 04 · Upload preview | TEXT ONLY "IMG_4032.jpg uploaded" vs PREVIEW card: thumbnail, JPG, 2.4 MB, Uploaded just now, Replace/Remove. |
| 6 | 39s | Signal 05 · Independent queue | Uploading 5 files, 2 of 5 — 1 failed: two done, one 100%, one Retry, one 93%. |
| 6b | 45s | Signal 05 · Independent queue | 4 of 5 done, the retried file at 91%. |
| 7 | 48s | Outro | Three ticked file pills, @designmotionhq, Follow for more UX engineering, Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dt">
  <div class="dt-zone" id="zone"><span class="dt-zone__icon">…</span><div class="dt-zone__title">Drop your file here</div><div class="dt-zone__hint">PNG, JPG, PDF — up to 50 MB</div></div>
  <div id="queue"></div>
</div>
<script type="module">
  import { DropZone, UploadQueue, HonestProgress, InlineRetry } from './pattern.js';
  DropZone(document.getElementById('zone'), { onFiles: files => UploadQueue(document.getElementById('queue'), files, { upload: (file, onProgress) => api.put(file, onProgress) }) });
</script>
```

`DropZone` toggles `.is-over` (border, glow) and swaps the copy while a file hovers, then emits `dt:files` on drop. `UploadQueue` gives every file its own row and its own request; a rejected upload marks only that row `.is-failed` with a Retry button that re-runs it. `HonestProgress(card).set(percent, { speed, secondsLeft })` drives the honest card. `InlineRetry(card, { from, request })` keeps the file and resumes from the pause point on Retry.

## Where it belongs

File pickers, attachment areas, bulk media uploads, import flows. Anywhere a user lets go of a file and needs to know it landed.
