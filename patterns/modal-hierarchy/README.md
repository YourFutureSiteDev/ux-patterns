# Modal Hierarchy

> 5 overlays. Most apps pick the wrong one.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/modal-hierarchy](https://www.designmotionhq.com/patterns/modal-hierarchy) (no Instagram post). Category: interaction.

## The rule

Ask one question first: does it block the user? Yes means a modal with a full scrim and a single decision. No means pick by context: a bottom sheet on mobile, a popover anchored to its trigger, a drawer for navigation. Match the overlay's weight to the intent.

## Key insights

- Start with one question: does it block the user? If yes, reach for a modal; if no, choose by context: sheet, popover, or drawer.
- A modal takes over the screen with a full scrim and centers a single decision. Reserve it for critical or destructive choices (like "Delete account?") that must be answered before anything else.
- A bottom sheet is the mobile-first default: it slides up from the bottom edge, supports a drag handle and snap points, and keeps the screen behind it partly visible so users don't lose context.
- A drawer is an edge-anchored panel for navigation. It slides in from the side, dims only the area it covers, and leaves the app alive behind it.
- A popover anchors to the element that triggered it and stays small and contextual (~200px). Use it for lightweight menus and quick actions, never for blocking flows.
- Match weight to intent: modals interrupt, popovers and sheets stay non-blocking. Reaching for a modal when a popover would do adds friction to routine actions.

## Do / Don't

- **Do:** ask "does this block the user?" before picking any overlay.
- **Do:** reserve modals for critical or destructive decisions that demand a response.
- **Do:** anchor popovers to their trigger and keep them small and contextual.
- **Don't:** reach for a modal when a lightweight sheet or popover would do the job.
- **Don't:** use a full-screen scrim for a routine, non-blocking action.
- **Don't:** bury navigation inside a blocking overlay. Use an edge drawer instead.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 5 overlays. Pick the right one. | Phone wireframe with modal, popover, drawer, sheet and toast outlines glowing pink, teal and amber. |
| 2 | 2.5s | Modal · blocks everything | Dashboard dimmed under "Delete account?" with Cancel / Delete. DON'T card: 12-field signup modal. |
| 3 | 10.5s | Modal (checklist) | Destructive actions, Critical confirmations. |
| 4 | 11s | Bottom sheet · mobile-first overlay | Library screen; Filters sheet at its half snap point with Pop / Rock / Indie / Electronic chips and Sort by. |
| 5 | 19.5s | Bottom sheet (full, checklist) | Sheet at full height. Mobile-first, Swipeable, Partial heights. |
| 6 | 20s | Drawer · edge-anchored panel | Thibault G. drawer slid in from the left: Home, Projects, Settings, Team, Logout. Dashboard alive behind it. |
| 7 | 27s | Drawer (checklist) | Settings & navigation, Edge slide-in, Background stays alive. |
| 8 | 28s | Popover · anchored, contextual | Status popover under the filter button: Active, Pending, Closed. |
| 9 | 36s | Popover (measured, checklist) | "max 200px" bracket. Anchored to trigger, Tiny — under 200px. |
| 10 | 37.5s | Picking the right overlay | Does it block the user? YES → MODAL. NO → Mobile or contextual? |
| 11 | 45s | Picking the right overlay (leaves) | SHEET · mobile, POPOVER · anchored, DRAWER · side nav. |
| 12 | 46s | Outro | Modal, Sheet, Drawer, Popover tiles. Save this for your next overlay. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="mh" id="app" style="position:relative">
  <button id="filters">Filters</button>
  <div class="mh-popover" id="pop" hidden>…</div>
  <div class="mh-modal" id="confirm" hidden>…</div>
</div>
<script type="module">
  import { Overlay, pickOverlay } from './pattern.js';
  const app = document.getElementById('app');
  const pop = Overlay('popover', app, document.getElementById('pop'), { anchor: document.getElementById('filters') });
  document.getElementById('filters').addEventListener('click', pop.toggle);
  const confirm = Overlay('modal', app, document.getElementById('confirm'));
  pickOverlay({ blocks: true }); // 'modal'
</script>
```

`pickOverlay({ blocks, mobile, anchor, navigation })` returns `'modal' | 'sheet' | 'popover' | 'drawer'` following the reel's decision tree. `Overlay(kind, root, panel, opts)` gives every kind the right behaviour: a modal adds a full scrim, traps focus and needs an answer; a sheet slides up to its first snap point (`nextSnap()` moves between `snapPoints`, default half and full); a drawer slides in from the edge and dims only what it covers; a popover anchors under its trigger, caps itself at 200px and closes on outside click. All close on Escape and fire `mh:open` / `mh:close`.

## Where it belongs

Modal: delete, pay, irreversible confirmations. Sheet: mobile filters, pickers, share menus. Drawer: navigation and settings. Popover: column filters, quick actions, small menus. Never a modal for something the user could answer without stopping.
