# Color Picker UX

> Pick a color. Your whole UI answers.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/color-picker-ux](https://www.designmotionhq.com/patterns/color-picker-ux) · [Instagram](https://www.instagram.com/reel/DaAWS2btQac/) (25.1K views). Category: interaction.

## The rule

Treat the picker as a decision tool, not a gradient with a slider. Every pick cascades into the UI, reads as OKLCH as well as hex, remembers the last five, checks contrast while you pick, previews alpha on light and dark, and expands one hue into ten tokens.

## Key insights

- Treat the picker as a decision tool, not a gradient with a slider: every choice cascades into the rest of the UI.
- Offer OKLCH next to hex. Hex is for machines; OKLCH's lightness, chroma, and hue let you change one number and get a predictable shade.
- Give the picker memory: recent swatches and saved palettes put your last five picks one tap away instead of re-hunting each time.
- Show a live contrast ratio at pick time, not in review: a badge that flips red to green kills failing pairs before they ship.
- Preview alpha over a checkerboard on both light and dark backgrounds. Transparency lies on a white canvas, so check it before you commit.
- Turn one pick into a system: generate tints and shades from a single hue to produce ten tokens from one decision.

## Do / Don't

- **Do:** expose human-readable formats like OKLCH so one value maps to a predictable shade.
- **Do:** surface recent swatches and saved palettes so past picks stay one tap away.
- **Do:** validate contrast live while picking, with a badge that reads red or green.
- **Don't:** preview alpha only on white; a checkerboard reveals the true transparency.
- **Don't:** ship a bare gradient-and-slider picker with no memory, contrast check, or palette output.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Pick a color. Your whole UI answers. | Purple picker #5468CF; dashboard, toggle, progress and Primary button all take the colour. |
| 2 | 3s | 01 · Format (RGB) | Tabs HEX / RGB / HSL / OKLCH; rgb(59, 130, 246) "for screens"; L C H sliders; five shades L 0.35 to 0.75. |
| 3 | 6s | 01 · Format (OKLCH) | oklch(0.62 0.19 259) "for humans"; slider panel lights up. |
| 4 | 9s | 01 · Format (one number) | Lightness to 0.75, swatch L 0.75 highlighted. "Hex is for machines. OKLCH reads human." |
| 5 | 12s | 02 · Memory | Teal pick #48D9BA; two recent swatches filled, three empty. |
| 6 | 15s | 02 · Memory (four picks) | Pink #E94780; recent row holds blue, teal, purple, orange. |
| 7 | 18s | 02 · Memory (restore) | Tap the teal swatch: "Restored in one tap #48D9BA". "Your last five picks. One tap away." |
| 8 | 21s | 03 · Contrast (2.3 : 1) | Continue button in #5EA3F9; badge 2.3 : 1 FAIL; scale 3:1, 4.5:1 AA, 7:1 AAA. |
| 9 | 24s | 03 · Contrast (4.1 : 1) | Darker #2D6EED still fails. |
| 10 | 25.5s | 03 · Contrast (4.8 : 1) | #2463EB passes AA, badge flips green. "Bad pairs die before they ship." |
| 11 | 30s | 04 · Alpha | Alpha 40 % on a checkerboard; On light "reads pastel", On dark "almost gone"; rgba(59, 130, 246, 0.40). |
| 12 | 36s | 05 · Palette | One pick #3B82F6 hue 217° → blue-50 to blue-900; "10 tokens · 1 decision". "One pick builds the system." |
| 13 | 42s | Outro | Five-step ramp, @designmotionhq, Follow for more design tooling, Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="cp" id="app">
  <div class="cp-picker" id="picker">
    <div class="cp-area"><div class="cp-thumb"></div></div>
    <div class="cp-hue"><div class="cp-thumb"></div></div>
    <div class="cp-field"><div class="cp-swatch"></div><div class="cp-input" id="hex"></div></div>
    <div class="cp-recent" id="recent"></div>
  </div>
  <div class="cp-ratio" id="ratio"></div>
</div>
<script type="module">
  import { ColorPicker, RecentSwatches, ContrastBadge, formats, tintsAndShades } from './pattern.js';
  const recent = RecentSwatches(document.getElementById('recent'), hex => picker.set(hex));
  const picker = ColorPicker(document.getElementById('picker'), { onChange: hex => {
    app.style.setProperty('--cp-color', hex);                  // the whole UI answers
    document.getElementById('hex').textContent = formats(hex).oklch;
    ContrastBadge(document.getElementById('ratio'), '#FFFFFF', hex);
  } });
  picker.set('#3B82F6'); recent.push('#3B82F6');
  const tokens = tintsAndShades('#3B82F6', 'blue');            // ten tokens from one decision
</script>
```

`ColorPicker` drives the saturation/value area and hue bar and sets `--cp-color` so every component styled with it recolours. `formats(hex)` gives hex, rgb, hsl and oklch strings (`toOklch` does the OKLab maths). `RecentSwatches` keeps the last five picks and restores one on tap. `ContrastBadge` / `contrastRatio` / `grade` compute WCAG ratios live. `tintsAndShades` expands one hue into the 50 to 900 ramp.

## Where it belongs

Theme editors, design-token tools, brand settings, chart and tag colour pickers: anywhere one colour choice ripples through the product. Not for a single decorative swatch with no downstream use.
