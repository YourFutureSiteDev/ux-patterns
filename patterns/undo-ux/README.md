# Undo UX

> Deleted. You have five seconds.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/undo-ux](https://www.designmotionhq.com/patterns/undo-ux) · [Instagram](https://www.instagram.com/reel/Dam5kJONlIN/) (143K views). Category: feedback.

## The rule

Do the action immediately and offer a time-limited undo with a visible countdown. Soft-delete behind it so nothing is really gone for thirty days. Save the heavy friction (type the name to confirm) for the genuinely irreversible.

## Key insights

- Undo beats confirmation. "Are you sure?" punishes everyone for one person's mistake; undo punishes nobody. The action happens instantly, and regret gets a second chance.
- Soft delete means the file left the screen, not the database. Set a deleted flag, keep it in trash for thirty days, then purge. Deletion is a state, not an event.
- Friction belongs only where there's no way back. For truly irreversible actions, make users earn it: GitHub requires typing the repo name before deleting it.
- One undo is a toast; a stack is a time machine. An undo stack lets Cmd+Z walk back through every step in order, the way Figma remembers everything you did.
- Delayed send turns a delay into a feature. Gmail holds your email for ten seconds after send, long enough to catch the typo, the wrong recipient, or the reply-all disaster.
- Show the countdown. A visible timer on the undo toast (a draining ring or bar) tells users exactly how long their second chance lasts.

## Do / Don't

- **Do:** Execute the action immediately, then offer a time-limited undo with a visible countdown
- **Do:** Soft-delete with a recovery window (e.g. 30 days in trash) before permanent purge
- **Do:** Reserve heavy friction like type-to-confirm for genuinely irreversible actions
- **Don't:** Block every destructive action behind an "Are you sure?" dialog
- **Don't:** Hard-delete data from the database the moment the user clicks
- **Don't:** Make the undo window so short users can't realistically react

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Deleted. You have 5 seconds. | Two file rows, a Delete click, and the "Deleted · Undo" toast with a draining ring. "Reversibility beats confirmation." |
| 2 | 1s | Undo beats confirm | CONFIRM panel: trash click opens "Delete this file?" (3 clicks · every time). UNDO panel: the row leaves and "Deleted · Undo" appears (1 click · regret optional). "Punish the 1%, or protect them." |
| 3 | 12s | Soft delete | What the user sees (two files) vs what the database sees (q3-report.pdf gets deleted_at "2026-07-03T10:42Z", later struck through). Trash lifecycle: Deleted → Trash (30 days) → Purged. |
| 4 | 19s | Type to confirm | "Delete repository" card: the button only turns red once acme/production-api is typed. Friction scale slides from Confirm to Type to confirm. "Match friction to the cost." |
| 5 | 27s | The undo stack | A Figma-style canvas with a HISTORY panel; ⌘ Z ×1, ×2, ×3 walks back Draw line, Add ellipse, Move rectangle. "Figma remembers. Your app can too." |
| 6 | 39s | Delayed send | Send starts a "Sending… 10s · Undo" bar; Undo brings the draft back, the typo "finel" is highlighted then fixed to "final". "The delay is the feature." |
| 7 | 48s | Outro | Design for regret. A live undo toast and the follow CTA. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ud">
  <div class="ud-toast" id="toast">
    <div class="ud-toast__ring"><svg viewBox="0 0 24 24"><circle class="track" cx="12" cy="12" r="9"/><circle class="fill" cx="12" cy="12" r="9"/></svg></div>
    <div class="ud-toast__label">Deleted</div>
    <button class="ud-toast__undo">Undo</button>
  </div>
</div>
<script type="module">
  import { UndoToast, SoftDelete, UndoStack, DelayedSend, TypeToConfirm } from './pattern.js';
  const files = SoftDelete(store, { trashDays: 30 });
  files.remove(42);                                   // sets deleted_at, the row stays
  UndoToast(document.getElementById('toast'), { window: 5000, onUndo: () => files.restore(42), onCommit: () => files.purge() });
</script>
```

`UndoToast` runs the countdown ring and fires `ud:undo` or `ud:commit`. `SoftDelete` keeps a `deleted_at` flag and purges after the trash window. `TypeToConfirm` enables the destructive button only when the typed value matches. `UndoStack` holds do/undo commands and binds Cmd+Z / Shift+Cmd+Z. `DelayedSend` holds an action for a grace period with a tick callback for the bar.

## Where it belongs

Delete, archive, remove, send, move: anything reversible gets undo instead of a dialog. Type-to-confirm only for the irreversible (deleting a repo, closing an account). Delayed send for anything that leaves the building.
