# Range Sliders

> Drag to 47. Or 48? Your finger can't tell.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/range-sliders](https://www.designmotionhq.com/patterns/range-sliders) · [Instagram](https://www.instagram.com/reel/DZUtKvIqrHo/) (23.2K views). Category: forms.

## The rule

Design around finger imprecision: fill the track so the length is the value, make the whole row the drag target, snap to steps when clean numbers matter, float the value above the thumb, and drive it all from the keyboard.

## Key insights

- Dragging is imprecise. A finger can't reliably land on an exact value, so the readout flickers between 47 and 48. Design around that instead of pretending it isn't there.
- Fill the track. The filled length left of the thumb is the value, readable at a glance. A bare track forces users to eyeball the thumb and guess.
- Make the whole row draggable. A 4px hairline is a moving target that cursors keep missing; expand the hit area to the full row.
- Snap to steps when clean values matter. Free dragging lands on 47.3; snapping to increments with visible ticks keeps values round.
- Float the value in a tooltip above the thumb while dragging, so the exact number stays where the eye already is.
- Support a two-thumb range with a filled band between the handles, and make it keyboard-operable: arrows step by one, Home and End jump to the extremes.

## Do / Don't

- **Do:** show a filled track plus a live readout so the value is legible without guessing.
- **Do:** expand the drag target to the full row instead of just the thin track.
- **Do:** snap to steps and float a value tooltip above the thumb while dragging.
- **Don't:** rely on a 4px hairline as the only hit target.
- **Don't:** leave a slider continuous when users need clean, round values.
- **Don't:** ship a slider that can't be driven with arrow keys, Home, and End.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Drag to 47. Or 48? | Big 47% readout over a wide slider. "Your finger can't tell." |
| 2 | 3s | Make the whole row draggable | 4px track (cursor misses) vs full-row hit area (teal box). |
| 3 | 9s | Fill the track | no fill (?) vs filled (72%). "The fill length is the value." |
| 4 | 18s | Snap to steps | continuous 47.3 (pink) vs stepped 50 with ticks 0 25 50 75 100; then Volume 70, Rating 4 / 5, Price $50. |
| 5 | 27s | Float the value | 76% tooltip above the thumb while dragging. |
| 6 | 33s | One value? Or a range. | Price range $20 to $80, two thumbs, filled band, labels under each. |
| 7 | 39s | Make it keyboard-able | Focused slider, keycaps ← → Home End with End lit. |
| 8 | 45s | Outro | Follow for more UI systems. Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="rs">
  <div class="rs-slider" id="vol" tabindex="0">
    <div class="rs-slider__track"><div class="rs-slider__fill"></div></div>
    <div class="rs-slider__thumb"></div>
    <div class="rs-tip"></div>
  </div>
  <div class="rs-range" id="price"><div class="rs-range__track"><div class="rs-range__band"></div></div><div class="rs-range__thumb rs-range__thumb--a" tabindex="0"></div><div class="rs-range__thumb rs-range__thumb--b" tabindex="0"></div></div>
</div>
<script type="module">
  import { RangeSlider, DualRange } from './pattern.js';
  RangeSlider(document.getElementById('vol'), { min: 0, max: 100, value: 70, step: 5, tip: document.querySelector('#vol .rs-tip'), format: v => v + '%', onChange: v => console.log(v) });
  DualRange(document.getElementById('price'), { min: 0, max: 100, a: 20, b: 80, step: 5, onChange: (a, b) => console.log(a, b) });
</script>
```

`RangeSlider` maps pointer position (on the slider or a larger `hit` element) to a value, snaps to `step`, updates `--p`, shows the `tip` while dragging or focused, and handles ArrowLeft/Right, Home, End, PageUp/Down. `DualRange` runs two thumbs that cannot cross, with a filled band between.

## Where it belongs

Volume, brightness, rating, price filters, any bounded numeric input where the rough position matters more than typing an exact number. Pair it with a number field when users need to enter a precise value.
