# Empty States

> Your empty state is your first impression. Most apps waste it.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/empty-states](https://www.designmotionhq.com/patterns/empty-states) · [Instagram](https://www.instagram.com/reel/DXMgbFOsjFu/) (85.9K views). Category: content.

## The rule

An empty screen is a designed screen: one icon so it reads as intentional, a human line in the brand's voice, one primary action that is the real next step, copy tuned to why it is empty (first run, no results, error, filtered), and a ghost preview that teaches the feature before the first item exists.

## Key insights

- A blank screen reads as broken; users can't tell "nothing here yet" apart from a real failure. One small illustration or icon signals the empty state is intentional.
- Write like a product, not a log file. Swap corporate error copy ("No items found. Result set empty.") for a warm, human line that matches your brand voice.
- Every empty state needs a primary action, not a "Try refreshing" button but the next step the user would take if they knew what to do (e.g. "+ New project").
- There are four kinds of empty: first run, no results, error, and filtered-out. Each deserves its own copy and CTA; don't ship one generic screen for all of them.
- The empty state is your best onboarding moment. Show a ghost preview of what a real item will look like to teach the feature before users ever touch it.

## Do / Don't

- **Do:** add a small illustration or icon so the screen reads as intentional, not broken.
- **Do:** give every empty state one clear primary CTA that points to the next real step.
- **Do:** tailor the copy and action to the context: first run, no results, error, or filtered-out.
- **Don't:** leave a bare "No data" or blank body with no visual or guidance.
- **Don't:** rely on a generic "Try refreshing" as the only available action.
- **Don't:** write cold, log-file copy like "ERROR 404 — Result set empty."

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Dead vs Alive | "No data / error: empty result" beside "Nothing here yet" with an icon and "+ New project". |
| 2 | 1.5s | Alive, zoomed | The alive card up close. |
| 3 | 3s | 01 Illustration > Void | My Projects window with a near-invisible "No items". |
| 4 | 4.5s | 01 Illustration | A single glowing cube icon. "Add a single icon →" |
| 5 | 6s | 01 Illustration | Icon, "Nothing here yet", "Your projects will appear here once you create one." |
| 6 | 9s | 02 Tone = Brand voice | Corporate (ERROR 404, status: failed) vs Human ("Looks quiet in here"). |
| 7 | 15s | 03 Primary CTA mandatory | Inbox: grey refresh icon, "Nothing to show", "Try refreshing". |
| 8 | 18s | 03 Primary CTA | "Your inbox is clear", "+ Create project", "or import from file". |
| 9 | 21s | 04 Context = Design | First run, No results, Error, Filtered: four cards, four voices, four CTAs. |
| 10 | 27s | 05 Empty = Onboarding | Ghost task card, "← This is how a task looks". |
| 11 | 33s | 05 Onboarding | Plus a "Drag files here to start" drop zone. |
| 12 | 36s | Outro | 5 empty state RULES, 01 Illustration. |
| 13 | 37.5s | Outro | All five chips, Save / Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="es"><div id="empty" class="es-empty"></div></div>
<script type="module">
  import { EmptyState, kindFor, GhostPreview } from './pattern.js';
  const kind = kindFor({ total: items.length, visible: shown.length, query, filters: activeFilters.length, error });
  if (kind) EmptyState(document.getElementById('empty'), { kind, count: items.length, onCta: k => k === 'error' ? reload() : k === 'no-results' ? clearSearch() : k === 'filtered' ? resetFilters() : startTutorial() });
  // first run with a preview of the real thing:
  GhostPreview(document.getElementById('empty'), { label: '← This is how a task looks', drop: 'Drag files here to start' });
</script>
```

`kindFor(state)` picks first-run / no-results / error / filtered from the situation; `EmptyState(root, opts)` renders icon, title, body and the mandatory CTA (it throws without one) and fires `es:cta`; `GhostPreview` renders the ghost item and a drop zone that fires `es:drop` with the files.

## Where it belongs

Any list, inbox, board, table, feed or search the user can reach before it has content, or after a filter, query or failure removes it. Not for loading states (use a skeleton) or for destructive confirmations.
