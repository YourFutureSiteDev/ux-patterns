# Autosave

> Saved. It wasn't. Your wifi died mid-word.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/autosave-ux](https://www.designmotionhq.com/patterns/autosave-ux) · [Instagram](https://www.instagram.com/reel/DbQJvWxty4v/) (30.9K views). Category: forms.

## The rule

Autosave is a system, not a feature: debounce the write, drive the status pill from an explicit state machine, queue edits locally while offline and drain them oldest first, merge or warn on concurrent edits, and let the browser ask before a dirty tab closes.

## Key insights

- Never write on every keystroke. Start a debounce timer when typing pauses, reset it on each key, and commit one clean write after roughly 800ms of silence.
- Model the status indicator as a state machine with clear states: typing, saving, saved, offline, error. Users trust the pill more than the feature itself, so never let it read "Saved" when the write never landed.
- When the connection drops, push every edit into a local queue and surface a badge counting what is pending. On reconnect, drain the queue in order, oldest first.
- Two tabs on one document means last write wins can silently erase an hour of someone's work. Merge concurrent changes or warn the user, but never overwrite in silence.
- Guard the exit. If unsaved work exists, use the browser's beforeunload prompt to intercept the closing tab. One ugly dialog beats an afternoon retyped.

## Do / Don't

- **Do:** debounce writes so one clean save fires after a pause (around 800ms), not on every keystroke.
- **Do:** queue edits locally while offline and replay them oldest first once the connection returns.
- **Do:** keep the status honest by mapping it to explicit states and updating it in real time.
- **Don't:** let the pill show "Saved" when the change never reached the server.
- **Don't:** overwrite a concurrent edit silently; merge the changes or warn instead.
- **Don't:** let a tab close on unsaved work without a confirmation dialog.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1a | 0s | "Saved." | Teal Saved pill, wifi on, doc window editing, "Last sync 12:04 · up to date". |
| 1b | 1.5s | It wasn't. | Amber "3 changes pending", wifi off, "3 edits never left this tab". |
| 2a | 3s | Debounce | Keys a g e, debounce window 150 / 800 ms, writes: 0, server waiting for silence. |
| 2b | 9s | Debounce (fired) | Six keys, 800 / 800 ms, writes: 1, "6 keystrokes → 1 write", PATCH /docs/offsite · 200 OK. |
| 3a | 13.5s | Status: Typing… | Five-node state machine, Typing lit. |
| 3b | 15s | Status: Saving… | Saving node lit, spinner in the pill. |
| 3c | 18s | Status: Offline | Offline node and pill in amber. |
| 4a | 21s | Offline queue | Local queue of 3 with timestamps, server waiting for connection. |
| 4b | 27s | Back online | Queue draining oldest first, "Synced 1/4". |
| 5a | 30s | Conflicts | Tab A saved, Tab B editing, server shows Last write wins. |
| 5b | 33s | Last write wins | "Paragraph A silently erased — an hour of work". |
| 5c | 36s | Merge | Both paragraphs kept, Merge tag in teal. |
| 6 | 39s | Navigation guard | Browser "Leave site?" dialog, 2 unsaved changes, beforeunload snippet. |
| 7 | 45s | Outro | Autosave is a system. Debounce · States · Queue · Merge · Guard. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="as">
  <span class="as-pill as-pill--saved" id="pill"><span data-label>Saved</span></span>
  <textarea id="doc"></textarea>
</div>
<script type="module">
  import { Autosave, NavigationGuard } from './pattern.js';
  const auto = Autosave({
    pill: document.getElementById('pill'),
    save: edit => fetch('/api/doc', { method: 'PATCH', body: JSON.stringify(edit) }).then(r => { if (!r.ok) throw r; })
  });
  document.getElementById('doc').addEventListener('input', e => auto.edit({ text: e.target.value }));
  NavigationGuard(() => auto.dirty);
</script>
```

`Debounce({ wait, onTick, onFire })` is the timer on its own. `SaveStatus(pill)` is the state machine (`to('saving')` throws on an illegal transition). `Autosave` wires debounce, queue and status together and emits `as:state` and `as:queue`. `detectConflict(base, mine, theirs)` and `merge()` handle the two-tab case. `NavigationGuard(isDirty)` installs the beforeunload prompt.

## Where it belongs

Editors, notes, long forms, settings pages that save as you go. Anywhere a user could lose typed work if the pill lied.
