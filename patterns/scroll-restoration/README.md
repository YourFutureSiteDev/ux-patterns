# Scroll Restoration

> Scroll is state. Restore it, offset it, and never bury the footer.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DcLaVaGNfoy/) (37.1K views, Instagram-only; no designmotionhq.com page). Category: navigation. Caption: "Restore scroll position after opening a details page."

## The rule

Treat scroll position as state. Save `scrollY` per history entry when the user leaves a list, put it back when they return, subtract the sticky header so the row is not hidden, give every anchor `scroll-margin-top`, and keep infinite feeds from burying the footer.

## Key insights

- A full page load lets the browser restore scroll; a client-side route change resets `scrollTop` to 0 and dumps the user at the top of the feed.
- Set `history.scrollRestoration = 'manual'`, save `scrollY` on leave and `scrollTo(saved)` on return, so the user lands back on the exact post (1840 → restored).
- A sticky header hides the restored row: `scrollTo(y)` must become `scrollTo(y - 88)` (the header height) so the header clears the row.
- Jump links land wrong under a sticky bar; `:target { scroll-margin-top: 96px }` makes the anchor land right.
- Infinite scroll makes the footer run away forever ("5,853px away"); cap auto-loading so About, Contact and Terms stay reachable.
- The whole set is one rule: scroll is state, and state is something you save, restore and offset deliberately.

## Do / Don't

- **Do:** save the scroll position per history entry and restore it when the user comes back from a detail page.
- **Do:** subtract the sticky header height from any restored or programmatic scroll target.
- **Do:** give anchors `scroll-margin-top` equal to the header so `#pricing` lands with its heading visible.
- **Don't:** let a client-side route reset the list to zero; a route is not a reset.
- **Don't:** restore to a `y` that puts the row under the header.
- **Don't:** run infinite scroll without a stop; a buried footer is an unreachable footer.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Article "When to break your own rules", Feed back button, SCROLL POSITION meter counting to 1840px. |
| 2 | 3s | Route change | /feed jumps from scrollTop 2080 to 0. Full page load → browser restores; client-side route → scrollTop = 0. "Route change dumps you at zero." |
| 3 | 12s | Restore | Without restore (your post, 8 rows down) vs With restore (lands on the post). history.scrollRestoration = 'manual', ON LEAVE save(key, scrollY), ON RETURN scrollTo(saved). |
| 4 | 21s | Sticky header hides your row | The restored row sits under the 88px header. scrollTo(y) → scrollTo(y - 88). |
| 5 | 25.5s | Sticky header clears your row | Same feed offset by 88px, row fully visible. "Offset by the header height." |
| 6 | 30s | Jump links land wrong | Docs, #pricing tapped, the Pricing heading is under the bar. :target { scroll-margin-top: ___ } |
| 7 | 31.5s | Jump links land right | # Pricing visible under the bar. :target { scroll-margin-top: 96px; } |
| 8 | 36s | Infinite scroll | 4,053px, 48 loaded, loading more…; Footer · never reached, 5,853px away. "Infinite scroll buries the footer." |
| 9 | 45s | Outro | Scroll is state. Five-point checklist, designmotionhq.com, Full breakdown · Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<script type="module">
  import { ScrollRestoration, attachToHistory, anchorOffset, InfiniteFeed } from './pattern.js';
  const mem = ScrollRestoration({ header: 88 });   // sets history.scrollRestoration = 'manual'
  attachToHistory(mem, { router });                 // leave() before navigate, restore() after render
  link.addEventListener('click', () => mem.leave('/feed'));   // ON LEAVE: save(key, scrollY)
  onReturnToFeed(() => mem.restore('/feed'));                // ON RETURN: scrollTo(saved - 88)
  anchorOffset(96);                                 // [id]:target { scroll-margin-top: 96px }
  InfiniteFeed(listEl, { fetch: page => api.posts(page), render: cardEl, max: 3 }); // then a Load more button
</script>
```

`ScrollRestoration` returns `leave`, `restore`, `reveal` and `clear`; `restore` subtracts the header so the row clears the sticky bar. `attachToHistory` wires `pagehide` and `popstate`. `anchorOffset` injects the `scroll-margin-top` rule. `InfiniteFeed` auto-loads a few batches and then hands over to a button so the footer stays reachable.

## Where it belongs

Feeds, search results, inboxes and any list that opens a detail page: apps with client-side routing, sticky headers, in-page anchors, and infinite feeds that still have a footer worth reaching.
