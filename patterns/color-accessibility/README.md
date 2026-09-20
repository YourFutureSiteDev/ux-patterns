# Color Accessibility

> Same text, same color: one is invisible. The contrast ratio nobody checks.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/color-accessibility](https://www.designmotionhq.com/patterns/color-accessibility). Category: visual.

## The rule

Contrast is a ratio, not a colour: check every text-on-background pair against WCAG (4.5:1 body, 3:1 large, 7:1 for critical UI), and never let colour carry meaning on its own. Pair every colour cue with an icon, label or pattern, then test in a colour-blindness simulator before you ship.

## Key insights

- Contrast is a _ratio_, not a color: the exact same off-white (#F0F0F0) reads crisp on a dark panel and disappears on a light one. The background decides legibility.
- Know the **WCAG thresholds**: aim for **4.5:1** on body text and **3:1** on large text. Below 3:1 the text degrades from "large-only" to flat-out invisible.
- Most failures hide in "decorative" muted grays: nav links, card labels and secondary headings routinely sit at 1.5 to 2:1 and quietly fall below the line.
- Never encode meaning with **color alone**: for the ~8% of users with color vision deficiency, a red error and a green success collapse into the same muddy tone.
- Add a **second signal** alongside every color cue: an icon on error text, trend arrows on stats, or textures/patterns in charts, so the message survives when the color doesn't.
- A full pass is cheap: darken or lighten muted text to clear the ratio, then bolt an icon onto each state. Same layout, dramatically more readable.

## Do / Don't

- **Do:** check every text-on-background pair against WCAG: 4.5:1 for body copy, 3:1 for large text.
- **Do:** pair color with an icon, label, or pattern so state survives color blindness.
- **Do:** lighten or darken "muted" secondary text until it clears the contrast threshold.
- **Don't:** rely on red-vs-green alone to separate errors from success.
- **Don't:** ship low-contrast grays for nav links and card labels just because they look sleek.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | High contrast / Low contrast | Same #F0F0F0 "Design" on a deep purple panel (7.2 : 1) and a muted one (1.4 : 1). |
| 2 | 3s | Rule 01: Contrast Ratio | Five rows from 15 : 1 (Crystal clear) to 1.5 : 1 (Invisible), AAA/AA badges, FAIL ZONE line. |
| 3 | 13s | Most apps fail both. | MyApp dashboard with callouts: Home 1.8 : 1, Welcome back 2.1 : 1, Revenue 1.5 : 1, all FAIL. |
| 4 | 17.5s | Hidden problem | Color Blindness counter to 300M+ over an email form with a red error and green Submit. |
| 5 | 20s | Same form. Same colors. Same problem. | The form with the error and Submit picked out. |
| 6 | 24s | Protanopia / Deuteranopia / Tritanopia | Three simulated copies of the form: no reds, no greens, no blues. |
| 6b | 28.5s | Same color | Deuteranopia highlighted, "SAME COLOR" badge, 1.5% / 6% / 0.01%. |
| 7 | 33s | Rule 01: Add Icons | Invalid email with a circled × icon, "Color + Icon ✓". |
| 8 | 36s | Rule 02: Use Patterns | Revenue / Costs / Growth bars gain stripes, dots and grid, "Color Blind Safe ✓". |
| 9 | 39s | Rule 03: 7:1 Contrast | Critical UI Text card, ratio meter counts 3.2 → 7.1 : 1 ✓ as the text brightens. |
| 10 | 42s | Rule 04: Test & Simulate | Browser in a deuteranopia simulator: 3 Errors, 12 Passed, 5 Pending, "Test Before Ship ✓". |
| 11 | 46.5s | Before / After | A purple divider sweeps the dashboard from muted labels to bright text plus icons, with hex annotations. |
| 11b | 52.5s | WCAG AA ✓ | The fixed dashboard with its badge. |

The closing "Save this for your next project" card is a pure CTA with no UI and is not rebuilt.

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ca">
  <p data-ca-check data-fg="#6b7280" data-bg="#0e1016">Muted label</p>
  <div class="ca-meter" id="meter"><b>3.2 : 1</b></div>
</div>
<script type="module">
  import { contrastRatio, wcagLevel, simulateCVD, ContrastAudit, RatioMeter } from './pattern.js';
  contrastRatio('#F0F0F0', '#241a3e');          // 14.3
  wcagLevel(4.5);                                // 'AA'
  simulateCVD('#e5304f', 'deuteranopia');        // what a deuteranope sees
  ContrastAudit(document);                       // sets data-ratio / data-level on every [data-ca-check]
  RatioMeter(document.getElementById('meter'), { from: 3.2, to: 7.1, duration: 2 }).play();
</script>
```

`contrastRatio` and `wcagLevel` are the WCAG 2.x maths. `simulateCVD` applies the Machado 2009 matrices for protanopia, deuteranopia and tritanopia. `ContrastAudit` walks `[data-ca-check]` elements and fires `ca:checked`. `CountUp`, `RatioMeter` and `CompareSlider` drive the reel's counter, ratio meter and before/after sweep (`play(elapsed)` renders a frozen frame, `play()` animates).

## Where it belongs

Every text-on-background pair, every status colour (error, success, pending), every chart series, every muted label. Run the audit in the design system, not per screen.
