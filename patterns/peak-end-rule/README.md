# Peak-End Rule

> Users don't average an experience. They remember its peak and its end.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/peak-end-rule](https://www.designmotionhq.com/patterns/peak-end-rule) · [Instagram](https://www.instagram.com/reel/DYUA2atNd01/) (15.2K views). Category: interaction.

## The rule

Memory keeps two points of a flow: the most intense moment and the last one. Plant one deliberate peak, end on a high note, and never let a flow finish on friction, because the ending overwrites everything before it.

## Key insights

- The brain doesn't average a flow. It stores the most intense moment (the peak) and the final moment (the end), then judges the whole from those two points.
- Two flows with an identical average satisfaction are remembered completely differently based on how they finish: same middle, opposite memory.
- Engineer at least one intentional peak: a surprise upgrade, a free perk, a moment of delight. One delight outweighs five neutral steps.
- The ending carries disproportionate weight. A joyful last screen beats a flat, cold confirmation for the exact same effort.
- The reverse also holds: a broken or error-filled final step tanks the memory of an otherwise smooth experience.
- Stop trying to make every step equally good. Concentrate your effort on the peak and the end.

## Do / Don't

- **Do:** engineer a deliberate peak, a surprise or moment of delight partway through the flow.
- **Do:** end on a high note: celebrate success on the last screen instead of a flat confirmation.
- **Do:** audit the final interaction of every flow. It weighs heaviest in what users remember.
- **Don't:** spread effort evenly across every step while neglecting the finish.
- **Don't:** let a flow end on friction, an error, or a cold dead-end.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Peak-end rule | Path A and Path B, both AVG · 65, drawing live. A drops at the END, B rises. Memory 0/100 for A. |
| 2 | 1.2s | How memory works | Satisfaction curve draws, then PEAK (teal) and END (green) light up. |
| 3 | 10.5s | How memory works (formula) | PEAK + END = MEMORY. AVERAGE · TIME SPENT · EFFORT struck through. |
| 4 | 12s | Same flow · 60 seconds | Cold ending ("Order placed.") vs joyful ending ("You're all set!" Tomorrow · free). Memory counters start. |
| 5 | 18s | Same flow (scored) | Memory 58/100 vs 94/100. "Same UX. +40% recall." |
| 6 | 19.5s | Design intentional peaks | Browse, Filter, Add to cart, Checkout, then the Surprise upgrade PEAK row. |
| 7 | 28.5s | Design intentional peaks (note) | "Plant a peak. One is enough." |
| 8 | 30s | The reverse is also true | Sign up, Verify email, Pick a plan, Add payment all done. Memory rating 85/100. |
| 9 | 34.5s | The reverse (payment failed) | "Payment failed. Card declined · try another method" ERROR. Memory rating drops to 22/100. |
| 10 | 36s | The reverse (verdict) | "The 99% that worked? Gone." |
| 11 | 39s | Outro | Forget the average. Polish the end. PEAK · END · MEMORY. |
| 12 | 40.5s | Outro (CTA) | Save for your next user flow. Follow for more design psychology. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="pe">
  <div class="pe-rating" id="rating"><span>MEMORY RATING</span><b><span data-num>0</span><small>/100</small></b></div>
  <div class="pe-bar"><i data-bar></i></div>
</div>
<script type="module">
  import { peakEndScore, FlowPeak, MemoryMeter, curvePath } from './pattern.js';
  const steps = [{ label: 'Browse', score: 60 }, { label: 'Filter', score: 62 }, { label: 'Checkout', score: 63 }];
  const { before, after } = FlowPeak(steps, { label: 'Surprise upgrade', detail: '+ Free express shipping', score: 95 });
  MemoryMeter(document.getElementById('rating').parentNode).set(after); // animates the number and the bar
  svgPath.setAttribute('d', curvePath(points));                            // draw a satisfaction curve
</script>
```

`peakEndScore(steps)` weights the peak and the end at 45% each and the average at 10%, which is how the reel scores 58 vs 94 and 85 vs 22. `FlowPeak(steps, peak, at)` inserts a delight step and returns the memory before and after. `MemoryMeter(root).set(value)` counts the number and fills the bar. `curvePath(points)` and `areaPath(points, baseY)` build the smooth satisfaction curves.

## Where it belongs

Checkout confirmations, onboarding finales, upload and export completions, support ticket closures: anywhere a flow ends. And one planted delight mid-flow: a free upgrade, a faster delivery, an unexpected thank-you. Never spend the polish budget evenly across neutral steps.
