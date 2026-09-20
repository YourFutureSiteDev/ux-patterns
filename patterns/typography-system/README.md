# Typography System

> Typography is a system. Seven decisions. One font.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/Ddd04e2tQWx/) (28.5K views, Instagram only, no site page). Category: visual.

## The rule

Type is not a pile of one-off choices. Pick one family and decide seven things once: five sizes on one ratio, three inks instead of ten sizes, two weights, leading that moves against size, tracking that tightens big and opens small caps, a capped measure, and tabular figures. Everything else follows.

## Key insights

- Five sizes, one ratio: 13, 16, 20, 25, 32 from a 1.25 scale. Eleven hand-picked sizes become five, and nothing is hand-picked.
- Three inks, not ten sizes: primary (#18181B) for the amount you scan for, secondary (#52525B) for the invoice id, muted (#A1A1AA) for the date. Colour ranks within a line; size ranks between blocks.
- Two weights, 400 and 600: 400 reads, 600 scans. 700 was replaced, 500/700/800 were dropped, two kept.
- Leading moves against size: body 16 at 1.5, heading 32 at 1.1. "1.4 everywhere" is the mistake; size up means leading down (1.50, 1.50, 1.35, 1.20, 1.10 across the scale).
- Big tightens, small caps open: page titles above 24px get -0.02em, body stays at 0, uppercase labels below 16px get +0.05em because caps have no ascenders to separate them.
- Cap the measure, not the box: the container can be 1400px, the paragraph is capped at 66ch, inside the 45 to 75 characters-per-line comfort band. 166 characters per line became 66.
- Tabular figures, one property: `font-variant-numeric: tabular-nums;` keeps the amount column aligned and a ticking counter from wobbling.
- Seven decisions, one font (Inter): sizes, colors, weights, leading, tracking, measure, tabular. Think like a senior UX designer.

## Do / Don't

- **Do:** derive every size from one base and one ratio, then stop adding sizes.
- **Do:** rank text inside a line with three inks, and between blocks with size.
- **Do:** tighten leading and tracking as type gets bigger; open tracking on small uppercase labels.
- **Do:** cap paragraph measure in `ch`, not the container in `px`.
- **Don't:** use one line-height for every size, or bold as a third weight when 600 already scans.
- **Don't:** let numbers wobble in tables and counters; turn on tabular-nums.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Typography is a system · 01 | Orbit dashboard with an inspector rail of size / weight / ink tags, family and scale. Tally: 11 sizes → 5, 1 grey → 3, bold → 2. |
| 2 | 6s | Five sizes, one ratio · 02 | Size ladder 13, 16, 20, 25, 32 with × 1.25 steps beside the dashboard. Sizes strip: 5 left. |
| 3 | 15s | Three inks, not ten sizes · 03 | Invoice row zoomed 3x with the three inks and their hex values; the table below at one size, two ranks. |
| 4 | 24s | Two weights, 400 and 600 · 04 | Stat cards 700 → 400 · 600, Aa 400 Regular vs Aa 600 Semibold, family weights bar with 2 kept. |
| 5 | 33s | Leading moves against size · 05 | Heading 32 at 1.10, body 16 at 1.50, and the size/lead chart: 1.4 everywhere struck out. |
| 6 | 42s | Big tightens, small caps open · 06 | Page title -0.02em above 24px, body stays at 0, 13px uppercase label +0.05em. |
| 7 | 51s | Cap the measure, not the box · 07 | Browser mock: container 1400 px, measure 66ch, 3 lines. Characters-per-line slider 166 → 66 with the 45 to 75 comfort band. |
| 8 | 60s | Tabular figures, one property · 08 | `font-variant-numeric: tabular-nums;` typed in; invoices table; proportional (shifts on every tick) vs tabular (0 wobble) counters. |
| 9 | 69s | Seven decisions. One font. · 09 | Seven decision tiles, the dashboard, and the Claude Code command list. |
| 10 | 72s | Think like a senior UX designer | `/ux-design` typed into the terminal, the other commands dim. |
| 11 | 81s | UX Engine outro | UX Engine Claude Code plugin card with the four commands and the lit Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ts">
  <h1 class="ts-orbit__title">Usage &amp; billing</h1>
  <p id="body">Usage is billed on the 12th of each month…</p>
  <table class="ts-table">…</table>
</div>
<script type="module">
  import { typeScale, applyType, measureSlider, tabularCounter } from './pattern.js';
  const [xs, sm, md, lg, xl] = typeScale(13, 1.25, 5);          // [13, 16, 20, 25, 32]
  applyType(document.getElementById('body'), sm);                // 16px, line-height 1.5, tracking 0
  applyType(document.querySelector('h1'), xl, { weight: 600 });  // 32px, line-height 1.1, tracking -0.02em
</script>
```

`typeScale(base, ratio, steps)` builds the sizes. `leadingFor(size)` and `trackingFor(size, { caps })` encode the two rules; `applyType(el, size, opts)` sets all three at once (plus `weight` and `tabular`). `measureSlider(root, { para, from, to })` drives the characters-per-line slider and caps the paragraph in `ch`. `tabularCounter(els, from, to)` ticks a number so a proportional counter shows its wobble against a tabular one. `typeCommand` and `tallyCount` are the typing and counting effects from the reel. The three inks are the `--ink-1`, `--ink-2`, `--ink-3` tokens.

## Where it belongs

Any product UI with a type ramp: dashboards, settings, tables, billing pages. Set the seven decisions once in tokens and stop making per-screen type choices.
