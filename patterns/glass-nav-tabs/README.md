# Glass Nav Tabs

> Three glass navigation bars. The pill stretches between items, turns into a clear lens while it moves, and settles solid.

Rebuilt by eye from the reel by code.xr (https://www.instagram.com/reel/DfZr3GkTD8a/, Insta batch 7 Nov 2026), because the code on screen in that reel is a stats card, not these tabs. Not one of the @designmotionhq set. Category: navigation.

## When to use it

**An optional look, never a default.** Offer it when a customer wants something glossy and premium, or picks it from a mockup (Byron, 7 Nov 2026: "a possibility when designing websites and dashboards if the customer likes it"). Byron's own dashboards stay flat, see `control-board`. Good fits: salons, homewares, real estate, hospitality, anything with strong photography behind the nav. Poor fits: dense admin screens and sites with plain backgrounds, where there is nothing for the glass to show.

## The rule

The motion is the point, and the bar must stay readable without it. Text contrast is checked over the lightest and darkest part of what sits behind the bar, and the nav works with no blur, no motion and no mouse.

## The three skins

- **Smoke** (`.gn-smoke`): dark see-through bar, white glowing pill. For dark photos.
- **Frost** (`.gn-frost`): pale bar, black pill. For mid tone photos.
- **Dock** (`.gn-dock`): cream bar, icons only, the active item opens its label. Add `.gn-solo` for a round cart or action button with a badge. Best for phones, and for a bar with five items.

## Key insights

- **The stretch comes from two speeds.** The leading edge runs in 0.2s and the trailing edge in 0.36s, so the pill reaches ahead and catches up with no keyframes.
- **Moving and resting are different objects.** In flight it is a clear lens that lifts the colour behind it. At rest it is a solid button. That change is what reads as liquid.
- **Icons with one label fit five items on a phone.** Under 560px every skin behaves like the dock.

## Do / Don't

- **Do:** put a real photo or strong colour behind it.
- **Do:** retheme through the `--gn-*` tokens to the site's palette; the warm cream here is the reel's.
- **Do:** keep it to one bar per page. The demo shows three so they can be compared.
- **Don't:** use it on a flat background, or stack glass on glass.
- **Don't:** rely on the icon alone for an unfamiliar item; give the item an `aria-label` or keep its label.
- **Don't:** ship it without checking contrast on the real photo.

## States covered

Rest, hover on touch (none needed, tap moves it), keyboard focus ring, arrow keys, Home and End, reduced motion (no stretch or lens), reduced transparency and no `backdrop-filter` support (solid fill), phone width (labels collapse), resize (pill snaps back into place).

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<nav class="gn-bar gn-smoke" id="nav" aria-label="Main">
  <a class="gn-item" href="/" aria-current="page"><svg class="gn-ico">…</svg><span class="gn-label">Home</span></a>
  <a class="gn-item" href="/work"><svg class="gn-ico">…</svg><span class="gn-label">Work</span></a>
</nav>
<script type="module">
  import { GlassNav } from './pattern.js';
  GlassNav(document.getElementById('nav'), { onChange: ({ item, index }) => {} });
</script>
```

`GlassNav` adds the pill itself and returns `{ go(n), index }`. Works with links or buttons. On a multi page site set `aria-current` on the current page's link and the pill starts there. Serve it over http: browsers refuse module scripts from a file path.
