# Data Table System

> Data table is a system, here are 6 tips for better UX.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/Dc3KFOaNfnW/) (217K views, no site page). Category: interaction.

## The rule

Your table is a spreadsheet. Six decisions fix that: align, rows, density, sticky, cells, actions. Make each one on purpose and the table reads like a receipt instead of a grid of divs.

## Key insights

- Align: numbers right, text left. Centered, proportional digits never line up and the eye cannot compare scattered digits; `text-align: right` plus `tabular-nums` gives a column that reads like a receipt.
- Rows: stripes fight the content. Every other row screams for nothing on a five-column table; one hairline and a hover tint do the rest. Stripes only earn very wide rows (twelve columns and up).
- Density: row height is a decision, not a default. One token, three values: compact 40px for ops, default 48px for everyday, comfortable 56px for review.
- Sticky: scroll right and you lose the row. `position: sticky; left: 0` pins the identity columns, `top: 0` pins the header, so context never leaves the screen even with twelve columns and six on screen.
- Cells: an empty cell is a question. Missing gets a dash, not a blank; long text truncates with a tooltip on hover; numbers never truncate. One line per row, always.
- Actions: an action column is noise (fifty rows, fifty pencils). Reveal actions on hover or focus, keep a kebab on touch, and show the sort arrow on the active column only.

## Do / Don't

- **Do:** right-align amounts with tabular figures and left-align text.
- **Do:** treat row height as a token the user (or their role) can switch.
- **Do:** pin the identity columns and the header on a wide table.
- **Do:** render a dash for missing values and truncate long text with a tooltip.
- **Don't:** zebra-stripe a narrow table or draw a border around every cell.
- **Don't:** wrap a cell onto three lines, truncate a number, or put a pencil and a bin on every row.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Your table is a spreadsheet. | Lumen Billing invoices as a spreadsheet: uppercase headers, cell borders, stripes, centered amounts. The six decisions. |
| 2 | 4.5s | Digits that never line up. | text-align: center, normal figures. Centered · proportional vs Right · tabular. The eye cannot compare scattered digits. |
| 3 | 9s | Numbers right. Text left. | text-align: right, tabular-nums. A column that reads like a receipt. |
| 4 | 15s | Stripes fight the content. | Zebra rows on five columns. Every other row screams for nothing. |
| 5 | 18s | One hairline. Hover does the rest. | Hairlines, hovered row tinted with an accent bar. |
| 6 | 22.5s | One hairline. Hover does the rest. | 12 columns wide: stripes earn it. Stripes only earn very wide rows. |
| 7 | 25.5s | Row height is a decision. | Default rows, 48px, Everyday. |
| 8 | 28.5s | Row height is a decision. | Compact rows, 40px, Ops. |
| 9 | 34.5s | Row height is a decision. | Comfortable rows, 56px, Review. |
| 10 | 37.5s | Scroll right, lose the row. | Horizontal scroll drops Invoice and Customer. 12 columns, 6 on screen. |
| 11 | 42s | Context stays on screen. | position: sticky · left: 0 pins the identity columns. |
| 12 | 46.5s | Context stays on screen. | top: 0 pins the header on vertical scroll. Context never leaves the screen. |
| 13 | 49.5s | An empty cell is a question. | Blank due dates flagged with ?. Missing, zero, or loading? |
| 14 | 52.5s | Truncate. Never wrap. | Missing gets a dash; a wrapped three-line customer cell outlined in red. |
| 15 | 55.5s | Truncate. Never wrap. | Priya Nataraja… with a tooltip on hover. One line per row, always. |
| 16 | 58.5s | Truncate. Never wrap. | Numbers never truncate: $12,48… becomes $12,480.75. |
| 17 | 60s | An action column is noise. | 7 rows · 14 icons. Fifty rows, fifty pencils. |
| 18 | 63s | Reveal on hover or focus. | Actions appear only on the hovered row. One row, one set of actions. |
| 19 | 69s | Reveal on hover or focus. | Touch keeps a kebab; sort arrow on the active column only. |
| 20 | 72s | A table is six decisions. | Align, Rows, Density, Sticky, Cells, Actions ticked. Follow / Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ds">
  <div class="ds-app" id="app">
    <div class="ds-scroll"><div class="ds-grid">
      <div class="ds-head"><span>Invoice</span><span>Customer</span><span class="is-num">Amount</span><span>Status</span><span>Due date</span><span class="is-act"></span></div>
      <div class="ds-body">
        <div class="ds-row" data-id="INV-2041"><span class="ds-inv">INV-2041</span><span class="ds-cust"><i>AL</i><span>Ada Lindqvist</span></span><span class="ds-num">$1,204.00</span><span><span class="ds-chip is-paid">Paid</span></span><span class="ds-date">Mar 04</span><span class="ds-act">…</span></div>
      </div>
    </div></div>
  </div>
</div>
<script type="module">
  import { TableSystem } from './pattern.js';
  const t = TableSystem(document.getElementById('app'));
  t.density('compact');          // 40 / 48 / 56
  t.sort('Amount');              // sort arrow on the active column only
  t.makeSticky({ columns: 2 });  // pin Invoice + Customer and the header
  t.setCell('INV-2042', 'due', null); // renders a dash
</script>
```

The CSS carries the decisions (`.ds-num` right-aligned tabular figures, hairline rows with `.is-hover`, `--ds-row` density token, `.ds-cust span` truncation, `.is-reveal` hiding `.ds-act` until hover). `TableSystem` wires hover and focus, `density()`, single-column `sort()`, `makeSticky()` and `setCell()` for dash / truncate / never-truncate rules.

## Where it belongs

Any operational table: invoices, orders, tickets, users. The six decisions apply whether the table has five columns or twelve; only stripes and sticky columns are conditional on width.
