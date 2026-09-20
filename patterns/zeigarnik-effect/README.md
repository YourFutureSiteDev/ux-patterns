# Zeigarnik Effect

> Your brain forgets what's finished, and won't stop nagging about what's not.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/zeigarnik-effect](https://www.designmotionhq.com/patterns/zeigarnik-effect) · [Instagram](https://www.instagram.com/reel/DYMd5WYNiJz/) (14K views). Category: feedback.

## The rule

Leave a visible gap (an unchecked box, an 80% meter) tied to an outcome the user genuinely wants, keep the remaining percentage salient, and the open loop pulls them back. Close every loop at 100% and there is no reason to return.

## Key insights

- The mind keeps unfinished tasks in active memory and drops completed ones the moment they close: open loops keep pulling attention back.
- A progress meter stuck at 80% creates return pressure; a checklist shown as 100% done gives the user no reason to come back.
- In onboarding, deliberately leave one box unchecked: the visible gap nudges people to return and finish setup instead of vanishing.
- Profile-completion meters are the everyday version big platforms lean on: "80% done" becomes a persistent, low-friction pull.
- The effect only fires for outcomes the user actually wants: a fake "reading progress" bar on a marketing email creates zero pull.
- Think of the mechanic as a loop: open it, let it pull, bring them back (open loop → pull → return).

## Do / Don't

- **Do:** Leave a visible gap, an unchecked box or an 80% meter, to invite users back
- **Do:** Tie the unfinished progress to an outcome the user genuinely cares about
- **Do:** Keep the remaining percentage salient so the open loop stays top of mind
- **Don't:** Close every loop at 100%: a fully finished state removes any reason to return
- **Don't:** Manufacture progress on chores nobody asked for, like a reading bar on a marketing email

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Open loop | A glowing OPEN LOOP card at 80%, "Brain returns". "Unfinished wins." |
| 2 | 3s | How the brain processes tasks | ACTIVE MEMORY: COMPLETED "Sign up for newsletter" recalled 0×, INCOMPLETE "Finish your portfolio bio" counts up to 11×. "INCOMPLETE = 2× memory weight". |
| 3 | 12s | Onboarding · Application | Two Set up checklists: CLOSED (all five ticked, "User: gone, no return") vs OPEN · 60% with two boxes left ("User: returns daily"). "100% complete? You forget. 80%? It nags." |
| 4 | 21s | Big tech runs on this | Marie Rousseau's profile at 80% strength; "Add 3 more skills" and the "one step from 100%" notification arrive. "Not a suggestion. A trigger." |
| 5 | 30s | One critical catch | WRONG FIT (newsletter reading progress 30%, "Just noise.") vs RIGHT FIT (React Fundamentals course 65%, "Loop pulls."). |

The "Don't close the loop. Leave it open." outro is a save/follow CTA with no component in it, so it is not rebuilt.

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="zg">
  <div class="zg-loop" id="loop">
    <div class="zg-loop__label">SET UP</div>
    <div class="zg-bar"><div class="zg-bar__fill"></div></div>
    <div class="zg-loop__pct" data-pct></div>
    <div class="zg-loop__sub" data-sub></div>
  </div>
  <div id="list">
    <div class="zg-check"><i></i>Verify email</div>
    <div class="zg-check is-open"><i></i>Invite a teammate</div>
  </div>
</div>
<script type="module">
  import { OpenLoop, Checklist } from './pattern.js';
  const loop = OpenLoop(document.getElementById('loop'), { done: 4, total: 5, onPull: left => console.log(left, 'left') });
  Checklist(document.getElementById('list'), { loop });   // clicking a row toggles it and re-renders the meter
</script>
```

`OpenLoop` renders the bar and percentage, never rounds an open loop up to 100, pulses once the user is past the pull threshold, and calls `onPull(remaining)`. `Checklist` syncs `.zg-check` rows to the meter and fires `zg:progress`. `RecallCounter` animates the active-memory count. `isOutcome` is the guard: only open a loop on something the user initiated and wants.

## Where it belongs

Onboarding checklists, profile completion, course progress, setup wizards: anything the user started and wants finished. Not on marketing emails, not on chores, and never faked.
