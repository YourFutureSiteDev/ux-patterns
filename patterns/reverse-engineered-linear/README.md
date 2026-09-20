# Reverse-Engineered Linear

> Why does Linear feel expensive? Five decisions. None need a designer.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/reverse-engineered-linear](https://www.designmotionhq.com/patterns/reverse-engineered-linear) · [Instagram](https://www.instagram.com/reel/DdLvXSsNLpr/) (206K views). Category: visual.

## The rule

Make five decisions once and the whole product reads as engineered: dense text on a fixed row grid, borders instead of shadows, one brand colour with grey for everything else, a shortcut on every action with sub-150ms feedback, and a 4px grid that puts labels left, numbers right and icons on the text line.

## Key insights

- Density reads as competence. 13px text, 32px rows, letter spacing pulled in by 1%. The same viewport shows 14 issues instead of 8, with no scroll.
- Depth comes from value, not blur. Kill the shadows and stack three background values (base, surface, raised surface) separated by a 1px border at 8% white. Hover changes the surface value, not the elevation. Flat surfaces look engineered, shadows look decorated.
- One colour, used twice. Indigo on the selected row and the primary button, nowhere else. Status is a grey icon, not a coloured pill. Seven colours collapse to one and the UI instantly looks deliberate.
- Every action shows its shortcut. C creates, Cmd K searches. Hover feedback lands in about 80ms and transitions stay under 150ms, with no bounce or overshoot. The UI answers before you finish the gesture.
- A 4px grid does the rest. 16px icons centred on the text line, labels left, numbers and dates right, nothing centred. Alignment is invisible when right and loud when wrong.

## Do / Don't

- **Do:** build depth from three stacked background values plus a hairline border (rgba white at 8%), and change the surface value on hover.
- **Do:** print the keyboard shortcut next to every action, and keep hover feedback near 80ms with transitions under 150ms.
- **Do:** left-align labels and ids, right-align numbers and dates, and centre icons on the text line using a 4px grid.
- **Don't:** use drop shadows to separate rows, panels or the sidebar.
- **Don't:** encode status or priority with coloured pills when a grey icon says the same thing.
- **Don't:** let transitions bounce, overshoot or drag past 150ms.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 0 / 5 decisions | The loose, coloured issue list: 46px card rows, coloured pills, underlined links. Live, the five decisions switch on one by one. |
| 2 | 1.5s | Five decisions. No designer. | All five applied: 14 dense grey rows, indigo used twice. 5 / 5. |
| 3 | 6s | Decision 01 · Density (before) | "13 px text" callout, letter spacing 0em. |
| 4 | 9s | Density applied | 32px rows, 14 rows same height, -0.01em. |
| 5 | 18s | Decision 02 · Borders | 1px solid rgba(255,255,255,.08); canvas, list, hover surface values. |
| 6 | 27s | Borders: hover | Hovered row moves to surface2, elevation 0. Engineered. |
| 7 | 33s | Decision 03 · One color (before) | 7 colours in the swatch row. |
| 8 | 39s | One color applied | Grey swatches plus #5E6AD2. Status and priority become grey icons. |
| 9 | 48s | Decision 04 · Keyboard | C creates, Cmd K searches; hover 80ms, transition 150ms, generic 300ms struck out; bouncy vs snappy. |
| 10 | 52.5s | Command palette | "pri" filters to Set priority · P. |
| 11 | 63s | Decision 05 · Alignment | Loupe on one row: 16px icon centred on the text line. |
| 12 | 66s | Aligned | Labels left, numbers right. |
| 13 | 73.5s | Five decisions, one afternoon | Claude Code prompt with /ux-design, /ux-audit, /ux-review, /restyle. |
| 14 | 76.5s | UX Engine | Claude Code plugin card. Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="rl"><div class="rl-app" id="issues" style="position:relative"></div></div>
<script type="module">
  import { IssueTracker, CommandPalette } from './pattern.js';
  const app = IssueTracker(document.getElementById('issues'), { decisions: { density: true, borders: true } });
  app.set('oneColor', true);    // or app.applyAll(), app.reset(), app.hover('NOR-144')
</script>
```

`IssueTracker(el, { issues, decisions })` renders the sidebar, toolbar and 14-row list from data and toggles the five decisions as classes (`is-density`, `is-borders`, `is-oneColor`, `is-keyboard`, `is-alignment`); `set`, `applyAll`, `reset` and `hover` are the API, `rl:render` the event. `CommandPalette(el, { query })` renders the Cmd K palette from `COMMANDS`. `ISSUES` and `DECISIONS` are exported so you can swap the data.

## Where it belongs

Any dense product surface: issue trackers, admin tables, inboxes, CRM lists, log viewers. Apply all five before touching anything else; most of the "premium" feeling is already there.
