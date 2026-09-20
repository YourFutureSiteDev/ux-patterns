# Responsive Table

> Your table doesn't fit a phone. Shrinking it isn't the fix. Six moves restructure it.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/Dc8RfGzNPCN/) (155K views). Category: interaction. No site page for this one; the insights below are read off the reel.

## The rule

Do not shrink a six-column table to 15px and scroll it sideways. Rank the columns by use, stack each row into two lines (name left, amount right, state below), keep the amount in one right-aligned slot, label the ambiguous values, reveal the hidden columns in an expand or a sheet, and let the table own its breakpoint with a container query.

## Key insights

- Six columns at 15px with a horizontal scroll is the default failure; two lines at 27px with no scroll is the fix.
- Rank by use, not position: Identity (customer) and Value (amount) are P1, State (status) is P2, invoice number and due date are P3 and leave the first view.
- Two lines per row: name left, amount right, state and due date below. Half the row off-screen is never acceptable.
- One slot for the amount: put every amount in the same right-aligned column with tabular numerals so it still reads as a column of numbers.
- Label the ambiguous: "Mar 04" of what? Dates get a label ("Due Mar 04"); dollars do not need one. A visible "Sort · Due date" control tells the user what the order means.
- Hidden isn't deleted: tapping a row expands it (invoice, note, actions), and "Full record" opens a sheet, never a new page.
- The table owns the breakpoint: `@container (max-width: 700px)` switches to cards based on the table's own width, so the same component works in a 480px column, a 400px side panel and a 940px page.

## Do / Don't

- **Do:** decide which three columns matter before you touch the layout.
- **Do:** keep the amount in one right-aligned, tabular-nums slot.
- **Do:** label dates and sort order; leave currency unlabeled.
- **Don't:** scale the table down or scroll it sideways on a phone.
- **Don't:** send the user to a new page to see the columns you hid.
- **Don't:** tie the switch to the viewport when the table can measure itself.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 01 Your table on a phone | Twelve rows, six columns, "Shrunk to fit · 15px". |
| 2 | 1.5s | 01 Restructure it | Two-line rows, "2 lines · 27px · no scroll". |
| 3 | 3s | 02 Rank by use | Six columns at a readable size: 3 fit on one line. |
| 4 | 7.5s | 02 Rank by use | P1/P2/P3 badges over the columns, Identity · Value · State legend. |
| 5 | 12s | 02 Rank by use | The three surviving columns boxed. |
| 6 | 15s | 03 Two lines per row | Zoomed table, half the row off-screen. |
| 7 | 21s | 03 Two lines per row | Callouts: Name, State · Due, Amount. |
| 8 | 27s | 04 One slot for the amount | Amount inline after the status: nothing lines up. |
| 9 | 31.5s | 04 One slot for the amount | Amounts right-aligned on one edge. |
| 10 | 36s | 04 One slot for the amount | The column highlighted, tabular-nums. |
| 11 | 39s | 05 Label the ambiguous | "Mar 04 of what?" |
| 12 | 45s | 05 Label the ambiguous | "$1,204.00": no label needed. |
| 13 | 48s | 05 Label the ambiguous | Sort · Due date control tapped. |
| 14 | 51s | 06 Hidden isn't deleted | Priya Natarajan expanded: invoice, note, actions. |
| 15 | 58.5s | 06 Hidden isn't deleted | INV-2043 sheet: not a new page. |
| 16 | 63s | 07 The table owns the breakpoint | 940px window, seven-row table, device breakpoints struck through. |
| 17 | 67.5s | 07 The table owns the breakpoint | 480px window: under 700, cards. |
| 18 | 72s | 07 The table owns the breakpoint | 940px overview with a 400px Recent invoices panel in card mode. |
| 19 | 75s | 08 Six moves, done | Rank, Stack, Slot, Label, Reveal, Breakpoint. UX Engine, Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="rt"><div id="invoices" style="width:100%"></div></div>
<script type="module">
  import { ResponsiveTable, INVOICES } from './pattern.js';
  ResponsiveTable(document.getElementById('invoices'), { rows: INVOICES });
</script>
```

`ResponsiveTable` renders both the six-column grid and the two-line list into one container-query wrapper (`.rt-live`); the grid shows above 700px of container width, the list below. Tapping a list row expands it, "Full record" opens the sheet in place. `renderPhone` and `renderDesktop` draw the reel's stills (dense, zoom, ranked, boxed, list, expanded, sheet, table, cards, overview) from the same row data.

## Where it belongs

Invoice lists, order tables, admin grids, any data table that also has to work in a phone column or a narrow side panel. Not for spreadsheets or comparison matrices where every column is the point.
