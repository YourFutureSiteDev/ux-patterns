# Rounded Shapes

> Dangerous? Safe? Your brain decides in milliseconds.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DUSsx9SDCCv/) (16.2K views, Instagram only, no site page). Category: visual.

## The rule

The amygdala reads sharp corners as a threat and rounded ones as safe, in milliseconds and before you think. Round the corners of anything you want people to feel comfortable touching: buttons, cards, inputs, toggles, notifications.

## Key insights

- The brain classifies a shape as dangerous or safe in milliseconds, before conscious thought. A sharp square reads as a threat; a rounded one reads as safe.
- The amygdala is the brain's threat detector. Evolution trained it on thorns, claws, teeth and sharp things, so pointed edges trigger it.
- Rounded means safety: soft, gentle, harmless, friendly. Something you can touch without getting hurt.
- UI evolved for a reason. The 2010 square grey "Buy Now" became the 2024 rounded purple one because the rounded one feels trustworthy, and every major tech company made the shift.
- Look around you: subscribe buttons, notifications, search fields, toggles. Every UI element is rounded, and once you notice it you see it everywhere.

## Do / Don't

- **Do:** round the corners of anything the user is meant to press, type into or trust.
- **Do:** pair the radius with a soft glow or shadow so the element reads as a physical, safe object.
- **Do:** keep radii consistent across a screen so the whole interface feels like one calm surface.
- **Don't:** ship sharp-cornered primary buttons; the threat detector fires before the copy is read.
- **Don't:** mix a square 2010 control into a rounded 2024 interface; the odd one out looks untrustworthy.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Dangerous? Safe? | Red sharp square vs green rounded square. "Your brain decides in milliseconds". |
| 2 | 6s | Your Amygdala | Brain with Thorns, Claws, Teeth, Sharp circling it. "Evolution taught you to fear sharp things". |
| 3 | 15s | Rounded = Safety | Glowing green rounded square with Soft, Gentle, Harmless, Friendly. "Something you can touch without getting hurt". |
| 4 | 21s | UI evolved: 2010 | Grey square serif "Buy Now". |
| 5 | 25.5s | UI evolved: 2024 | Purple rounded "Buy Now" (radius morphs live), "Feels trustworthy", "Every major tech company made this shift". |
| 6 | 30s | Look around you | Subscribe, Learn More, notification card, search pill, toggle. "Every UI element. Rounded." |
| 7 | 36s | Now you'll see it everywhere | Closing line. "Every rounded corner. Every soft edge." |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="rs">
  <button class="rs-buy rs-buy--2024" id="buy">Buy Now</button>
  <label class="rs-toggle"><input type="checkbox" id="on" checked><span class="rs-toggle__track"></span><span class="rs-toggle__text">Enabled</span></label>
</div>
<script type="module">
  import { morphRadius, SafeToggle } from './pattern.js';
  morphRadius(document.getElementById('buy'), 0, 12, 700);   // square to rounded
  SafeToggle(document.getElementById('on'));                   // emits 'rs:change'
</script>
```

`morphRadius(el, from, to, ms)` animates a corner radius with the Web Animations API. `SafeToggle(input)` wraps a rounded switch and reports state. `staggerIn(root, selector, gap)` pops a set of children in one after another. The rounded UI kit (`.rs-btn`, `.rs-notif`, `.rs-search`, `.rs-toggle`) is plain CSS.

## Where it belongs

Buttons, cards, inputs, chips, toggles, toasts, modals: anything the user touches. Sharp corners are for dividers, tables and code, where nothing is being pressed.
