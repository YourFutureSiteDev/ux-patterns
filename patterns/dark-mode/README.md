# Dark Mode

> Same app, one inverts colors. The other feels premium.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/dark-mode](https://www.designmotionhq.com/patterns/dark-mode). Category: visual.

## The rule

Dark mode is not black mode. Build on a near-black base (#121212) and lighten each surface as it elevates, desaturate accent colours by about 20%, and never set text to pure white: calibrate it to a soft off-white and build hierarchy with opacity.

## Key insights

- Dark mode is **not black mode**. Build on a near-black base like **#121212**, not pure #000000, so shadows and depth stay visible.
- Signal elevation with **layered surfaces**: each step up gets a lighter grey (base → surface → elevated), the way shadows do the job in light mode.
- **Desaturate accent colors** by roughly **20%**. Full-saturation buttons and highlights vibrate and strain the eye against a dark background.
- **Never use pure white text.** #FFFFFF glares on dark UI; calibrate it down to a soft off-white for comfortable reading.
- Build **text hierarchy with opacity**, not new colors: high-emphasis, medium, and disabled text simply step down in white opacity.

## Do / Don't

- **Do:** base your darkest layer on a near-black grey like #121212, then lighten each surface as it elevates.
- **Do:** desaturate accent colors so buttons and highlights sit calmly against the background.
- **Do:** dim body text to a soft off-white and use opacity tiers to separate emphasis levels.
- **Don't:** use pure black (#000000) as the background. It flattens elevation and hides shadows.
- **Don't:** ship fully saturated accent colors. They buzz and read as cheap on dark UI.
- **Don't:** set text to pure white (#FFFFFF). The glare fatigues the eyes over time.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Same app. | WRONG: pure-black DarkApp card with a hot pink button. RIGHT: layered greys with a desaturated purple button. |
| 1b | 1.5s | One feels premium. | The RIGHT card alone, scaled up. |
| 2 | 3s | Layered Surfaces | Base #121212, Surface #1E1E1E, Elevated #2C2C2C stacked with a DEPTH arrow. |
| 3 | 15s | Soften Your Colors | Subscribe #FF3366 → #CC4477 and Confirm #00FF88 → #66DDAA, each "-20%". |
| 4 | 22.5s | Calibrate Your Text | #FFFFFF HARSH vs #E0E0E0 COMFORTABLE, then Headlines 90% white / Body Text 70% white. |
| 5 | 31.5s | Recap | 1 Layered Surfaces, 2 Soft Colors, 3 Calibrated Text, plus the follow card. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dm" id="app">…surfaces use var(--dm-base) / var(--dm-surface) / var(--dm-elevated), text uses var(--dm-text-hi) / var(--dm-text-md)…</div>
<script type="module">
  import { DarkTheme, surfaces, desaturate, textTiers } from './pattern.js';
  surfaces('#121212');            // { base: '#121212', surface: '#1e1e1e', elevated: '#2c2c2c' }
  desaturate('#ff3366', .2);      // the softened accent
  textTiers();                    // { high: rgba(255,255,255,.9), medium: .7, disabled: .38 }
  DarkTheme(document.getElementById('app'), { base: '#121212', accent: '#ff3366' }); // writes all of it as custom properties
</script>
```

`surfaces` derives the three-step elevation ladder from one base. `desaturate` pulls an accent's saturation down (default 20%). `textTiers` is the opacity ladder. `DarkTheme` applies the whole system to any element. `Reveal` staggers a list in and can freeze at a moment for screenshots.

## Where it belongs

Every dark theme: app shells, dashboards, settings, marketing pages with a dark section. Set the ladder once in the design tokens and never reach for #000 or #fff again.
