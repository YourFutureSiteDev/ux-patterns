# Tooltip Design

> Your tooltip is annoying. Five rules that make it feel premium.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/tooltip-design](https://www.designmotionhq.com/patterns/tooltip-design) · [Instagram](https://www.instagram.com/reel/DXoUdH2t8Id/) (25.4K views). Category: interaction.

## The rule

Wait 300ms, point with an arrow, flip near edges, dismiss everywhere, keep it tight. A tooltip is a hint, not documentation.

## Key insights

- Add a 300ms delay before a hover tooltip appears, so it doesn't fire on every accidental cursor graze across the trigger.
- Anchor the tooltip to its trigger with an arrow. Without one, a floating label sitting above a row of icons leaves users guessing which element it actually describes.
- Flip the tooltip to the opposite side when the trigger sits near a viewport edge; otherwise it gets clipped off-screen instead of staying readable.
- Make it dismissible everywhere: mouse leave, the Escape key, focus out (blur), and a tap outside should all close it. Every escape route matters.
- Keep the copy tight: cap the width around 300px and hold it to one sentence. If you need a documentation paragraph, it's not a tooltip anymore.

## Do / Don't

- **Do:** wait ~300ms before revealing a hover tooltip.
- **Do:** point at the trigger with an arrow so the reference is unambiguous.
- **Do:** flip position near viewport edges to prevent clipping.
- **Don't:** fire instantly on every cursor graze.
- **Don't:** cram multi-line, documentation-length text into a single tooltip.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | "Your tooltip is annoying." Cheap (red wall of text) vs Premium (teal). |
| 2 | 3s | Rule 1 · Wait 300ms | 0ms DELAY fires on every cursor graze; 300ms DELAY confirms intent. |
| 3 | 9s | Rule 2 · Point with an arrow | "Settings" floating over four icons (?) vs the same tip with an arrow. |
| 4 | 15s | Rule 2 · Point with an arrow | Same for "Profile". "Arrows remove all doubt." |
| 5 | 18s | Rule 3 · Flip near edges | Info button at the window edge, tip about to clip on the right. |
| 6 | 22.5s | Rule 3 · Flip near edges | Tip flipped to the left, "✓ FLIPPED IN BOUNDS". "Detect viewport bounds. Adjust anchor." |
| 7 | 27s | Rule 4 · Dismiss everywhere | Mouse leave, Escape key (active, ✓ CLOSED), Focus out, Tap outside. |
| 8 | 30s | Rule 4 · Dismiss everywhere | Tap outside active. "Every escape route matters." |
| 9 | 33s | Rule 5 · Keep it tight | BEFORE 600px documentation vs AFTER 300px, one sentence. "A hint, not documentation." |
| 10 | 39s | Outro | "Tooltips, done right." Follow @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="tt">
  <button class="tt-btn" id="settings" aria-label="Settings">…icon…</button>
</div>
<script type="module">
  import { Tooltip } from './pattern.js';
  Tooltip(document.getElementById('settings'), { text: 'Settings', placement: 'top', delay: 300, maxWidth: 300 });
</script>
```

`Tooltip` builds a `.tt-tip.tt-tip--arrow`, waits `delay` ms on hover (shows at once on keyboard focus), positions it on `placement` and flips to the opposite side when the container would clip it, then closes on pointer leave, Escape, blur and outside pointerdown (events `tt:open`, `tt:close` with the reason). `CheapTooltip` is the 0ms, no-arrow control from the hook.

## Where it belongs

Icon-only buttons, truncated labels, keyboard shortcut hints. One sentence, one trigger, one arrow. Anything longer belongs in a popover or the docs.
