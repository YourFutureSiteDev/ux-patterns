# Grid System

> Align everything to a 12-column grid, then break it on purpose.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/grid-system](https://www.designmotionhq.com/patterns/grid-system) · [Instagram](https://www.instagram.com/reel/DWUDebQs6B0/) (39.8K views). Category: visual.

## The rule

Start from a 12-column grid, choose a column ratio for the page (4:8, 6:6, 3:9), pick a gutter that matches the mood (8, 24 or 40px), collapse columns at each breakpoint (12, 6, 4, 1), and only once that order exists break it deliberately with a full-bleed hero or a pull quote pushed into the margin.

## Key insights

- Start from a 12-column grid. It's the web standard because 12 divides cleanly into halves, thirds, quarters and sixths, so almost any layout maps onto it.
- Use column ratios to structure the page: 4:8 for a sidebar plus content, 6:6 for an even split, 3:9 for a narrow nav beside a wide canvas.
- Gutters set the mood as much as the columns do. 8px reads dense and technical, 24px feels balanced and clean, 40px gives an editorial, premium feel.
- Stay responsive by dropping columns at each breakpoint: 12 at desktop, 6 on tablet, 4 on large phones, down to a single stacked column on the smallest screens.
- Once the grid is solid, break it on purpose. Let a hero image bleed full-width or push a pull quote into the margin for deliberate emphasis.
- Alignment is what separates polished from amateur: chaotic, slightly rotated elements snapped to shared column edges instantly read as designed.

## Do / Don't

- **Do:** anchor every element to shared column edges so the layout reads as intentional.
- **Do:** match gutter width to the mood: tight for dense dashboards, wide for editorial.
- **Do:** collapse columns at each breakpoint (12 to 6 to 4 to 1) so content reflows cleanly.
- **Don't:** break the grid before you've established it. A bleed only reads as intentional against order.
- **Don't:** reach for arbitrary widths when a clean column ratio like 4:8 or 6:6 already fits.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | The Grid Nobody Teaches | A dashboard's pieces sit rotated and scattered (CHAOS), then snap to the columns (GRID). "Same content. Different structure." |
| 2 | 3s | 4 : 8 | Narrow sidebar, wide content area. Acme dashboard: stats, Revenue Overview, Recent Transactions. |
| 3 | 9s | 6 : 6 | Equal weight, balanced layout. Same dashboard reflowed. |
| 4 | 13.5s | 3 : 9 | Minimal sidebar, dominant content. |
| 5 | 18s | 1280px, 12 cols | Four KPI cards in a row, Weekly Revenue beside Recent Orders. |
| 6 | 21s | 768px, 6 cols | KPIs two per row. |
| 7 | 24s | 480px, 4 cols | Everything stacks. |
| 8 | 27s | 320px, 1 col | One column, red frame. |
| 9 | 31.5s | 8px, Dense / Technical | Three stat cards 8px apart; "Same cards. Different feeling." |
| 10 | 36s | 24px, Balanced / Clean | Same cards, 24px gutters. |
| 11 | 42s | 40px, Editorial / Premium | Same cards, 40px gutters. |
| 12 | 45s | Clean Grid Layout | Column guides, top bar, three stats, a contained hero and a quote card on the grid. |
| 13 | 48s | Know When to Break It | The hero goes FULL-BLEED, the PULL QUOTE pushes into the margin. NOT CHAOS / CONTRAST. "Pros know when to break the rules." |
| 14 | 57s | Outro | "The grid is a superpower. Master it. Then break it on purpose." Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="gs">
  <div class="gs-ratio" id="dash" style="position:relative;width:640px;height:760px"></div>
  <div class="gs-resp" id="resp" style="position:relative;width:610px"></div>
</div>
<script type="module">
  import { columnsFor, GUTTERS, ColumnGuides, RatioDashboard, ResponsiveDashboard } from './pattern.js';
  RatioDashboard(document.getElementById('dash'), { side: 4 });               // 4:8
  ResponsiveDashboard(document.getElementById('resp'), columnsFor(innerWidth)); // 12 / 6 / 4 / 1
  ColumnGuides(document.body, { cols: 12, gutter: 24, inset: 40 });          // faint column overlay
  GUTTERS[24]; // 'Balanced / Clean'
</script>
```

`.gs-ratio` is a 12-column CSS grid whose sidebar spans `--side` columns and content spans `--content`. `.gs-resp[data-cols]` reflows the same cards for 12, 6, 4 and 1 columns. `ColumnGuides` paints the columns so alignment can be checked while building.

## Where it belongs

Every page layout: dashboards, marketing pages, docs. Establish the columns first, then earn the one deliberate break (a bleed, a pull quote, an overhanging image).
