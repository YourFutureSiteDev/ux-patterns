# Charts That Lie

> Same data, opposite stories: how you draw a chart decides which truth people see.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/charts-that-lie](https://www.designmotionhq.com/patterns/charts-that-lie) · [Instagram](https://www.instagram.com/reel/DZM5K5otAGy/) (14.4K views). Category: visual.

## The rule

A chart is an argument. Start bar axes at zero, pick the form from the question, spend colour only on meaning, strip every pixel that is not data, bank the slope to about 45°, and title the takeaway. Break any of these and the same numbers tell a different story.

## Key insights

- Start every bar chart's y-axis at zero. Truncating the baseline turns a +4% change into a fake +400% explosion, the single most common way charts mislead.
- Match the chart to the question. Bars compare values, lines show change over time, and pie charts fall apart past about 5 slices. The question picks the form, not your taste.
- Aspect ratio rewrites the trend. The same rising series looks flat when squished and like a spike when stretched; balance it so the average slope sits near 45° and reads honestly.
- Maximize the data-ink ratio. Strip gridlines, drop shadows, 3D skew and boxed legends, then label the line directly. Every remaining pixel should carry data.
- Color is encoding, not decoration. Use one hero colour to spotlight the series that matters, and choose categorical, sequential or diverging scales to fit the data type.
- Title the chart with the takeaway, not the metric. "Revenue flat since March" tells the story; "Quarterly revenue" makes the reader hunt for it.

## Do / Don't

- **Do:** start every bar chart's y-axis at zero, no exceptions.
- **Do:** pick the chart type from the question you're answering.
- **Do:** spotlight the one series that matters with a single accent colour.
- **Don't:** truncate or crop an axis to exaggerate small differences.
- **Don't:** add gridlines, shadows or 3D effects that encode no data.
- **Don't:** reach for a pie chart when you have more than five slices.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Quarterly revenue 104 vs 108 on an 80..109 axis: "+400% vs last quarter". |
| 2 | 1.5s | Hook | The same bars from zero: "+4%". "This chart is lying." |
| 3 | 3s | The truncated axis | Approval 47% vs 48% with baseline 46%: a landslide. |
| 4 | 6s | The truncated axis | Baseline pulled to 34%: the gap shrinks. |
| 5 | 9s | The truncated axis | Baseline 0: a tie. "Bar charts start at zero. No exceptions." |
| 6 | 12s | Match the form to the question | Bar (compare values), line (change over time), pie (breaks past 5 slices). |
| 7 | 16.5s | Match the form to the question | The six-slice pie greys out with a pink strike. "The question picks the chart, not your taste." |
| 8 | 21s | Color encodes meaning | Eight months in eight colours; only July glows. |
| 9 | 24s | Color encodes meaning | One teal hero over grey bars, then categorical, sequential and diverging scales. |
| 10 | 30s | Kill the chartjunk | 3D tilt, gridlines, boxed legend; data-ink 28%. |
| 11 | 34.5s | Kill the chartjunk | Flat and gridless; data-ink 72%. |
| 12 | 37.5s | Kill the chartjunk | Line labelled directly; data-ink 94%. "Every pixel is data." |
| 13 | 42s | The aspect ratio | The rise squashed wide: "Flat?" |
| 14 | 45s | The aspect ratio | The rise stretched tall: "Spike?" |
| 15 | 48s | The aspect ratio | Banked to 45°, with the reference diagonal. |
| 16 | 51s | Outro | "Revenue flat since March", Follow for more UI design. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="cl">
  <div class="cl-panel" id="chart" style="width:600px;height:517px"><div class="cl-panel__title">Revenue flat since March</div></div>
</div>
<script type="module">
  import { renderBars, renderLine, revealLine, dataInk, lieFactor, bankedHeight } from './pattern.js';
  renderBars(document.getElementById('chart'), { plotTop: 41, plotBottom: 481, ticks: 6, min: 0, max: 110,
    bars: [{ x: 144, w: 80, v: 104, label: 'Q1', valueText: '104' }, { x: 406, w: 80, v: 108, label: 'Q2', valueText: '108', cls: 'cl-bar--teal' }] });
  lieFactor(104, 108, 80);      // 5.4: how much bigger the gap looks with the axis cut at 80
  bankedHeight(series, 600);    // plot height that puts the median slope at 45°
</script>
```

`renderBars` draws bars against an explicit axis (`min`, `max`), so a truncated axis is a visible choice in the call. `renderLine` and `revealLine` draw and progressively reveal a series; `dataInk(meter, pct)` drives the data-ink meter; `growBars(panel)` animates a panel on entry.

## Where it belongs

Dashboards, reports, investor decks, analytics screens: anywhere a number is drawn rather than written. Check the six rules before shipping any chart, and especially before shipping one that flatters you.
