# Calendar Week View

> Forty events, zero overlap. Six layout rules make a week view read at a glance.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DdbOcQ9tpKW/) (43.9K views), no designmotionhq page. Category: interaction.

## The rule

A week view is a system of six rules: seven columns and one hour a row that opens at now; a 3 px colour stripe with a 10 % fill instead of a full fill; events that share an hour split the column side by side; height is duration at 60 px an hour with a one-line minimum; drag draws a new event snapped to 15 minutes and only the bottom edge resizes; all-day events live in a pinned row above the grid.

## Key insights

- Seven columns, one hour a row, and open scrolled to now: `scrollTop = 0 // 00:00` is a bug, not a default.
- A stripe, not a fill. White on amber is 1.9 : 1; a 3 px stripe on a 10 % fill reads at 11.4 : 1 and the week stops looking like a rainbow.
- Same hour, side by side. Two events at 2:00 each take half the column; a third makes it thirds. Nothing hides behind "+1 more".
- Height is duration: 2 h is 120 px, 1 h is 60 px, 15 min is clipped to one 30 px line, 5 min is a 6 px bar you hover for the title.
- Drag draws, snap holds: dragging on empty grid draws the event, snapped to 15 min; the top edge never resizes, only the bottom.
- All day lives in a pinned row. A 00:00 to 24:00 block eats the day; the pinned row stays while the grid scrolls.

## Do / Don't

- **Do:** open the week at the current hour and mark it with a red now line.
- **Do:** colour by a left stripe on a faint fill so titles keep their contrast.
- **Do:** lay overlapping events out in columns inside the hour they share.
- **Do:** make height mean duration, with a one-line floor and a bar under ten minutes.
- **Don't:** fill event blocks with saturated colour and print the title on top.
- **Don't:** hide the third event behind a "+1 more" chip when the column can split.
- **Don't:** turn an all-day event into a full-height block; pin it above the grid.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | One week. Forty events. | Full week, stripe style, now line at 10:40 on Tuesday, legend Work 15 / Personal 15 / Team 10. "40 events · 0 overlap" |
| 2 | 3s | Seven columns. One hour a row. | Grid from 8 AM; chips columns 7, rows 24, scroll 8:00. "Opens at now" |
| 3 | 10.5s | Seven columns (scrolled) | Grid scrolls to 6 AM; scroll 6:00 lit; `scrollTop = 0 // 00:00` struck. |
| 4 | 15s | A stripe, not a fill. | Three-day zoom with times; Calendars card; Title on the fill 1.9 : 1 vs 11.4 : 1; Full fills vs Stripes minis. |
| 5 | 21s | A stripe, not a fill. (struck) | FULL FILLS struck through. "3 px stripe · fill at 10 %" |
| 6 | 24s | Same hour, side by side. | Design sync and 1:1 Maya at 2:00 share Tuesday at 50 %; Sprint review dimmed "+1 more". "2 visible · 0 hidden" |
| 7 | 30s | Same hour (three) | Three columns at 33 %; "+1 more" struck. "3 visible · 0 hidden" |
| 8 | 33s | Height is duration. | Single day: 5 min bar, 2 h = 120 px, 1 h = 60 px, 15 min = 30 px; rule rows. "60 px an hour · min 1 line" |
| 9 | 42s | Drag draws. Snap holds. | Dashed ghost 3:00 - 3:30 while dragging; start / end / dur / snap chips. |
| 10 | 48s | Drag draws (committed) | New event 4:00 - 4:45; drag state chips. |
| 11 | 51s | Drag draws (resize) | Bottom edge dragged to 5:00; "resize: top edge" struck. "Snap 15 min · resize bottom only" |
| 12 | 54s | All day lives in a pinned row. | Offsite and Leo OOO drawn as full-day blocks: "eats the day". |
| 13 | 58.5s | All day (pinned) | Pinned all-day row, grid scrolled to 11:00; "00:00 — 24:00 block" struck. "Pinned row · the grid scrolls" |
| 14 | 61.5s | Six rules. One week that reads. | Six rule tiles, mini week, Claude Code palette with /ux-design, /ux-audit, /ux-review, /restyle. |
| 15 | 66s | Think like a senior UX designer. | /ux-review typed and highlighted. "Link in bio" |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="cw">
  <div class="cw-panel" style="width:620px;height:618px">
    …top bar, day header, optional .cw-allday row…
    <div class="cw-grid" style="height:509px"><div class="cw-grid__inner" id="grid" style="top:16px"></div></div>
  </div>
</div>
<script type="module">
  import { weekHTML, DragCreate, layoutDay, eventBox, snap, fmt } from './pattern.js';
  const days = [{ label: 'MON', num: 14 }, { label: 'TUE', num: 15, today: true }, …];
  grid.innerHTML = weekHTML({ days, events, hourH: 60, from: 8, to: 20, colW: 78, gutter: 63, now: { day: 1, hour: 10.67 } });
  DragCreate(grid, { hourH: 60, from: 8, onCommit: ev => api.create(ev) });
</script>
```

`layoutDay(events)` assigns `col / cols` to overlapping events (rule 3). `eventBox(e, { hourH, from })` turns start/end into top/height with the one-line floor and the sub-10-minute bar (rule 4). `weekHTML(cfg)` renders hour lines, labels, columns, events and the now line. `DragCreate(grid, opts)` draws a snapped ghost on drag and commits it (rule 5). `contrast(a, b)` gives the WCAG ratio used in the stripe-versus-fill card.

## Where it belongs

Any week or day scheduler: calendars, bookings, shift planners, room timetables. Not for month grids or agenda lists, where height cannot mean duration.
