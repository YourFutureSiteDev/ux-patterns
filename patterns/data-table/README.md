# Data Table

> Your data table feels cheap because it's a grid of divs, not a system.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/data-table](https://www.designmotionhq.com/patterns/data-table) (site only, no Instagram post). Category: interaction.

## The rule

A table is a system: tri-state sort that can restore the natural order, right-aligned tabular figures, a sticky header and frozen first column, one density token, and whole-row selection with a select-all that morphs empty → indeterminate → checked.

## Key insights

- Sort is a tri-state, not a toggle: ascending → descending → back to original. A binary flip loses the natural order forever; a third click should restore it.
- Numbers must line up: use tabular figures and right-align numeric columns so every digit sits on the same grid. Proportional, left-aligned digits jitter and can't be compared at a glance.
- Freeze what you navigate by: keep the header sticky on vertical scroll and freeze the first column on horizontal scroll, each with a subtle shadow so labels never scroll out of reach.
- Treat density as a token, not a guess: one control switching row heights (36 / 48 / 60px) gives a predictable rhythm. Zebra stripes help at comfortable spacing; collapse to a single hairline as rows compact.
- Make the whole row the selection target (full tint + an accent left bar + the checkbox) instead of a tiny checkbox-only hit area that's easy to miss.
- Signal partial selection with a select-all state that morphs empty → indeterminate (dash) → checked, so bulk actions read at a glance.

## Do / Don't

- **Do:** right-align numeric columns with tabular figures so values form a scannable vertical grid.
- **Do:** keep the header sticky and freeze the first column so labels stay anchored while scrolling.
- **Do:** expose row density as one token-driven control for consistent, predictable spacing.
- **Don't:** ship a binary sort that strips the original order with no way back to natural sequence.
- **Don't:** rely on a tiny checkbox-only hit target when the entire row could be clickable.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Why your data table feels cheap | Six-row invoice table, Lena Ortiz selected (tint + accent bar), AMOUNT sorted. |
| 2 | 3s | Sort is a tri-state | Unsorted, natural order. Binary toggle (original order lost forever) vs Tri-state (third click → back to natural). |
| 3 | 4.5s | Sort is a tri-state | First click: Sorted ascending. |
| 4 | 6s | Sort is a tri-state | Second click: Sorted descending, rows re-settle. |
| 5 | 9s | Sort is a tri-state | Third click: Natural order restored. |
| 6 | 12s | Numbers need to line up | Proportional · left (digits jitter) vs Tabular · right (every digit on a grid); $96.00 highlighted. |
| 7 | 21s | Freeze what you navigate by | Header stays · depth shadow while the body scrolls. |
| 8 | 23.5s | Freeze what you navigate by | Without freeze → labels lost. |
| 9 | 25s | Freeze what you navigate by | First column frozen · edge shadow on horizontal scroll. |
| 10 | 28.5s | Density is a token | row-height: 48px · Comfortable. |
| 11 | 31.5s | Density is a token | row-height: 60px · Spacious. |
| 12 | 34.5s | Density is a token | row-height: 36px · Compact. |
| 13 | 39s | Make the whole row the target | Checkbox only vs whole-row target, 1 of 6 selected, select-all indeterminate. |
| 14 | 42s | Make the whole row the target | 3 of 6 selected. |
| 15 | 45s | Make the whole row the target | 6 of 6 selected, select-all checked. |
| 16 | 48s | Outro | A table is a system. Working table with density toggle. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dt">
  <div class="dt-table" id="t" style="--dt-cols: 20px 188px 150px 114px 88px">
    <div class="dt-head"><span class="dt-check"></span><span>Name</span><span>Status</span><span class="dt-num is-sort is-none">Amount</span><span class="dt-date">Date</span></div>
    <div class="dt-body">
      <div class="dt-row" data-name="Lena Ortiz"><span class="dt-check"></span><span class="dt-name">Lena Ortiz</span><span><i class="dt-chip is-paid">Paid</i></span><span class="dt-num">$12,400.00</span><span class="dt-date">May 07</span></div>
    </div>
  </div>
</div>
<script type="module">
  import { DataTable } from './pattern.js';
  const t = DataTable(document.getElementById('t'));
  t.on('select', e => console.log(e.detail.count, 'of', e.detail.total));
  t.density('compact'); // 36 / 48 / 60px
</script>
```

`DataTable` wires the AMOUNT header to a tri-state sort (`sort()` cycles asc → desc → natural and remembers the original DOM order), makes every row a selection target (`toggle`, `selectAll`, select-all box morphs to indeterminate), and exposes `density(level)` as one token. `freezeFrame(frame)` adds the depth shadow to a sticky header once a scroll container has scrolled.

## Where it belongs

Invoices, orders, users, logs: any list with more than a handful of rows and at least one numeric column. Not for two-column key/value lists or card grids, where a table's chrome is overhead.
