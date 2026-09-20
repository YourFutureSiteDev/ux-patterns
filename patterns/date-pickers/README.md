# Date Pickers

> Same date. Six clicks. Or one. The picker that respects your users' time.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/date-pickers](https://www.designmotionhq.com/patterns/date-pickers) · [Instagram](https://www.instagram.com/reel/DYed0IGNeF3/) (39.2K views). Category: forms.

## The rule

Lead with presets, make custom ranges legible (hover previews, click locks, drag refines), show two months at once, wire the whole keyboard, and turn the popover into a full-screen sheet on mobile.

## Key insights

- Presets cover ~90% of cases. Offer Today, Yesterday, Last 7 days, Last 30 days, and Last quarter as one-click options, and reserve a custom range for the remaining edge cases.
- For custom ranges, make selection legible: hovering paints a live preview, the first click locks the start, the second locks the end, and the edges stay draggable to refine without starting over.
- Show two months side by side so a range can cross the month boundary naturally. Never force users to click "next" four times to reach a nearby date. Widen to three months on large screens.
- Support the full keyboard: arrows move focus across the grid, users can type the date directly, Enter confirms, Escape closes, Page Up jumps a month, and Shift+Page Up jumps a year.
- Mobile is not a popover. Use a full-screen sheet that scrolls vertically, keep today anchored at the top, and place a large confirm button at the bottom within thumb reach.

## Do / Don't

- **Do:** lead with presets for common ranges and keep a custom option only for the exceptions.
- **Do:** render two calendar months at once so ranges can span the month boundary.
- **Do:** wire up the full keyboard: typing, arrow navigation, Enter/Escape, and month/year jumps.
- **Don't:** force repeated "next" clicks to reach a month that's only a few weeks away.
- **Don't:** shrink the desktop popover onto mobile instead of using a full-screen sheet.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Same date. Different time. | The old way (September 2026, Click 6/6, 6 clicks · 5 seconds) vs the right way (Last 30 days, Click 1/1, 1 click · 1 second). |
| 2a | 3s | 01 · Presets: Today | Presets list with Today active, March + April 2026, April 14. |
| 2b | 6s | Last 7 days | Apr 7 → Apr 14 range. |
| 2c | 9s | Last quarter | Q1 2026, February and March fully shaded. |
| 2d | 10.5s | Custom range | Mar 20 → Apr 8, then the split: Today 14%, Yesterday 9%, Last 7d 31%, Last 30d 22%, Last quarter 14%, Custom 10%. |
| 3a | 12s | 02 · Range highlight: Hover | Dashed preview over May 5 to 16, summary greyed out. |
| 3b | 15s | Click | May 5 → May 9 · 5 days locked. |
| 3c | 18s | Drag | Edge dragged to May 18 · 14 days. |
| 4a | 19.5s | 03 · Two months: single | March 2026 alone, Single month, Click 0/4. |
| 4b | 21s | Two months side by side | Mar 20 → Apr 12 across the boundary, plus the wide-screen 3-month strip. |
| 5a | 27s | 04 · Keyboard: Type | DATE input with the MM/DD/YYYY mask and focus ring on the 20th. |
| 5b | 30s | Arrow | 03/12/2026 typed, selection on the 12th. |
| 5c | 33s | Page Up | Jumps to February 2025, Pg↑ key lit. |
| 6 | 36s | 05 · Mobile is a sheet | Tiny popover (Too tiny to tap) vs full-screen sheet vs Confirm dates. Touch target ≥ 44px. |
| 7 | 45s | Outro | Mar 12 → Mar 18 calendar, Follow for more UI systems, @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dp">
  <div class="dp-input"><span class="dp-label">Date</span><input class="dp-input__val" id="date" placeholder="MM/DD/YYYY"></div>
  <div class="dp-card" id="picker"></div>
  <p id="summary"></p>
</div>
<script type="module">
  import { RangePicker, DateInput, PRESETS } from './pattern.js';
  const picker = RangePicker(document.getElementById('picker'), { year: 2026, month: 2, months: 2,
    onChange: () => document.getElementById('summary').textContent = picker.summary() });
  DateInput(document.getElementById('date'), picker);
  picker.preset('Last 7 days');
</script>
```

`monthGrid()` renders one month (the demo uses it for every static state). `RangePicker` owns hover preview, click to lock, drag to refine, arrows, Home/End, Page Up/Down (Shift for a year), Enter and Escape; it fires `dp:change` and `dp:close`. `PRESETS` maps names to `[start, end]`. `DateInput` masks typed input as MM/DD/YYYY and validates it.

## Where it belongs

Analytics date ranges, booking and travel forms, report filters, anywhere a user picks one date or a span. Presets first on desktop, a sheet with a big confirm on mobile.
