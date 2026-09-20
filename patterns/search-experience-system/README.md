# Search Experience System

> Search is a system. Five parts. Most apps skip them.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/search-experience-system](https://www.designmotionhq.com/patterns/search-experience-system) · [Instagram](https://www.instagram.com/reel/DYZfCfKhOId/) (16.9K views). Category: interaction.

## The rule

A search bar is five parts, not one field: a placeholder that onboards, recent searches on focus, autocomplete ranked by clicks with a category badge, keyboard navigation with a visible focus ring, and a zero-results screen that offers a way out.

## Key insights

- **Placeholder copy is your first onboarding.** "Search" tells the user nothing; "Search by name, SKU, or brand" tells them everything they can look for.
- An empty field isn't empty. Load **recent searches** the moment the user focuses the bar so a single tap refills it and friction drops to zero.
- Rank autocomplete by **clicks, not alphabet**, and tag each suggestion with a category badge. Three sharp results beat ten noisy ones.
- Make the whole flow **keyboard-driven**: arrow keys move through results, Enter selects, Escape closes.
- Keep the **focus ring visible** at every step. Invisible focus quietly breaks both keyboard navigation and accessibility.
- Zero results should never be a dead end. Offer popular searches, category jumps, or alternate spellings so users recover at the exact moment they'd otherwise bounce.

## Do / Don't

- **Do:** write descriptive placeholder text that hints at what's actually searchable.
- **Do:** surface recent searches on focus so returning users refill the bar in one tap.
- **Do:** turn zero-result screens into recovery paths with suggestions and category jumps.
- **Don't:** ship a bare "Search" as your only placeholder.
- **Don't:** sort autocomplete alphabetically instead of by popularity.
- **Don't:** leave a "No matches" screen as a dead end.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | A focused bar with "s" typed, pink glow. |
| 2 | 1.5s | Hook | "Search is a system." 5 parts · most apps skip them. |
| 3 | 3s | 01 Placeholder | Lazy: "Search" struck through. |
| 4 | 6s | 01 Placeholder | Better: "Search by name, SKU, or brand". What · How · Scope, more examples. |
| 5 | 9s | 02 Recent | Recent searches on focus, Nike Air Max hovered. 2.4s vs 0.3s, 8x friction drop. |
| 6 | 16.5s | 03 Autocomplete | "sho": Shoes, Shop New, Shorts ranked #1 to #3, click rate 67 / 18 / 9%. |
| 7 | 24s | 04 Keyboard | Focus on Shop New, arrow / enter / esc keys, 2px focus ring, no mouse trap, WCAG 2.4.7. |
| 8 | 30s | 05 Zero results | "xqzz": dead end vs recovery (Try: shoes, Browse: Footwear, Recent: Nike Air Max). 4% vs 23%, 5.8x lift. |
| 9 | 39s | Recap | Placeholder, Recent, Autocomplete, Keyboard cards landing. |
| 10 | 42s | Outro | All five cards, "Save for your next search bar." |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="sx"><div id="search"></div></div>
<script type="module">
  import { SearchSystem } from './pattern.js';
  SearchSystem(document.getElementById('search'), {
    placeholder: 'Search by name, SKU, or brand',
    recent: ['Nike Air Max', 'White sneakers'],
    items: [{ label: 'Shoes', badge: 'Apparel', tone: 'pink', clicks: 67 }, /* ... */]
  });
</script>
```

`SearchSystem` builds the bar and drives all five parts: recent chips on focus, suggestions filtered and sorted by `clicks` as you type (three at most, each with its badge), ArrowUp/ArrowDown/Enter/Escape, a focus ring on the bar, and the dead end + recovery panel when nothing matches. It fires `sx:select` with the chosen value. `barHTML`, `recentHTML`, `suggestHTML` and `zeroHTML` render each state on their own for stills.

## Where it belongs

Any product search: catalogues, admin tools, docs, command palettes. Not for a single-purpose filter field where there is nothing to suggest.
