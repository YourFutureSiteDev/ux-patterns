# Destructive Actions

> Dangerous actions are a design language, not just a red button.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/destructive-actions](https://www.designmotionhq.com/patterns/destructive-actions) · [Instagram](https://www.instagram.com/reel/Da4-EmYNYAP/) (736K views). Category: interaction.

## The rule

Make the gesture, the label, the placement, the colour, the geography and the clock all do warning work. A hold replaces the dialog, the verb replaces "Yes", delete moves off the primary spot, red is spent on destruction only, the danger zone sits bordered and last, and an irreversible delete gets a cancelable cooldown.

## Key insights

- Hold-to-confirm turns the gesture into the safeguard: a ring fills over roughly 300ms of a held press, replacing a modal, and releasing early cancels the action entirely.
- Name the action on the button itself. Delete project / Keep project beats a generic Yes / No, because the verb is the warning and nobody reads "Are you sure?".
- Never place a destructive button where confirm usually lives. Muscle memory clicks primary spots blind, so moving delete elsewhere keeps autopilot from reaching it.
- Red is a budget: spend it on destruction only. A red logout button cries wolf, and then the real delete looks routine.
- Bury deletion in a bordered, labeled danger zone at the bottom of the page. Geography itself becomes friction that slows the hand.
- Give irreversible deletions a cooldown: schedule it with a grace period (for example 14 days to cancel). Time is the last line of defense.

## Do / Don't

- **Do:** name the destructive action on the button so the verb itself does the warning.
- **Do:** reserve red for destructive actions only, and add friction like a hold gesture or a danger zone.
- **Do:** give irreversible deletions a cancelable cooldown before they take effect.
- **Don't:** place destructive buttons where the confirm button usually sits.
- **Don't:** rely on a generic "Are you sure?" dialog that nobody actually reads.
- **Don't:** spread red across logout, badges, and alerts until delete looks routine.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hold to delete. | brand-refresh.fig row and a hold-to-delete row, ring at 25%, "HOLDING · 25%". |
| 1b | 1.5s | Hold to delete. | Released early: "Kept" badge, 0%, "NOTHING DELETED". |
| 2 | 3s | Pattern 01 · Hold | "Are you sure?" dialog struck through; ring fills 0 to 295 ms; commitment window 0 to 300 ms. |
| 3 | 9s | Pattern 02 · Labels | Generic dialog: No / Yes. "Yes" clicked blind. |
| 3b | 13.5s | Pattern 02 · Labels | Named dialog: Keep project / Delete project. "Delete project" read first. |
| 4 | 18s | Pattern 03 · Placement | Delete in primary spot vs delete moved away; cursors ride the same path; blind click deletes, same click saves. |
| 5 | 27s | Pattern 04 · The red budget | Settings card with 6 red elements. |
| 5b | 30s | Pattern 04 · The red budget | Same card with red spent only on Delete: 1 red element. |
| 6 | 33s | Pattern 05 · Danger zone | acme/design-kit settings, top of page. |
| 6b | 36s | Pattern 05 · Danger zone | Scrolled to the bordered Danger Zone at the bottom, scrollbar turns red. |
| 7 | 42s | Pattern 06 · Cooldown | Account scheduled for deletion, 14 days counting down (6 left). |
| 7b | 45s | Pattern 06 · Cooldown | Cancelled: 14 days restored, badge flips to CANCELLED. |
| 8 | 48s | Outro | Danger is a design language. Six summary cards, follow CTA. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="da">
  <button class="da-hold__btn" id="hold" aria-label="Hold to delete">
    <svg class="ring" viewBox="0 0 72 72"><circle class="track" cx="36" cy="36" r="34"/><circle class="fill" cx="36" cy="36" r="34"/></svg>
    <span class="core">…trash icon…</span>
  </button>
</div>
<script type="module">
  import { HoldToConfirm, ConfirmDialog, Cooldown } from './pattern.js';
  HoldToConfirm(document.getElementById('hold'), { duration: 300, onConfirm: () => deleteFile() });
  // or a verb-labelled dialog:
  const ok = await ConfirmDialog({ title: 'Delete this project?', body: 'This permanently removes Q3 Campaign and its 84 assets.', confirm: 'Delete project', cancel: 'Keep project' });
</script>
```

`HoldToConfirm` drives `--p` (0..1) on the button while the pointer is held and fires `da:confirm` only when the hold completes; an early release fires `da:cancel` and resets. `ConfirmDialog` returns a promise that resolves true only from the verb button. `Cooldown(cardEl, { days })` renders the grace-period grid, `set(days)` updates it, `cancel()` restores it. `redBudget(root)` counts red elements so a page can prove it spent red on destruction only.

## Where it belongs

Delete, remove, revoke, transfer ownership, close account. Not on logout, dismiss, or anything reversible; those get no red and no friction.
