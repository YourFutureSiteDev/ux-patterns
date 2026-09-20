# File Upload UX

> Same file. One upload feels broken. One feels safe.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/file-upload-ux](https://www.designmotionhq.com/patterns/file-upload-ux) (no Instagram link in the catalog). Category: forms.

## The rule

Upload is a system of five signals: the dropzone answers back on drag, progress is honest (percent, time left, rate), failure gets an inline retry that resumes, success shows a preview as proof, and every file in a queue gets its own lane.

## Key insights

- Upload is a system of states (drag feedback, honest progress, error recovery, preview, and queue), not a bare file input.
- A dropzone has to answer back the moment a file hovers over it. Border, glow, and copy shift give three signals before the drop, so users never hesitate over a dead zone.
- A spinner hides the truth. Show percent complete and time remaining so the user can decide to wait or walk away.
- When an upload dies at 90%, never make them start over. Inline retry keeps the file loaded and resumes in one tap.
- A filename is not feedback. Show the thumbnail, type, and size as visual proof you received the right file.
- In a multi-file queue, each item gets its own progress and its own retry; one failure never blocks the other nine.

## Do / Don't

- **Do:** react to drag-over with a border, glow, and copy change before the drop.
- **Do:** show percent complete and estimated time remaining during upload.
- **Do:** offer inline retry that keeps the file loaded so one tap resumes.
- **Don't:** rely on a spinner that hides how far along the upload really is.
- **Don't:** force users to re-select and start over after a failed upload.
- **Don't:** treat a bare filename as confirmation the right file arrived.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1a | 0s | Hook (drag) | brief.pdf dragged over a dead zone and a live one. |
| 1b | 1.5s | Hook (result) | BROKEN: spinner, "Uploading…". SAFE: check, "brief.pdf uploaded". |
| 2a | 3s | Signal 01 · Nothing reacts | hero-banner.png hovers, dropzone stays dead. "Users hesitate when nothing moves." |
| 2b | 7.5s | It has to answer back | Teal dashed border, glow, "Release to upload", chips 1 Border, 2 Glow, 3 Copy. |
| 2c | 12s | Three signals | Same, caption "Three signals, before the drop." |
| 3a | 13.5s | Signal 02 · 4% | MYSTERY ring with "?" vs HONEST demo-recording.mp4 at 4%. |
| 3b | 16.5s | 60% | 8s left, 2.5 MB/s; chips percent, time left, wait or walk away. |
| 3c | 21s | 99% | 0s left, 1.9 MB/s. "Let them decide — wait, or walk away." |
| 4a | 22.5s | Signal 03 · 76% | Single upload card, Uploading…. |
| 4b | 24s | Dies at 90% | Paused at 90% — file kept in memory, Upload failed / Connection lost, Retry. |
| 4c | 27s | Resuming | 99%, "Resuming from 90%…", chip one tap resumes. |
| 4d | 30s | Complete | 100%, Upload complete. "Never make them start over." |
| 5a | 33s | Signal 04 · Preview | TEXT ONLY "IMG_4032.jpg uploaded" vs PREVIEW thumbnail, JPG 2.4 MB, 4032 × 3024, Uploaded just now. |
| 5b | 36s | Preview with actions | Replace / Remove. Legend Thumbnail · Type · Size · Proof. |
| 6a | 39s | Signal 05 · Queue | Uploading 5 files, 0 of 5 done, five lanes at 15%, 7%, 11%, 28%. |
| 6b | 42s | One failed | 4 of 5 — 1 failed, demo-recording.mp4 has its own Retry. |
| 6c | 45s | All done | 5 of 5 done. "One failure never blocks the others." |
| 7 | 48s | Outro | Stacked done chips, @designmotionhq, Follow for more UX engineering, Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="fu">
  <div class="fu-zone" id="zone"><span class="fu-zone__title">Drop your file here</span><span class="fu-zone__sub">PNG, JPG, PDF — up to 50 MB</span><input type="file" hidden></div>
  <div id="lanes"></div>
</div>
<script type="module">
  import { Dropzone, UploadQueue, xhrSend, preview } from './pattern.js';
  Dropzone(document.getElementById('zone'), { onFiles: files => {
    UploadQueue(files, { send: xhrSend('/upload'),
      onLane: lane => console.log(lane.file.name, lane.pct + '%', lane.status),
      onSummary: s => console.log(s.label) });
    files.forEach(async f => console.log(await preview(f)));
  } });
</script>
```

`Dropzone` flips `.is-over` and the copy on dragover. `Upload(file, { send })` reports `{ pct, eta, rate, status }` and `retry()` resumes from the last byte with the file still in memory. `UploadQueue` runs lanes independently with per-lane retry and a summary label ("4 of 5 — 1 failed"). `preview(file)` returns thumbnail URL, type, size and dimensions. `xhrSend(url)` is a resumable sender using `Content-Range`; `fakeSend` drives the demo.

## Where it belongs

Any file input: avatars, attachments, bulk media, document intake. The five signals apply whether it is one file or fifty.
