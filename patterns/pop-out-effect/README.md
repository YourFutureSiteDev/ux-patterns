# Pop-Out Effect

> Color tricks designers use on you: simultaneous contrast, the pop-out effect, colour temperature.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DUJ5D2SCmDv/) (7.7K views, no site page). Category: visual.

## The rule

Colour is read relative to its surroundings, not in isolation. Make one action pop by muting everything around it, put the primary colour on a ground that contrasts with it, and pick the hue for what it should say (red urgent, blue safe, green confirmed).

## Key insights

- Simultaneous contrast: the same #808080 square looks darker on a light ground and lighter on a dark one. Your brain reads colour by context, so the ground you put a button on changes how it reads.
- A Buy Now button in the brand orange disappears on an orange card and pops on a dark one. Same colour, two contexts; context changes everything.
- The pop-out effect: when every button has its own loud colour, nothing stands out. Mute the rest to grey and keep one primary and the eye goes straight to it. When everything is bold, nothing is.
- Colour temperature: the same Subscribe button reads "Urgent, act now" in red, "Safe and trustworthy" in blue and "Go ahead, confirmed" in green. Colour has a voice; make sure it says the right thing.
- In real interfaces this is why Delete is red (danger), Save is green (success) and Cancel is grey (neutral). It is not random.

## Do / Don't

- **Do:** put the primary action on a ground that contrasts with its colour.
- **Do:** give one action the colour and let the rest sit in grey.
- **Do:** choose red, blue or green for what the action means, not for taste.
- **Don't:** colour every button; six loud buttons compete and none wins.
- **Don't:** put a coloured button on a card of the same hue; it sinks into the ground.
- **Don't:** use red for a safe action or green for a destructive one; the temperature lies.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Same color. Different feeling. | Two #808080 squares on light and dark grounds; "Your brain is lying." |
| 2 | 4.2s | Coming up | Three cards cycle: Simultaneous Contrast, The Pop-Out Effect, Color Temperature. |
| 3 | 4.2s | Coming up (third card) | Same cycle frozen on Color Temperature. |
| 4 | 11s | Secret #1 | "Looks dark" and "Looks light" swatches. |
| 5 | 16.5s | Secret #1, Buy Now | Low contrast (orange on orange) vs high contrast (orange on dark). |
| 6 | 22.5s | Secret #2 | Everything screams (six coloured buttons) vs one clear action (five grey, one orange). |
| 7 | 27s | Secret #2, verdict | "Eye goes straight here". When everything is bold, nothing is. |
| 8 | 33s | Secret #3, red | Same button, "Urgent, act now". Live it cycles red, blue, green. |
| 9 | 39s | Secret #3, green | "Go ahead, confirmed". Colour has a voice. |
| 10 | 42s | In the real world | Delete (danger), Save (success), Cancel (neutral). It's not random. |
| 11 | 45s | All three principles at work | Settings dialog; Contrast chip. |
| 12 | 45s | All three chips | Contrast, Pop-out, Temperature chips; "Color isn't decoration. It's communication." |
| 13 | 55.5s | Outro | Want more design tricks? Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="po">
  <div class="po-grid" id="actions">
    <button class="po-btn" data-tone="red">Sign Up</button>
    <button class="po-btn" data-tone="green" data-action="buy">Buy Now</button>
    <button class="po-btn" data-tone="blue">Learn More</button>
  </div>
  <div class="po-temp" id="cta" data-tone="blue">
    <button class="po-temp__btn">Subscribe</button>
    <div class="po-temp__hint" data-tone="blue">🛡️ Safe &amp; trustworthy</div>
  </div>
</div>
<script type="module">
  import { popOut, ColorTemperature } from './pattern.js';
  popOut(document.getElementById('actions'), '[data-action="buy"]');   // one primary, the rest grey
  ColorTemperature(document.getElementById('cta')).set('green');      // red | blue | green
</script>
```

`popOut(grid, primary)` marks one `.po-btn` as primary and mutes the rest (`unPopOut` restores them). `ColorTemperature(root).set(tone)` switches the button's hue and shows the matching hint. `ContrastContext(swatch)` flips a swatch between light and dark grounds.

## Where it belongs

Any screen with more than one button: pricing tables, dialogs, toolbars, landing heroes. One primary, muted secondaries, and a hue that matches the action's meaning.
