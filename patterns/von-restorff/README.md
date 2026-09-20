# Von Restorff Effect

> Three identical pricing cards, nobody clicks. Isolate one: 3× more conversions.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/von-restorff](https://www.designmotionhq.com/patterns/von-restorff). Category: visual.

## The rule

What is visually different gets noticed and remembered. Keep everything else calm and change exactly one thing: scale, colour, elevation and a badge on the one item you want chosen.

## Key insights

- The isolation effect: what's visually different gets noticed and remembered. Make one item break the pattern and eyes land on it automatically.
- It only works against a uniform baseline. Three identical cards give the eye nowhere to go. Contrast is relative, so keep everything else calm and change just one thing.
- In pricing, isolate the target plan: scale it up, add a "Most Popular" badge, and dim the alternatives so the choice steers itself.
- Break the pattern with a single CTA. One "Get Started" button lifted by colour, scale and glow pulls attention (heat maps concentrate right on it) while nav links recede.
- In forms, emphasise the primary action and mute the secondary ones, so the next step is never in question.
- Differentiate with more than colour. Combine scale, elevation and glow so the standout reads reliably, including for colour-blind users.

## Do / Don't

- **Do:** isolate the one action you want taken, using scale, colour and a badge against a uniform baseline.
- **Do:** keep surrounding elements visually quiet so the highlighted one truly stands out.
- **Do:** limit emphasis to a single element per view: target plan, primary CTA, or main form button.
- **Don't:** highlight two or three elements at once. Competing emphasis cancels the effect entirely.
- **Don't:** ship identical options and hope users pick the one you actually want them to choose.
- **Don't:** lean on colour alone; pair it with scale or elevation so the contrast holds up.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Nobody clicks. | Basic $9, Pro $19, Team $49: three identical cards. |
| 2 | 1.5s | 3x more conversions | Pro scales up, turns purple, gets "Most Popular"; siblings dim. "3x" lands below. |
| 3 | 6s | The Von Restorff Effect | apple, banana, cherry, VIOLET, fig, grape, kiwi. One word in purple, the rest dimmed. |
| 4 | 13.5s | Isolate Your Target (baseline) | Basic $9/mo, Pro $29/mo, Enterprise $99/mo, all the same weight. |
| 5 | 15s | Isolate Your Target | Pro lifted, gradient, badge, "Get Pro"; "The target" callout. |
| 6 | 24s | Break The Pattern | AppCo nav with one purple "Get Started" (Attention: 80%), then a sign-up form whose "Sign Up" lights up. |
| 7 | 30s | Outro | Pricing / Navigation / Forms summary. Follow for design psychology. Save this. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="vr">
  <div class="vr-plans" id="plans">
    <div class="vr-plan">…</div>
    <div class="vr-plan"><span class="vr-plan__badge">Most Popular</span>…</div>
    <div class="vr-plan">…</div>
  </div>
</div>
<script type="module">
  import { IsolatePlan, PrimaryAction } from './pattern.js';
  IsolatePlan(document.getElementById('plans')).target(1);   // one target, siblings go quiet
  PrimaryAction(formEl, formEl.querySelector('[type=submit]')); // one primary button per scope
</script>
```

`IsolatePlan(group).target(i)` marks one `.vr-plan` as the target (`is-target`, or `is-target--soft` with `{ soft: true }`) and sets `is-quiet` on every sibling; `reset()` returns to the uniform baseline. `RevealWords(list, { odd })` plays the word-list reveal and isolates one item. `PrimaryAction(scope, btn)` promotes exactly one button in a nav or form. `AttentionMeter(el).set(pct)` drives the heat-map stand-in.

## Where it belongs

Pricing tables (the plan you want sold), site navigation (one CTA among links), forms (the submit over cancel). One standout per view. Never two.
