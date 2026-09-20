# Pull to Refresh

> Pull is a promise.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/Db78b8stxa6/) (28.4K views). Category: interaction. No site page for this one; the insights below are read off the reel.

## The rule

A pull only fires past a clear threshold, resists like the content has weight, ticks once at the line before the finger lets go, hands the stretch ring over to the spinner, overshoots then settles, and never freezes the list while it loads.

## Key insights

- Let go early and nothing loads. The refresh fires past the threshold, never before, so a short scroll bounce cannot trigger a reload.
- Make it carry weight. Map finger distance to content distance elastically (finger 220, content 106) instead of 1:1; the cheap version feels like paper, the elastic one feels like a list with mass.
- The stretch becomes the spinner. The ring that fills while you pull is the same ring that spins while it loads; there is no swap to a second indicator.
- It ticks before you let go. One haptic at the threshold, while the finger is still down, tells the user the release will fire.
- Overshoot, then settle. On release the list rubber-bands past its rest position and springs back; a hard stop reads as a glitch.
- Never freeze the list. The spinner runs above live rows, and new items land in place at the top with a highlight instead of blanking the screen.

## Do / Don't

- **Do:** fire only past the threshold and snap back without a reload below it.
- **Do:** apply resistance so the content moves about half as far as the finger.
- **Do:** fire a single haptic tick at the threshold, before release.
- **Don't:** map the pull 1:1 to the finger.
- **Don't:** hard-stop the list on release; let it overshoot and settle.
- **Don't:** blank or lock the list while the spinner runs.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Inbox pulled 94px with a pink ring, pull-distance bar. |
| 2 | 1.5s | Hook | Finger let go early, bar at 0px: "Let go early. Nothing loads." |
| 3 | 3s | Threshold | Dashed threshold line, ring past it. release below snaps back, release past fires. |
| 4 | 9s | Resistance | Elastic (finger 220, moved 106) vs 1:1 cheap (moved 220), drag-to-move graph. |
| 5 | 18s | Handoff | stretch, full ring, spinner: the same ring through all three states. |
| 6 | 24s | Haptic | Armed ring with ripples, timeline pull, tick, release, load; feedback before release. |
| 7 | 34.5s | Bounce | Rubber band vs Hard stop, position-after-release curve settling to rest. |
| 8 | 40.5s | Scroll alive | Spinner running above a live list, Dana Osei lands in place. |
| 9 | 48s | Outro | Six-card recap, designmotionhq.com, Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ptr"><div id="phone"></div></div>
<script type="module">
  import { renderInbox, PullToRefresh } from './pattern.js';
  const phone = renderInbox(document.getElementById('phone'), { tone: 'teal' });
  PullToRefresh(phone, {
    threshold: 80,
    load: () => fetch('/api/inbox?since=latest').then(r => r.json())   // resolves to an array of rows
  });
</script>
```

`renderInbox` draws the phone with a list. `PullToRefresh` makes it live: pointer drag with `elastic` resistance, one `navigator.vibrate` tick at the threshold (event `ptr:tick`), spinner handoff past it (event `ptr:refresh`), a damped spring on release, and rows from `load()` inserted at the top without clearing the list. `renderInbox` also takes static options (`pull`, `state`, `threshold`, `ripple`, `topLine`, `finger`) to freeze any moment for a still.

## Where it belongs

Feeds, inboxes, timelines and any mobile list the user refreshes by hand. Not on desktop tables, not on pages that already poll, and never as the only way to load new content.
