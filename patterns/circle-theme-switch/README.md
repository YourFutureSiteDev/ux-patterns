# Circle Theme Switch

> Press the light or dark toggle and the new theme grows outwards as a circle from the button you pressed.

From the reel by Code & Chill (https://www.instagram.com/reel/De12lc1vUmr/, Insta batch 17 Nov 2026), rebuilt in plain JS. Not one of the @designmotionhq set. Category: motion.

## The rule

The circle starts at the toggle, so the change visibly comes from what the user touched. It is decoration on a choice the page already supports: with no View Transitions API, or with reduced motion on, the theme swaps instantly and nothing is lost.

## How it works

1. On click, find the toggle's centre and the distance to the farthest corner of the window.
2. Call `document.startViewTransition` with a function that flips `data-theme`.
3. When the transition is ready, animate a `clip-path` circle on `::view-transition-new(root)` from 0 to that distance, about 620ms.
4. `pattern.css` turns off the browser's default cross fade so only the circle shows.

## Do / Don't

- **Do:** define every colour as a token under `[data-theme]`, so one attribute change re-themes the whole page.
- **Do:** keep the toggle 44px and give it an `aria-label`; `aria-pressed` is set for you.
- **Do:** remember the choice per visitor (localStorage in a try/catch) on sites that keep it.
- **Don't:** run it on every page load; only on the user's own press.
- **Don't:** add a second animation on top; the circle is the whole effect.

## Use it

```html
<link rel="stylesheet" href="pattern.css">
<button class="cts-toggle" id="theme" aria-label="Dark theme">…</button>
<script type="module">
  import { CircleThemeSwitch } from './pattern.js';
  CircleThemeSwitch(document.getElementById('theme'));
</script>
```

Lives beside `dark-mode-surfaces` (what the dark theme should look like) and `ui-signals` (button press feedback).
