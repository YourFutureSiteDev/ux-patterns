# Resizable Panels

> Handles are UI. Six rules for one drag.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DcGQMxYNjxh/) (131K views). Category: interaction. No site page for this one; the insights below are read off the reel.

## The rule

A split-view handle is a real control. Give it a 1px line with a 12px grab target, clamp the width between a min and a max, snap closed instead of leaving a sliver, cover the page with an overlay while dragging, lock the resize cursor on the body, and remember the width across reloads.

## Key insights

- Grow the grab zone. The visible divider is 1px; the hit area is 12px. Nobody can catch a 1px line.
- Limits are the feature. Clamp between min 240 and max 640 so the sidebar can never crush the content or swallow the window.
- Commit to open or shut. A 44px sliver reads as broken; below the snap threshold the panel closes to width 0, which reads as intentional.
- Cover the page mid-drag. Without an overlay an iframe or embed eats the mouse and the drag freezes; a full-window overlay with pointer-events none on the embed keeps the drag held.
- No flicker on drift. A cursor set only on the handle flips back to an arrow the moment the pointer drifts; set col-resize on the body for the whole drag.
- Survive the reload. Store the width (panelW: 460px) and restore it on load instead of resetting to the default.

## Do / Don't

- **Do:** draw a 1px line and hit-test a 12px zone around it.
- **Do:** clamp the width and snap to closed below a threshold.
- **Do:** append an overlay and a body-level cursor for the duration of the drag, then remove both.
- **Don't:** let a panel rest at a few pixels wide.
- **Don't:** trust the handle's own cursor rule while the pointer is moving fast.
- **Don't:** forget the width on the next page load.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Halyard split view, handle hovered. "A split view. Looks fine." |
| 2 | 1.5s | Hook | Sidebar dragged to width: 0, window flagged pink. |
| 3 | 3s | Hit area | 12px grab zone highlighted, cross-section: 12px grab around a 1px line. |
| 4 | 12s | Clamp | min 240 and max 640 guides, sidebar width 340px slider. |
| 5 | 13.5s | Clamp | Handle pinned at max, 640px lit. |
| 6 | 21s | Snap | Halfway = bug (44px sliver) vs Snap closed (width: 0). |
| 7 | 27s | Overlay | Overlay off: iframe ate the mouse, panel froze. |
| 8 | 33s | Overlay | Overlay on: pointer-events: none, drag held. |
| 9 | 37.5s | Cursor | .handle cursor vs body cursor: col-resize. |
| 10 | 46.5s | Persist | Reload resets to 340 vs reload restores panelW: 460px. |
| 11 | 51s | Outro | Six-card recap, designmotionhq.com, Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="rsp"><div id="app"></div></div>
<script type="module">
  import { renderSplit, ResizablePanel } from './pattern.js';
  const win = renderSplit(document.getElementById('app'), { width: 227 });
  ResizablePanel(win, { min: 240, max: 640, snap: 120, key: 'panelW' });
</script>
```

`renderSplit` draws the window (sidebar, handle, main, optional guides, tags, iframe block and cursor for stills). `ResizablePanel` wires the handle: pointer drag through the 12px zone, clamp to min and max, snap to 0 under `snap`, an `.rsp-overlay` over the window plus `body.rsp-resizing` (col-resize everywhere) while dragging, and the width saved to `localStorage[key]` on release. Double-click the handle to toggle closed. Event `rsp:resize` carries the logical width.

## Where it belongs

Sidebars, inspector panes, split editors, file trees, any two-pane layout the user is allowed to resize. Not for layouts where the second pane has a fixed minimum that would break at the snap point.
