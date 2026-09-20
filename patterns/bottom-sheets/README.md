# Bottom Sheets

> Your thumb can't reach that menu.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/bottom-sheets](https://www.designmotionhq.com/patterns/bottom-sheets) (no Instagram post). Category: interaction.

## The rule

Phones grew, thumbs did not. Anchor menus and actions to the bottom third where the thumb rests, keep the page visible behind the sheet, give it snap points (peek, full) and drag-to-dismiss, dim the page with a scrim and lock its scroll while the sheet is open.

## Key insights

- Screens keep getting taller while thumbs stay the same length, turning the top of the display into a dead zone for one-handed use.
- Anchor menus and actions to the bottom of the screen, where the thumb naturally rests, instead of the top-right corner most navs default to.
- Unlike a full modal that blocks everything, a bottom sheet keeps the underlying page visible so users never lose their place.
- Add snap points so the sheet can rest half-open or expand to full height, matching how much content the user actually needs.
- Support drag-to-dismiss: a downward gesture maps to the sheet's direction and needs no tiny close target to hit.
- Dim the background with a scrim and lock body scroll so only the sheet moves, keeping focus on the active task.

## Do / Don't

- **Do:** place primary actions within thumb reach at the bottom of the screen.
- **Do:** keep the page visible behind the sheet to preserve context.
- **Do:** offer snap points and drag-to-dismiss for flexible, gesture-friendly height.
- **Don't:** bury frequent menus in the top-right dead zone on tall phones.
- **Don't:** block the whole screen with a full modal when a sheet would do.
- **Don't:** leave the background scrollable while the sheet is open.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Top-right menu (Account, Notifications, Settings, Log out) over a dimmed feed, a pointing hand stuck mid-screen. "Your thumb can't reach." |
| 2 | 3s | The problem | "Phones grew. Your thumb didn't." A tall Feed phone. "Menus still live up there". |
| 3 | 7.5s | The problem | Pink dead zone up top, teal comfort zone below, the dashed reach arc, "Reach stays the same". |
| 4 | 12s | The fix | "Bring actions to the hand". Heat map: pink top, amber middle, teal bottom third; Like / Share / Save still in a top dropdown. |
| 5 | 18s | The fix | The same actions in a bottom sheet (Actions: Like, Share, Save). "Bottom third = comfort zone". |
| 6 | 21s | Modal vs sheet | Full modal (Details, PAGE GONE) beside a bottom sheet over Places (Address, Open until 9pm, 4.8 rating). "Context stays". |
| 7 | 30s | Snap points: peek | Library with the Now Playing sheet at its PEEK snap, snap dots at the right edge. "Drag to dismiss". |
| 8 | 33s | Snap points: full | The sheet expanded to FULL (Now playing, Up next, Liked songs). |
| 9 | 39s | Scrim and scroll lock | Feed dimmed and PAGE LOCKED behind a Comments sheet. "Lock the page". |
| 10 | 46.5s | Scrim and scroll lock | Without the lock: BOTH SCROLLING, pink scrim, "Skip it — chaos". |
| 11 | 49.5s | Outro | "Build for the thumb." Player with a Now Playing sheet. Save this for your next app. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="bs">
  <div class="bs-screen" style="position:relative;height:100vh">
    <div class="bs-app" id="page">…the page…</div>
    <div class="bs-scrim" id="scrim" style="opacity:0"></div>
    <div class="bs-sheet is-hidden" id="sheet">
      <div class="bs-sheet__title">Now Playing</div>
      <div class="bs-sheet__row"><i>♫</i>Now playing</div>
      <div class="bs-sheet__row"><i>≡</i>Up next</div>
    </div>
  </div>
</div>
<script type="module">
  import { BottomSheet } from './pattern.js';
  const sheet = BottomSheet(document.getElementById('sheet'), { scrim: document.getElementById('scrim'), page: document.getElementById('page'), peek: 180 });
  document.getElementById('open').addEventListener('click', () => sheet.open('peek'));
</script>
```

`BottomSheet(el, { scrim, page, peek })` positions the sheet at the bottom, snaps between `peek` and `full` (`data-snap`), follows a pointer drag and settles on the nearest snap point or dismisses on a downward fling, shows the scrim and sets `overflow: hidden` on `page` while open, closes on scrim tap or Escape, and fires `bs:snap`. Returns `{ open, close, snapTo, snap }`. `reachZones(height)` returns the dead / stretch / comfort bands for a screen height.

## Where it belongs

Action menus, share sheets, filters, now-playing and details panels on phones. Anything a thumb should reach without a stretch. Not for destructive confirmations that need the page blocked, and not on desktop where a popover or dialog is closer to the pointer.
