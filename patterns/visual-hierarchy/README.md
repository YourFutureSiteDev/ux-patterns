# Visual Hierarchy

> Five rules that decide what your users see first, and what they skip.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/visual-hierarchy](https://www.designmotionhq.com/patterns/visual-hierarchy) · [Instagram](https://www.instagram.com/reel/DVw9eAhCocG/) (19K views). Category: visual.

## The rule

Same content, completely different feel. Size, color, contrast, whitespace and weight stack to make one clear focal point: make the primary element about 2x body text, spend one accent color only where it matters, widen the contrast between roles, give the hero room, and build reading order with weight.

## Key insights

- Size sets the entry point: make the primary element roughly 2x the size of body text so the eye lands on it before anything else.
- Spend color like currency. Keep the interface neutral and reserve one accent for the single most important action. A rainbow of colors flattens everything into noise.
- Contrast separates roles: a bold white heading against muted body copy, or a filled primary button next to a ghost secondary, makes the priority obvious at a glance.
- Whitespace is a signal, not filler. Give the hero element breathing room and keep secondary items compact; intentional spacing reads as importance.
- Font weight builds reading order without changing size: heavy for headings (800), regular for body (400), light for captions (300).
- No single rule carries a layout. Size, color, contrast, whitespace and weight stack to make one clear focal point.

## Do / Don't

- **Do:** reserve one accent color for the one action you want users to take.
- **Do:** make the headline about twice the size of the body text around it.
- **Do:** give the most important element more padding than everything else.
- **Don't:** color every element differently; it turns hierarchy into visual noise.
- **Don't:** lean on size alone; combine it with weight, contrast and spacing.
- **Don't:** cram everything at equal emphasis so nothing stands out.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | NO HIERARCHY flat dashboard vs CLEAR HIERARCHY dashboard. "Five rules. That's all." |
| 2 | 6s | 1 Size, before | Monthly Revenue card with an 18px heading; Caption, Body, Heading, Display bars. |
| 3 | 12s | 1 Size, after | Heading grows to 40px with the 2x badge. |
| 4 | 15s | 2 Color, rainbow | Nav with five coloured pills, red / green / purple stat cards. |
| 5 | 21s | 2 Color, one accent | Neutral nav with one purple Pricing pill, one accented Growth card. "One accent color. Only where it matters." |
| 6 | 24s | 3 Contrast | Premium Plan with filled and ghost buttons; Bold 800 vs Light 300, Filled vs Outlined, #FFFFFF vs #4a4a6a. "Bigger difference = stronger signal". |
| 7 | 33s | 4 Whitespace, cramped | Start Free Trial jammed against Features, Pricing, Documentation. |
| 8 | 42s | 4 Whitespace, intentional | Hero gets a 48px gap and padding; rows stay compact. "Not empty. Intentional." |
| 9 | 51s | 5 Typography weight | 800 heading, 400 body, 300 caption; "You read this first" reading-order card. |
| 10 | 60s | Summary | "Five rules. One clear hierarchy." with the five numbered chips. |

The "More design tips? Follow" outro is a pure CTA with no UI and is not rebuilt.

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="vh">
  <div class="vh-hero" id="hero"><h2 class="vh-hero__title">Monthly Revenue</h2><p class="vh-hero__body">…</p></div>
  <nav class="vh-nav" id="nav"><span>Home</span><span>Products</span><span class="on">Pricing</span><span>About</span></nav>
  <div class="vh-space" id="stack">…</div>
</div>
<script type="module">
  import { emphasize, spendAccent, breathe, weightOrder, contrastPairs } from './pattern.js';
  emphasize(document.getElementById('hero'), { scale: 2 });   // heading = 2x body
  spendAccent(document.getElementById('nav'), '.on');           // one accent, nothing else coloured
  breathe(document.getElementById('stack'), 48);                // hero gets 48px of air
</script>
```

`emphasize` sizes a heading from its body text, `spendAccent` strips every colour from a group and gives the accent to one element, `breathe` opens a cramped stack around its hero, `weightOrder` applies 800 / 400 / 300 to a block, and `contrastPairs` lists the three strong-vs-weak pairs from the reel. The stat, nav, plan, pair, space, weights and chip classes are plain CSS.

## Where it belongs

Dashboards, landing heroes, pricing cards, settings pages, empty states: any screen where one thing must be seen first. Apply all five rules to the same focal element; never spread them across competing elements.
