# Swipe Actions

> Your swipe actions are killing your UX

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/swipe-actions](https://www.designmotionhq.com/patterns/swipe-actions) · [Instagram](https://www.instagram.com/reel/DasD0mctu1m/) (110K views). Category: interaction.

## The rule

One swipe has two trip-wires: a short pull reveals a menu, a long pull past the commit line fires the action. Resist the finger between them, keep right = safe and left = destructive everywhere, teach the gesture once with a peek, and replace the confirm dialog with an undo net.

## Key insights

- Swipe actions are invisible UI. Without an affordance hint (a peek of the action on first launch, an onboarding nudge), most users never discover them.
- Destructive swipes need friction: a full swipe that instantly deletes is a data-loss bug waiting to happen. Reveal the button on partial swipe, require a tap (or full-swipe + undo toast) to commit.
- Colour-code by consequence: neutral actions on surface tones, destructive on red, and keep the mapping consistent across every list in the app.
- Never make swipe the only path. Every swipe action needs a visible fallback (long-press menu, detail-view button) for discoverability and accessibility.
- The row should resist past the reveal point (rubber-band), then let go with a haptic tick once the commit line is crossed. Resistance is feedback.

## Do / Don't

- **Do:** pair each swipe action with an undo window, and keep left/right semantics consistent app-wide.
- **Do:** half-reveal the buttons once on first launch, then never again.
- **Don't:** hide more than two actions per side; beyond that, users can't build muscle memory.
- **Don't:** swap the sides between lists. Muscle memory has no undo.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Inbox list, a row archiving away. "One gesture. Zero taps." |
| 2 | 3s | Threshold design | Pull distance: Delete peeks, track at 30%. |
| 3 | 6s | Threshold design | Short pull: Archive + Delete out, nothing fires. |
| 4 | 9s | Threshold design | Released past the line: Delete fills the row, track glows. |
| 5 | 12s | Rubber-band physics | Row at rest, empty displacement graph. |
| 6 | 16.5s | Rubber-band physics | Archive block revealed, curve flattens in the rubber-band zone. |
| 7 | 19.5s | Rubber-band physics | Haptic tick, row fully teal, "resistance dies" past commit. |
| 8 | 24s | Direction semantics | Right = safe (SAFE block), legend. "Muscle memory has no undo." |
| 9 | 27s | Direction semantics | Left = destructive (DESTRUCTIVE block). |
| 10 | 30s | Direction semantics | Sides swapped warning: DELETE on the right swipe. |
| 11 | 33s | Discoverability | Phone inbox, NEW USER, buttons half-revealed. Launch 1 peek hint. |
| 12 | 39s | Discoverability | Settled back, "no hint needed anymore". |
| 13 | 42s | Discoverability | Launch 2+: nothing, learned. |
| 14 | 45s | The safety net | Marcus Webb swiped to DELETE, no dialog. |
| 15 | 48s | The safety net | "Conversation deleted" toast with 3 s countdown and Undo. |
| 16 | 51s | The safety net | Row restored. "Delete fast. Forgive faster." |
| 17 | 54s | Outro | "The gesture is the UI." Follow for more mobile UX. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="sw">
  <div class="sw-row" id="row">
    <div class="sw-row__actions sw-row__actions--right"><button class="sw-action sw-action--archive" data-action="archive">Archive</button><button class="sw-action sw-action--delete" data-action="delete">Delete</button></div>
    <div class="sw-row__body">…avatar, name, preview, time…</div>
  </div>
</div>
<script type="module">
  import { SwipeRow, peekHint, UndoDelete } from './pattern.js';
  const row = document.getElementById('row');
  SwipeRow(row, { reveal: 180, commit: 480, left: 'delete', right: 'archive', onAction: name => { if (name === 'delete') UndoDelete(row, { toast: document.getElementById('toast'), ttl: 5000, onCommit: () => api.delete(id) }); } });
  peekHint(row);   // first launch only
</script>
```

`SwipeRow` tracks pointer travel, applies `rubberBand()` past the reveal distance, fires `sw:haptic` at the commit line and settles to closed, revealed or committed on release (`sw:move`, `sw:action` events). `peekHint` half-reveals once and remembers via localStorage. `UndoDelete` collapses the row, runs a countdown toast and restores on Undo. The `.sw-track` bar, `.sw-graph` and `.sw-legend` are the explanatory chrome from the reel.

## Where it belongs

Mail, messages, tasks, any list of rows with one or two frequent actions per side. Always with a visible fallback (long-press or detail button) and an undo toast for anything destructive.
