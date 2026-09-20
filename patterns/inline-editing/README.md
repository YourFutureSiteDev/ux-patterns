# Inline Editing

> Click the title. It's an input now, and nothing moved.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/inline-editing](https://www.designmotionhq.com/patterns/inline-editing) · [Instagram](https://www.instagram.com/reel/DbIaxSzNg97/) (45.8K views). Category: interaction.

## The rule

Editable text swaps into an input in the exact same box (same font, size and padding, only the border changes), whispers its affordance on hover, commits on Enter, cancels on Escape, follows one blur rule everywhere, and saves optimistically with a rollback that keeps the draft.

## Key insights

- Editable text has to whisper its affordance: a pencil on hover, a soft background tint. With no signal, people file support tickets just to rename a title.
- Keep every pixel in place during the swap. Same font, same size, same padding, with the border going from transparent to accent. One jump and the illusion collapses.
- Enter commits, Escape cancels, and everyone agrees on that. Blur is the contested one: some apps save on click-away, others discard. Pick one rule and never break it.
- Save optimistically: the text updates on screen while the request is still in flight. If the server fails, roll back, keep the draft, and say why.
- Match the editing mode to the cost of a typo. Make every cell editable when mistakes are cheap, or require an explicit Edit action when they are expensive.

## Do / Don't

- **Do:** signal editability on hover with a pencil icon or a soft background tint.
- **Do:** update the UI immediately, then roll back and keep the draft if the save fails.
- **Do:** keep font, size and padding identical between the text and the input.
- **Don't:** leave editable text with zero affordance, so users cannot tell it is editable.
- **Don't:** change what blur does from one screen to the next (save here, discard there).

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Click the title. | Doc header with the title already an input, "0 px moved", CLS meter reading 0.000. "Nothing moved." |
| 2 | 3s | Affordance | Signal card (hover tint, pencil, "Click to edit") vs No signal card that spawns ticket #4821 "How do I rename a doc?" |
| 3 | 12s | Zero layout shift (h1) | The swap, measured: font-size 46 = 46, padding 10 = 10, border transparent to teal. The bad swap below. |
| 4 | 16.5s | Zero layout shift (input) | Same card as `<input />`; the bad swap shows "+3 px" and its meta line moves. |
| 5 | 21s | Keyboard semantics | Doc app typing "Q4 Launch Plan", spreadsheet typing 51,300. Enter commits, Esc cancels. |
| 6 | 25.5s | Keyboard semantics (blur) | Doc app "Saved on blur"; spreadsheet reverts to 48,200, "Discarded on blur". |
| 7 | 30s | Optimistic save | Title already "Q4 Launch Plan", chip "Updated on screen", PATCH /docs/42 in flight. |
| 8 | 34.5s | Optimistic save (500) | Server 500: title rolled back to Q3, "Couldn't save — draft kept" toast with the draft. |
| 9 | 39s | Edit modes | Every cell editable grid vs explicit Edit button. "1 click = 1 write" / "Edit is a decision". |
| 10 | 43.5s | Edit modes (typo) | ACM-104 flipped Pending to Paid by accident. "Accidental edit". |
| 11 | 48s | Outro | Inline editing is a system. Working inline editor plus Affordance / Zero shift / Enter · Esc / Optimistic chips. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ie">
  <h1 id="title">Q3 Launch Plan</h1>
</div>
<script type="module">
  import { InlineEdit } from './pattern.js';
  const ed = InlineEdit(document.getElementById('title'), {
    onBlur: 'commit',                     // or 'cancel' — pick one and keep it everywhere
    save: text => fetch('/api/docs/42', { method: 'PATCH', body: JSON.stringify({ title: text }) }).then(r => { if (!r.ok) throw r; })
  });
  document.getElementById('title').addEventListener('ie:rollback', e => toast(`Couldn't save — draft kept: ${e.detail.draft}`));
</script>
```

`InlineEdit` swaps the element for an input with the same computed font and box, commits on Enter, cancels on Escape, applies the blur rule, updates the text before the request resolves and rolls back (keeping `draft`) on rejection. Events: `ie:commit`, `ie:saved`, `ie:rollback`, `ie:cancel`. `CellEdit` does the same for a grid cell with its own blur rule; `LayoutShiftMeter` reports any movement of the box during the swap.

## Where it belongs

Titles, names, labels, cheap spreadsheet cells. Behind an explicit Edit action when a typo costs money: invoices, statuses, anything that ships the moment it is written.
