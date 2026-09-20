# Dropdown Design

> Your dropdown is broken. Five rules separate cheap from premium.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/dropdown-design](https://www.designmotionhq.com/patterns/dropdown-design) · [Instagram](https://www.instagram.com/reel/DXd50_jNsAf/) (49.5K views). Category: interaction.

## The rule

A dropdown earns "premium" by doing five things: a trigger that is obviously clickable (48px, caret, hover state), a menu that flips upward when it would clip, full keyboard control (arrows, Enter, Esc), a search field once the list passes ten items, and an open animation of about 150ms.

## Key insights

- Make the trigger obviously clickable: a 48px touch target, a visible caret icon, and a real hover state, not a 30px box with a faint border.
- Flip on edge: when there isn't enough room below the trigger, open the menu upward so it never clips off-screen.
- Keyboard support isn't optional: arrow keys move the highlight, Enter selects the item, and Esc closes the menu.
- Once a list passes ~10 items, add a search field so users filter instead of scroll-hunting.
- Animate the open in around 150ms. 50ms feels instant and cheap, 500ms drags and feels sluggish.

## Do / Don't

- **Do:** give the trigger a 48px touch target, a clear caret, and a visible hover state.
- **Do:** open the menu upward when space below the trigger runs out.
- **Do:** wire up arrow keys, Enter, and Esc for full keyboard control.
- **Don't:** ship a 30px, low-contrast trigger with no hover feedback.
- **Don't:** let a long menu clip off the bottom of the viewport.
- **Don't:** animate slower than ~150ms, or with no transition at all.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Your dropdown is broken. | The premium Account menu open, Settings highlighted, PREMIUM tag. |
| 2 | 1.5s | Rule 1: Make it clickable. | Before: 30px "Select option" with three red faults. After: 48px Account trigger with three green ticks. |
| 3 | 12s | Rule 2: Flip on edge. | Browser window, trigger at the bottom, menu opening downward and clipping ("✗ CLIPPED"). |
| 4 | 15s | Rule 2: flipped | Same window, menu opens upward with a teal border, Option C highlighted. "Detect edge. Flip the menu up." |
| 5 | 18s | Rule 3: Keyboard always. | Account menu with Dashboard highlighted; ↓ / Enter / Esc key legend. |
| 6 | 21s | Rule 3: arrow pressed | ↓ key lit pink, highlight moved to Settings. |
| 7 | 24s | Rule 3: caption | "Every user. Every time." |
| 8 | 27s | Rule 4: 10+ items = search. | Search countries… with a nine-country list. |
| 9 | 30s | Rule 4: filtered | "Fra" typed, count badge 1, France the only row. "Filter beats scroll. Always." |
| 10 | 34.5s | Rule 5: Hit 150ms. | 50ms / 150ms / 500ms lanes; the 500ms menu open, "Too fast / Just right / Too slow". |
| 11 | 39s | Rule 5: loop | 50ms and 150ms menus open. "Fast to feel instant. Smooth to feel real." |

The outro ("Dropdowns, done right." + Follow) is a pure CTA with no component and is not built.

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="dd">
  <div class="dd-menu" id="menu">
    <button class="dd-trigger">Account<svg class="dd-caret">…chevron…</svg></button>
    <div class="dd-list">
      <div class="dd-item">Profile</div><div class="dd-item">Settings</div><div class="dd-item">Sign out</div>
    </div>
  </div>
</div>
<script type="module">
  import { Dropdown, SearchDropdown } from './pattern.js';
  Dropdown(document.getElementById('menu'), { speed: 150, onSelect: v => console.log(v) });
</script>
```

`Dropdown(root, { speed, onSelect })` toggles `.is-open`, adds `.is-up` when the list would clip its container (Rule 2), handles ArrowUp/ArrowDown/Enter/Esc (Rule 3), and fires `dd:open`, `dd:close`, `dd:select`. `--dd-speed` on the root drives the open transition (Rule 5). `SearchDropdown(root, { items })` turns a `.dd-search` block into a live filter with a hit count (Rule 4). `TimingRace(root)` loops the three demo lanes.

## Where it belongs

Any select, account menu, filter or picker with more than two options. Add the search field past ten items; use a native `<select>` when there is nothing to gain from a custom one.
