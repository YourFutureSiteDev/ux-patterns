# De-AI Dashboard

> Your dashboard looks AI-made. 5 tells · 5 fixes.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/Dc-4jNbtyJg/) (560K views, no site page). Category: visual.

## The rule

A generated dashboard decorates because it has nothing to say. Strip the decoration (gradient, icon tiles, equal cards, shadows everywhere, "Welcome back") and put the one number that matters in its place.

## Key insights

- **Tell 01 · The gradient.** A purple gradient on the header, the button and the chart fill says nothing. Keep one flat accent colour and give it only to the primary button.
- **Tell 02 · Icon tiles.** Four coloured icon tiles (blue, green, purple, orange) next to four numbers compete with the numbers. Remove them; the number is the hero.
- **Tell 03 · Hierarchy.** Four cards at 402 × 160 with the same weight say nothing is more important. Make one primary (Revenue, big, with subscriptions and one-time underneath) and three secondary.
- **Tell 04 · Shadows.** A 16px drop shadow on every panel means everything floats and nothing does. Drop the shadows to 8 / 12 / 6 and keep a real one only on the thing that floats: the dropdown menu.
- **Tell 05 · Copy.** "Welcome back, Jordan 👋" and four identical green "+12.5%" badges are filler. Title the page with what it is ("Revenue · Aug 1 to Aug 31, 2026") and give numbers a shape: a sparkline, "+12.5% vs Jul", "+3.1%", "+0.4 pt", "-0.2 pt".

## Do / Don't

- **Do:** keep one accent colour and give it to the primary action only.
- **Do:** let the number be the hero of its card; no icon tile beside it.
- **Do:** size the primary metric bigger than the three secondary ones.
- **Do:** shadow only what floats (menus, popovers), not the page panels.
- **Don't:** gradient the header, the button and the chart fill.
- **Don't:** ship four identical green badges; give each number a delta with a unit.
- **Don't:** greet the user in the page title; name the page instead.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | The AI-made dashboard: gradient header, icon tiles, four equal cards. "5 tells · 5 fixes". |
| 2 | 2.5s | Hook · markers | Numbered markers 1 to 5 on the header, tiles, cards, chart and welcome line. |
| 3 | 6s | Tell 01 · The gradient | Header, button and chart fill annotated. "One flat accent". |
| 4 | 12s | Tell 01 fixed | Flat header, green Upgrade button, white chart line. |
| 5 | 16.5s | Tell 02 · Icon tiles | Zoomed dashboard, marker 2 on the Revenue tile. |
| 6 | 22.5s | Tell 02 · four colours | blue, green, purple, orange tags on the four tiles. |
| 7 | 27s | Tell 02 fixed | Tiles gone. "The number is the hero". |
| 8 | 28.5s | Tell 03 · Hierarchy | Dashed outlines on the equal cards, marker 3. |
| 9 | 31.5s | Tell 03 · 402 × 160 | Every card is 402 × 160 with the same badge. |
| 10 | 37.5s | Tell 03 fixed | One primary Revenue card with Subscriptions / One-time, three secondary. |
| 11 | 40.5s | Tell 03 · the primary | Green highlight on $48,250. |
| 12 | 43.5s | Tell 04 · Shadows | 16px drop shadow on every panel, annotated. |
| 13 | 55.5s | Tell 04 fixed | 16 → 8, 16 → 12, 16 → 6; only the Export / Filter / Share menu floats. |
| 14 | 58.5s | Tell 05 · Copy | "Welcome back, Jordan 👋" underlined, marker 5. |
| 15 | 61.5s | Tell 05 · the wave and the badge | Hand emoji and "+12.5% from last month" circled. |
| 16 | 67.5s | Tell 05 · the title | "Revenue · Aug 1 to Aug 31, 2026"; dashed guide on the amounts column. |
| 17 | 72s | Tell 05 fixed | Sparkline, "+12.5% vs Jul", "+3.1%", "+0.4 pt", "-0.2 pt". "Numbers with a shape". |
| 18 | 75s | Outro · /restyle | Five tells, gone. Claude Code palette with /ux-design, /ux-audit, /ux-review, /restyle. |
| 19 | 79.5s | Outro · UX Engine | UX Engine, Claude Code plugin, $79 one time. Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dd">
  <div class="dd-frame" style="position:relative;width:666px;height:685px">
    <div id="dash" style="left:0;top:0"></div>
  </div>
</div>
<script type="module">
  import { Dashboard } from './pattern.js';
  const d = Dashboard(document.getElementById('dash'), { gradient: true, icons: true });
  d.set({ gradient: false });                   // tell 1 fixed
  d.set({ icons: false, hero: true });          // tells 2 and 3 fixed
  d.set({ shadows: false, menu: true });        // tell 4 fixed
  d.set({ title: 'revenue', shape: true });     // tell 5 fixed
</script>
```

`Dashboard(el, state)` renders the whole dashboard from a state object and returns `{ set(patch), state }`. `parseState("hero title=revenue shape")` turns a `data-state` string into that object; `mountAll()` mounts every `[data-dashboard]` on the page. The reel's annotations (`.dd-marker`, `.dd-note`, `.dd-tag`, `.dd-outline`, `.dd-ring`, `.dd-hl`) are overlay classes placed with inline coordinates.

## Where it belongs

Any product dashboard or admin home: analytics, revenue, usage, billing. The five checks apply to any screen a generator would fill with a gradient, tinted icon tiles, equal cards, shadows and a greeting.
