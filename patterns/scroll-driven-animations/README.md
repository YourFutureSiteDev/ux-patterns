# Scroll-Driven Animations

> Same scroll: one feels dead, the other comes alive. Pure CSS, zero JavaScript.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/scroll-driven-animations](https://www.designmotionhq.com/patterns/scroll-driven-animations). Category: motion.

## The rule

Bind the animation to the scrollbar, not to a scroll listener. `animation-timeline: scroll()` maps progress to how far a container has scrolled, `view()` maps it to how far an element has come into view, and `animation-range` picks the exact slice of that journey. Two lines of CSS replace the listener, the rect maths and the library.

## Key insights

- `animation-timeline: scroll()` turns the scrollbar itself into an animation controller. No JavaScript, no IntersectionObserver, just two lines of CSS.
- `animation-range` sets the exact trigger point, so an animation can fire on entry, on exit, or anywhere in between the scroll.
- `view()` targets individual elements: each card or image animates the moment it enters the viewport, entirely on autopilot.
- Parallax that once took ~30 lines of JS and a scroll-event listener is now pure CSS: give layers different speeds with zero dependencies.
- Layer these on top of `position: sticky` to build shrinking headers, reading-progress bars, and sidebars that transform as you scroll.

## Do / Don't

- **Do:** reach for `animation-timeline: scroll()` and `view()` to tie motion to scroll position natively.
- **Do:** combine sticky positioning with a scroll timeline for shrinking headers and reading-progress bars.
- **Don't:** hand-roll parallax or reveals with a scroll listener and `getBoundingClientRect()` that CSS now drives on its own.
- **Don't:** pull in a JS animation library for effects the browser handles in a couple of CSS lines.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Same scroll. One feels alive. | Two browser windows scrolling the same feed: STATIC vs ANIMATED (cards slide in with `view()`). |
| 2 | 3s | Scroll-timeline | Browser window whose teal progress line under the bar is driven by `scroll()`. |
| 3 | 6s | JavaScript vs CSS | Struck-through scroll listener beside `.element { animation-timeline: scroll(); }`. "2 lines of CSS". |
| 4 | 10.5s | Animation-range | Viewport box with exit / entry 100% / entry 0% lines; the element crosses the entry band. |
| 5 | 12.5s | Animation-range | Element at the top, `animation-range: entry 0% entry 100%;` spelled out. |
| 6 | 16.5s | view( ) | Alex Morgan, Weekly Stats, Hero Section, Auto-Animate, Get Started cards rise into view. |
| 7 | 22.5s | Premium Landing Page | parallax-landing.dev: hero, stars, mountains and tiles at different speeds. JS vs CSS only. |
| 8 | 25.5s | Premium Landing Page | Same page scrolled; JavaScript struck out (✕), CSS only approved (✓). |
| 9 | 30s | Combine everything | ScrollApp docs: sticky nav, reading-progress bar, numbered sections, active-section rail. |
| 10 | 33s | Combine everything | Scrolled to Examples / Advanced; the rail follows. |
| 11 | 36s | Outro | CSS > JavaScript. Follow @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="sd">
  <div class="sd-app" style="position:relative">
    <div class="sd-app__progress"></div>
    <div class="sd-app__view sd-scroller">…long content…</div>
  </div>
  <ul class="sd-scroller">
    <li class="sd-item">…rises into view…</li>
  </ul>
</div>
<script type="module">
  import { supportsScrollTimeline, ScrollFallback, SectionRail } from './pattern.js';
  const view = document.querySelector('.sd-app__view');
  if (!supportsScrollTimeline) ScrollFallback(view);          // mirrors progress into --sd-progress
  SectionRail(view, [...view.querySelectorAll('.sd-sec')], document.querySelector('.sd-rail'));
</script>
```

The pattern lives in `pattern.css`: `.sd-scroller` names a scroll timeline (`--sd-view`), `.sd-app__progress` and `.sd-browser__progress` grow with `animation-timeline: --sd-view`, `.sd-item` and `.sd-browser--live .sd-card` animate on `view()`, and `.sd-layer` parallaxes with `scroll(nearest)` by `--offset`. `ScrollPlayer(scroller, [[t, px], …])` tweens a container's scrollTop along a timeline; `mountScrollScenes()` wires the demo's `data-scroll` attributes to it.

## Where it belongs

Reveal-on-scroll lists, reading-progress bars, parallax heroes, shrinking sticky headers, active-section rails. Not for anything that must react to scroll *velocity* or fire side effects: that still needs JavaScript.
