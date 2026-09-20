# Text Truncation

> Real content breaks layouts. Your test data is 10 characters long.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DbgqEnahoz6/) (74.8K views, no site page). Category: content.

## The rule

Every string that comes from a user or a database will one day be empty, one character, or forty characters and an emoji. Four CSS fixes cover the four ways that breaks a layout: `min-width: 0` so ellipses can fire inside flex, middle truncation so both ends of a filename survive, `tabular-nums` so live digits stop twitching, and `overflow-wrap: anywhere` so one long word cannot push the container open.

## Key insights

- Flex children default to `min-width: auto`, so `text-overflow: ellipsis` never fires and the "Manage" button gets pushed outside the card. `min-width: 0` on the shrinking child is the whole fix.
- End truncation eats the part that carries meaning: `quarterly_report_fina…` hides `.pdf`, `bartholomew.vandermee…` hides `@northwind.io`. Cut the middle, keep both ends.
- Proportional digits have different widths, so five characters take two widths and a live counter twitches every tick. `font-variant-numeric: tabular-nums` gives every digit the same advance.
- A URL has zero spaces, so it has zero break opportunities and overflows. `word-break: break-all` fixes it but chops normal words in half too; `overflow-wrap: anywhere` only breaks when there is no other option.
- Ship none of it untested. Three fixtures for every text component: empty, one character, forty characters plus an emoji.

## Do / Don't

- **Do:** put `min-width: 0` (plus `overflow: hidden; text-overflow: ellipsis`) on any flex child that must shrink.
- **Do:** truncate filenames, emails and paths in the middle so the extension or domain stays visible.
- **Do:** set `tabular-nums` on anything that updates live: counters, latency, prices, timers.
- **Do:** use `overflow-wrap: anywhere` for URLs, tokens and IDs inside message bubbles and tables.
- **Don't:** reach for `word-break: break-all`; it breaks ordinary words in half as well.
- **Don't:** demo with ten-character test data and call the layout finished.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Team members | Five rows; a 30 character name pushes "Manage" outside the card. "Real content breaks layouts." |
| 2 | 4.5s | 01 the ellipsis that never fires | Available vs content width bars, `text-overflow` struck through, "Manage — pushed outside the card". |
| 3 | 12s | min-width: 0 applied | Name truncates to `Bartholomew Vanderm…`, container "fits". "min-width: 0, or no ellipsis." |
| 4 | 16.5s | 02 cut the middle, not the end | End-truncated files spill `.pdf`, `.json`, `.png`; keep / drop / keep breakdown. |
| 5 | 22.5s | Middle-truncated | `quarterly_rep…nal_v3.pdf`, `bartholomew.v…@northwind.io`. "Both ends carry meaning." |
| 6 | 27s | 03 numbers that twitch | Live metrics in proportional digits; 1,111 and 8,888 at two widths. |
| 7 | 31.5s | tabular-nums applied | Same digits at one width, `font-variant-numeric: tabular-nums`. "Digits should never move." |
| 8 | 36s | 04 one word, no break | A URL overflows the message card; `break-all` rejected. |
| 9 | 45s | overflow-wrap: anywhere | URL wraps inside the card, "breaks anywhere it has to". "Long strings need permission." |
| 10 | 48s | Outro | The four fixes checklist, three fixtures, "Follow for more UI systems." |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="tx">
  <div class="tx-row"><div class="tx-row__who"><div class="tx-row__name">Bartholomew Vandermeer-Okonkwo</div></div><span class="tx-btn">Manage</span></div>
  <div class="tx-file"><span id="file"></span></div>
  <div class="tx-metric is-tabular"><span class="tx-metric__value" data-metric="1000,9999">4,164</span></div>
  <div class="tx-msg is-fixed"><div class="tx-msg__text">https://app.northwind.io/workspace/7f3a9c/settings/billing/invoices/2026-07</div></div>
</div>
<script type="module">
  import { fitMiddle, middleTruncate, liveMetrics, FIXTURES } from './pattern.js';
  fitMiddle(document.getElementById('file'), 'quarterly_report_final_v3.pdf', { tail: 10 });
  middleTruncate('bartholomew.vandermeer@northwind.io', 24, 13); // 'bartholomew…@northwind.io'
</script>
```

`.tx-row__who` ships with `min-width: 0` (add `.is-broken` to see the failure). `fitMiddle(el, text)` measures the element and cuts the middle so the tail always fits, re-running on resize; `middleTruncate(str, max, tail)` is the pure version. `.is-tabular` switches `tabular-nums` on, `liveMetrics(root)` randomises `[data-metric]` values to show the difference. `.tx-msg.is-fixed` applies `overflow-wrap: anywhere`. `FIXTURES` is the three test strings.

## Where it belongs

Member lists, file pickers, inboxes, dashboards, chat bubbles, tables: anywhere a string arrives from outside the design file. Not a substitute for showing the full value on hover or focus.
