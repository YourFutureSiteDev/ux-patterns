# Z-Index Mastery

> z-index lies: a bigger number won't win if the element isn't positioned.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/z-index-mastery](https://www.designmotionhq.com/patterns/z-index-mastery) · [Instagram](https://www.instagram.com/reel/DXbUi2Ytj6f/). Category: visual.

## The rule

Four rules. z-index only works on a positioned element. A child can never climb above its parent's stacking context, however big its number. `isolation: isolate` gives a component its own context in one line. When in doubt, open the Layers panel and look instead of guessing.

## Key insights

- z-index needs position. Setting `z-index: 9999` on a `position: static` element does nothing; give it `position: relative` (or absolute/fixed/sticky) and the layering finally works.
- Every stacking context is its own universe. A child at `z-index: 9999` can never climb above its parent's siblings. If the parent sits below, the child sits below too, no matter how huge the number.
- A z-index arms race (9999, then 99999) is a symptom, not a fix. The real culprit is almost always an unexpected stacking context somewhere up the tree.
- `isolation: isolate` spins up a fresh stacking context in one line, so a component's internal layers stop leaking out and z-fighting with the rest of the page.
- Stop guessing at the order. Chrome DevTools' Layers panel renders the page in 3D so you can see which element actually sits on top.

## Do / Don't

- **Do:** give an element `position: relative` before expecting `z-index` to do anything.
- **Do:** reach for `isolation: isolate` to contain a component's stacking in one clean line.
- **Do:** open DevTools' Layers panel to inspect the real 3D stack instead of trial and error.
- **Don't:** escalate to `z-index: 9999` to force a child above another branch. It can't beat what its parent already lost to.
- **Don't:** assume a bigger z-index always wins; it only ranks siblings inside the same stacking context.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | z-index lies. | A dropdown at z:10 under a modal at z:20, tilted in 3D. |
| 2 | 3s | Rule 1: z-index needs position | `.card-b { z-index: 9999; }`. Card A (relative, z 1) and Card B (static, z 9999) sit level. |
| 3 | 6s | Rule 1: the fix | `position: relative; ← fix` lands, Card B lifts and glows. "No position, no z-index. Relative · Absolute · Fixed · Sticky". |
| 4 | 13.5s | Rule 2: Parent caps child. | Parent A (z 1) holds a Child at z 9999; Parent B (z 2) wins. |
| 5 | 18s | Rule 2: the verdict | Chevron and spark; "9999 inside a context of 1 < 2 outside". |
| 6 | 24s | Rule 3: One line. Clean stack. | `.component { isolation: isolate; }` dimmed; Card, Tooltip, Dropdown leak into each other. |
| 7 | 28.5s | Rule 3: isolated | `isolate` highlighted; the three components settle flat, each tagged "isolated". |
| 8 | 33s | Rule 4: Debug visually. | Chrome DevTools window opens on the Layers panel. |
| 9 | 36s | Rule 4: the layers | Body #0, Card (z:1) #1, Dropdown (z:10) #2, Modal (z:20) #3 in 3D. "See every layer. Stop guessing." |
| 10 | 45s | Outro | Master z-index. Follow @designmotionhq. Save for later. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<script type="module">
  import { NeedsPosition, StackingContextOf, Isolate, LayerReport } from './pattern.js';
  NeedsPosition(el, { fix: true });            // rule 1: positions a static element so its z-index counts
  StackingContextOf(el);                       // rule 2: { root, reason } the ceiling this element lives under
  Isolate(document.querySelector('.widget'));  // rule 3: isolation: isolate on every .zi-comp inside
  LayerReport([{ el: modal, name: 'Modal' }, { el: menu, name: 'Dropdown' }]); // rule 4: ordered layer list
</script>
```

`NeedsPosition` reports whether an element is positioned and can apply `position: relative`. `StackingContextOf` walks up the tree and names the ancestor (and the property) that created the stacking context capping the element. `Isolate` gives each component its own context and marks it `is-isolated`. `LayerReport` returns the real stacking order to render into a `.zi-stack` Layers panel.

## Where it belongs

Modals, dropdowns, tooltips, sticky headers, toasts: anywhere layers fight. Position first, isolate components, inspect the Layers panel before touching a z-index value.
