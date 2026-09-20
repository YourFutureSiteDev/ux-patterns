# Drag and Drop

> The board does the thinking: moving a card is moving state.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/drag-and-drop](https://www.designmotionhq.com/patterns/drag-and-drop) · [Instagram](https://www.instagram.com/reel/DZCk62ftEPU/) (25.5K views). Category: interaction.

## The rule

Confirm the grab with three cues at once (scale, shadow, tilt), reveal the drop zone before release (an insertion line between items, a fill for a whole column), snap on structured surfaces and stay free on canvases, and follow every drop with a five-second undo toast.

## Key insights

- A grabbed item needs to feel like it left the surface. Confirm the lift with three cues at once: a slight scale-up, a deeper shadow, and a small tilt.
- Drop zones speak first. Reveal where the item will land before release, not after. The drag should never feel like a guess.
- Match the drop-zone cue to its scope: an insertion line to slot between existing items, a filled highlight to land inside a whole column.
- On structured surfaces, snap the item to the nearest valid slot; reserve free positioning for canvases where any coordinate is valid.
- While dragging on a snapping surface, expose the valid target slots (dashed outlines) so the destination is never ambiguous.
- A drag is easy to fumble. Pair every drop with a short undo toast (~5 seconds) so a wrong move costs one click, not a redo.

## Do / Don't

- **Do:** confirm pickup with scale, shadow, and tilt together so the grab reads instantly.
- **Do:** highlight the exact drop target during the drag, before the user lets go.
- **Do:** offer a brief undo after a drop so a misdrop is one click to reverse.
- **Don't:** snap a released card into place with no lift or shadow; it feels like nothing happened.
- **Don't:** force pixel-precise placement when snapping to a valid slot would do the work.
- **Don't:** make a wrong drop permanent with no way to reverse it.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Kanban board mid-drag: Design review lifted out of In progress, heading for Done. |
| 1b | 1.5s | Hook | Dropped into Done, counts update. "The board does the thinking." |
| 2 | 3s | Pick up | Design review card at rest, open-hand cursor. |
| 2b | 6s | Pick up | Card lifts (scale, shadow, tilt). Cursor changes, Card lifts, Background fades. "Three signals = I'm holding this". |
| 3 | 10.5s | Drop zones | Between items → line, whole column → fill. Insertion line in Todo, Done column filled. |
| 3b | 18s | Drop zones | Column fill vs insertion line side by side. "No preview = blind drop." |
| 4 | 19.5s | Snap or free | Kanban with dashed snap slots vs a free canvas grid. "Structured? Snap. Canvas? Free." |
| 5 | 30s | Undo | Design review landed in Done; toast "Moved to Done · Tap Undo to send it back" with a draining UNDO ring. |
| 6 | 36s | Outro | Follow for more interaction patterns. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dd dd-board" id="board">
  <div class="dd-col"><div class="dd-col__head">Todo<span class="dd-col__count">1</span></div>
    <div class="dd-card"><div class="dd-card__title">Audit dashboard</div></div>
  </div>
  <div class="dd-col"><div class="dd-col__head">Done<span class="dd-col__count">0</span></div></div>
</div>
<div class="dd dd-toast" id="toast" hidden>…<button class="dd-undo"><svg viewBox="0 0 60 60"><circle class="track" cx="30" cy="30" r="28"/><circle cx="30" cy="30" r="28"/></svg>UNDO</button></div>
<script type="module">
  import { Board, UndoToast } from './pattern.js';
  Board(document.getElementById('board'), { onMove: ({ card, to, undo }) => {
    toast.hidden = false; toast.querySelector('b').textContent = 'Moved to ' + to.querySelector('.dd-col__head').firstChild.textContent;
    UndoToast(toast, { seconds: 5, onUndo: undo, onExpire: () => toast.hidden = true });
  } });
</script>
```

`Board` makes every `.dd-card` draggable with the pointer: pickup clones a lifted ghost (`.is-lifted`: scale, shadow, tilt) and dims the source; while dragging it inserts a `.dd-line` before the card under the pointer or marks an empty column `.is-target`; drop snaps the card into that slot, updates the column counts and fires `dd:move`. `UndoToast(el, { seconds })` drains the ring on the UNDO button and resolves through `onUndo` or `onExpire`. `snapTo(point, slots, radius)` returns the nearest valid slot, or null so a canvas can stay free.

## Where it belongs

Kanban boards, sortable lists, file trees, playlist reorders: any structured surface where a drop changes state. On a free canvas, keep the lift and the undo but skip the snapping.
