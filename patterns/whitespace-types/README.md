# Whitespace Types

> White space isn't empty. It's breathing room. Three types: micro, macro, active.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DWCB3g6DPfi/) (12.5K views). Category: visual. Caption: "White space make you UI clean and professional".

## The rule

Treat empty space as a material with three jobs: padding inside elements (micro), margins between sections (macro), and deliberate emptiness that makes one element pop (active). The same content with 40px padding and 22px gaps reads as premium; with 16px and 8px it reads as cramped.

## Key insights

- White space isn't empty. It's breathing room, and it is what separates a professional-looking interface from a cluttered one.
- Micro white space is the padding inside elements: buttons, inputs and cards. A button that looks cheap usually just needs more padding.
- Macro white space is the margin between sections, the vertical rhythm of the page. Intentionally large gaps (40px and up) tell the eye where one thing ends and the next begins.
- Active white space is intentional emptiness used to draw focus. Leave room around the one element you want people to see and it pops on its own.
- The profile card proves it: identical content, but 40px padding and 22px gaps instead of 16px and 8px, and it feels premium.

## Do / Don't

- **Do:** give buttons, inputs and cards generous internal padding before reaching for borders or shadows.
- **Do:** separate sections with big, consistent margins so the page has a rhythm.
- **Do:** leave one element alone in its space when you want it to draw the eye.
- **Don't:** pack a card at 16px padding and 8px gaps and wonder why it looks cheap.
- **Don't:** fill every gap with content; emptiness is doing a job.
- **Don't:** use a single spacing value everywhere; micro, macro and active spaces need different sizes.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | WHITE SPACE | Nine cramped tiles spread apart; "It's not empty. It's breathing room." |
| 2 | 3s | 3 TYPES | MICRO (Subscribe, padding: 17px), MACRO (two blocks), ACTIVE (Get Started Free) reveal in turn. |
| 3 | 7.5s | 3 TYPES (opened) | Padding counts to 18px, the macro gap opens to 40px, the active CTA lights up. |
| 4 | 18s | REAL EXAMPLE: BEFORE | Alex Rivera profile card at padding 16px, gap 8px. Cramped. |
| 5 | 22.5s | REAL EXAMPLE: AFTER | Same card at padding 40px, gap 22px; old specs dim, new ones in green. |
| 6 | 27s | Same content. Feels premium. | The airy card with its verdict. |
| 7 | 30s | Outro | Give your designs room to breathe. Follow for daily design tips. |

Every scene carries the reel's karaoke caption (`.ws-cap`) with spoken words in white.

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ws">
  <div class="ws-card" id="card">…head, bio, rule, stats, chips, cta…</div>
</div>
<script type="module">
  import { BreathingCard } from './pattern.js';
  const card = BreathingCard(document.getElementById('card'), { tags: { padding: [padEl, 16, 40], gap: [gapEl, 8, 22] } });
  card.open();   // cramped -> airy (CSS transitions tween padding, gaps and type size)
</script>
```

`BreathingCard(card, { tags, duration })` toggles `is-airy` and counts the spec tags; `jump(airy)` sets a state without transition. `MacroGap(blocks).set(px)` opens the gap between two content blocks and shows its label. `Spotlight(scope, btn)` lights one CTA and clears every other. `CountPx(el, a, b)` counts a pixel value. `Karaoke(el, words)` plays a caption.

## Where it belongs

Cards, profile panels, pricing tables, forms, hero sections, any layout that "looks cheap" with the right content. Reach for padding and margin before decoration.
