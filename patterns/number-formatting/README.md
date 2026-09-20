# Number Formatting

> Watch the right edge. Numbers, formatted like a system.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DcYX_cxNfOA/) (76.6K views, "Number formatting like a pro"). No designmotionhq page for this one; the insights below are read off the reel. Category: content.

## The rule

Treat numbers as a system, not as text: tabular figures so every digit has one width, right-aligned columns so the eye compares the last digit, compact abbreviations with the exact value on hover, relative time under a day and absolute after, and a pinned currency symbol with the decimals in one line.

## Key insights

- Proportional figures let every digit pick its own width. "1,111" and "9,090" have the same digit count and different pixel widths, so a column's right edge wobbles.
- One CSS line locks every width: `font-variant-numeric: tabular-nums;`. Decimals fall into a straight line.
- Numbers right, text left. Right-aligned figures let the eye compare straight down the last digit; left-aligned prices scatter the magnitudes.
- Big numbers, small footprint: 1K, 1M, 3.4M by default, with the exact value (1,000,000) on hover.
- Relative time under a day ("2h ago"), absolute for everything older ("Mar 3"). Split the list at the 24h boundary.
- Pin the currency symbol to the left of the cell and right-align the amount. Decimals line up; dollar signs don't have to.

## Do / Don't

- **Do:** set `font-variant-numeric: tabular-nums` on any column of figures.
- **Do:** right-align numbers and left-align labels in tables.
- **Do:** abbreviate large values in tiles and dashboards, and keep the exact value one hover away.
- **Do:** show "2h ago" for recent activity and a real date once it is older than a day.
- **Don't:** glue the currency symbol to the number in a column; pin it and align the decimal instead.
- **Don't:** leave proportional figures in anything that scrolls, updates or lines up in a column.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Watch the right edge (proportional) | Q3 revenue card, ragged right edge, pink guide line. dances → lines up. |
| 2 | 1.5s | Watch the right edge (tabular-nums) | Same figures locked to one edge, teal guide line with a dot. |
| 3 | 3s | The problem · proportional | Narrow "1" vs wide "0" glyph boxes. 1,111 / 8,888 / 1,010 / 9,090 with "edge wobbles". |
| 4 | 10.5s | The fix · tabular | styles.css types `font-variant-numeric: tabular-nums;`. Decimals on one line, "decimals aligned". |
| 5 | 16.5s | Alignment · right-align | Product table flips from text-align: left (pink) to right (teal). |
| 6 | 24s | Abbreviation · compact | 3,400,000 → 3.4M. Tiles 1K / 1M / 3.4M, hover shows EXACT VALUE 1,000,000. Legend 1K = 1,000 etc. |
| 7 | 28.5s | Relative time (absolute) | Activity list with 14:32 / 12:05 / 08:40 in pink, Mar 3 and Feb 27 below. |
| 8 | 31.5s | Relative time (relative) | 2h ago / 5h ago / 9h ago in teal, 24h boundary divider, older rows dimmed. |
| 9 | 37.5s | Currency · decimals | $ glued to the number (pink, ragged) vs $ pinned · decimals aligned (teal line through the decimal). |
| 10 | 43.5s | Outro | Q3 revenue card and the five rules: tabular figures, right-align, abbreviate, relative time, pin the currency. designmotionhq.com. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="nf">
  <div class="nf-figures nf-tnum"><span>1,204.50</span><span>88.00</span></div>
  <div class="nf-tile" id="users"><div class="nf-tile__label">Total users</div><div class="nf-tile__value"></div></div>
  <div id="activity"><div class="nf-row" data-ts="2026-03-05T14:32:00">…<span class="nf-row__time"></span></div></div>
</div>
<script type="module">
  import { formatNumber, abbreviate, relativeTime, currency, CompactStat, ActivityTimes } from './pattern.js';
  CompactStat(document.getElementById('users'), 1000000);      // "1M", exact value on hover
  ActivityTimes(document.getElementById('activity'));           // "2h ago" today, "Mar 3" after that
  formatNumber(1204.5); abbreviate(3400000); relativeTime(date); currency(42.5); // "1,204.50", "3.4M", "2h ago", { symbol: "$", amount: "42.50" }
</script>
```

`.nf-tnum` applies `font-variant-numeric: tabular-nums`. `.nf-row__num` right-aligns a figure in a row (`.nf-rows.is-left` is the comparison state). `.nf-money--ok` rows pin `.nf-money__sym` left and the amount right. `typeCode(el, html)` and `FiguresColumn(root)` drive the demo.

## Where it belongs

Any table, dashboard tile, activity feed, invoice or price list. Every column of figures in a product should be tabular and right-aligned; every stat tile should abbreviate; every timestamp should decide between relative and absolute at the 24h line.
