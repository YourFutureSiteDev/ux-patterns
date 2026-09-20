# Bulk Actions

> Bulk actions are a system, not a lone checkbox.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/bulk-actions](https://www.designmotionhq.com/patterns/bulk-actions) · [Instagram](https://www.instagram.com/reel/Db0M74jtjQS/) (141K views). Category: interaction.

## The rule

Selection is application state, not the DOM. The header box has three states and partial resolves to select-all; the affordance names the true count; shift-click picks a range and the ids survive paging; destructive bulk actions run at once and offer a ten second undo instead of a confirm modal.

## Key insights

- The header checkbox needs three states: empty, partial, and checked. The indeterminate dash is not optional, and partial always resolves to select-all, never to clear.
- Name the number. When select-all only grabs the rows on screen, offer "Select all 247 matching" instead of a bare "all" that hides the true scope.
- Keep the count honest as context shifts. Change a filter and the label should re-read live (from 247 matching down to 96) so people act on the real set.
- Selection is state, not the DOM. Shift-click picks a range, and the selected ids survive paging because they live in application state, not in the visible rows.
- For destructive bulk actions, skip the confirm modal. Echo the count, run the action immediately, and offer a 10 second undo with a draining countdown ring.

## Do / Don't

- **Do:** Give the header checkbox all three states and let the partial dash resolve to select-all.
- **Do:** Spell out the exact count in the affordance, like "Select all 247 matching".
- **Do:** Swap destructive confirm dialogs for an undo window that echoes what you deleted.
- **Don't:** Ship a two-state header checkbox that skips the indeterminate dash.
- **Don't:** Label bulk selection with a vague "all" that hides how many rows you touched.
- **Don't:** Store the selection in the DOM, where it silently resets the moment someone changes page.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Team members | Header box clicked, all six rows check, bulk bar slides in: "247 selected · Export · Archive · Delete 247". |
| 2 | 3s | Tri-state | empty / partial / checked tiles; 2 of 5 selected → header shows the dash. "partial is a state, not a bug" |
| 3 | 12s | Tri-state (click) | Click partial → select all; every row checked. |
| 4 | 15s | Select all | Six on screen, 247 in the table. "6 selected · Select all 247 matching", filter chips, matching = 247. |
| 5 | 19.5s | Select all (matching) | Bar turns teal: "247 selected · Clear selection". |
| 6 | 24s | Select all (filtered) | Plan: Pro filter dims four rows; count re-reads to 96, matching = 96. |
| 7 | 27s | Range + persist | Shift + click the last row picks rows 2–5; selectedIds chips fill in; page 1. |
| 8 | 33s | Range + persist (page 2) | Different rows, header still partial, the four ids survive the page change. |
| 9 | 37.5s | Bulk destructive | Delete 247 in the bar; ghost "Are you sure?" dialog struck through: "friction without recovery". |
| 10 | 40.5s | Bulk destructive (undo) | Empty state "No members left in this view"; toast "247 members deleted · recoverable for ten seconds" with a draining ring and Undo. |
| 11 | 48s | Outro | Selection is a system: Three states, Name the number, Selection is state, Undo, not confirm. Follow / Save this. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ba">
  <div class="ba-table" id="table">
    <div class="ba-thead"><button class="ba-check" aria-label="Select all">…</button>…</div>
    <div class="ba-rows"></div>
  </div>
</div>
<script type="module">
  import { SelectionModel, renderRows, bindTable, bulkDelete, UndoCountdown } from './pattern.js';
  const members = await (await fetch('/api/members?page=1')).json();
  const model = SelectionModel(members.map(m => m.id));
  renderRows(document.querySelector('.ba-rows'), members);
  bindTable(document.getElementById('table'), model, members);   // row click toggles, shift-click ranges, header resolves tri-state
  model.setMatching(247);                                        // the true count behind "Select all 247 matching"
  deleteBtn.onclick = () => { const job = bulkDelete(model, { run: ids => api.delete(ids), undo: ids => api.restore(ids) }); UndoCountdown(ringNumber, 10, 0, false, () => toast.remove()); undoBtn.onclick = job.undo; };
</script>
```

`SelectionModel` keeps the ids in a Set: `toggle(id, shiftKey)`, `headerClick(visibleIds)`, `selectAllMatching()`, `setPage(ids)`, `state()` → `none | some | all`. `renderRows` and `bindTable` paint it. `bulkDelete` runs the action now and returns `undo()` valid for ten seconds; `UndoCountdown` drives the number in the ring (the ring itself is the `ba-drain` CSS animation).

## Where it belongs

Any table or list with a header checkbox: members, invoices, files, messages. Reversible bulk actions (archive, tag, move, delete-with-undo). Never a two-state header box, never a bare "all", never a confirm modal in place of an undo.
