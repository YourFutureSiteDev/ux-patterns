# Pagination

> Add one row and your pagination breaks.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/pagination](https://www.designmotionhq.com/patterns/pagination) · [Instagram](https://www.instagram.com/reel/DZxM_QoNZ0n/) (130K views). Category: navigation.

## The rule

Paginate by cursor when rows change, truncate the pager to first, last, current and neighbours, keep the page in the URL, and restore scroll when the user comes back from a detail view.

## Key insights

- Offset pagination drifts when the data changes: insert a row at the top and every page shifts down, so the same item can surface twice (or get skipped entirely).
- Cursor pagination stays stable: it anchors to a specific row instead of a numeric position, so inserts and deletes never create duplicates.
- Three patterns fit different jobs: numbered for jumping to any page, load-more for on-demand appends, infinite scroll for continuous feeds.
- Never render every page link. Truncate to first, last, current, and its immediate neighbours, using an ellipsis for the gaps.
- Keep the page number in the URL (`?page=500`) so a refresh stays put and the view becomes a shareable link.
- When users return from a detail view, restore their scroll position instead of dumping them back at the top of the list.

## Do / Don't

- **Do:** reach for cursor pagination when rows are inserted or deleted often, to avoid duplicates and skips.
- **Do:** persist the current page in the URL so refreshes and shared links land on the same page.
- **Do:** collapse long page ranges to first, last, current, and neighbours with an ellipsis.
- **Don't:** render hundreds of numbered links; they spill off-screen and overwhelm.
- **Don't:** reset an infinite-scroll list to the top when the user comes back from a detail view.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 10,000 rows | Count-up to 10,000 rows, "Go to page 500", six-row user table, truncated pager on 500. "One jump to page 500." |
| 2 | 4s | Offset pagination | OFFSET 10 LIMIT 10 · page 2. A new row inserted at top pushes every row down: offset shifts every page → duplicates. |
| 3 | 10.5s | Offset vs cursor (before) | Two five-row lists, OFFSET 500 LIMIT 10 vs WHERE id < :lastId, ?after=cursor_abc123. |
| 4 | 10.5s | Offset vs cursor (after) | Insert a row at the top: offset shows #10 Romy Cole tagged DUP and shifts; cursor keeps #11 Zoe Quinn STABLE. "Paginate by ID — the list stays stable." |
| 5 | 18s | Three patterns | Numbered (jump to any page), Load more (user stays in control), Infinite scroll (best for feeds). |
| 6 | 27s | Don't render 500 links | A 22-column grid of 504 page cells "…spilling off-screen". |
| 7 | 30s | Truncate | 1 · … · 499 500 501 · … · 833 with FIRST and LAST outlined. first · gap · current pages · gap · last. Show ~7 cells. |
| 8 | 36s | Back from a detail page | Scroll = 0 loses your place (pink); Restore scroll lands on Leo Hart's row (teal). |
| 9 | 42s | State lives in the URL | app.com/users?page=500 keeps page 500 on refresh; no URL state resets to page 1. "Page 500 becomes a link you can share." |
| 10 | 51s | Outro | Faded table, Follow for more UI systems, Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="pg">
  <nav class="pg-pager" id="pager"></nav>
  <div id="feed"></div>
</div>
<script type="module">
  import { Pager, pageCells, cursorPage, InfiniteScroll, ScrollMemory, readPageFromUrl } from './pattern.js';
  Pager(document.getElementById('pager'), { total: 833, current: readPageFromUrl(), url: true, onChange: p => load(p) });
  pageCells(500, 833); // [1, '…', 499, 500, 501, '…', 833]
  InfiniteScroll(document.getElementById('feed'), { fetch: after => api.rows({ after, limit: 10 }), render: rowEl });
  ScrollMemory.save('users', listEl);    // before navigating to the detail page
  ScrollMemory.restore('users', listEl); // when the list mounts again
</script>
```

`Pager` renders the truncated cells, moves on click and mirrors the page into `?page=` when `url: true`. `pageCells` is the truncation rule on its own. `offsetPage` / `cursorPage` / `findDuplicates` show why offset drifts and cursor does not. `LoadMore` appends a batch on click; `InfiniteScroll` fetches when a sentinel scrolls into view. `ScrollMemory` saves and restores `scrollTop` across the detail round trip.

## Where it belongs

Any list longer than a screen: admin tables, search results, activity feeds. Numbered for tables people jump around in, load-more for lists they browse, infinite scroll for feeds, cursors whenever rows come and go.
