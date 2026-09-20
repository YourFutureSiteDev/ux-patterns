# Notification Badge

> Notification badge is a system. One rule, every surface.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/Dcnuc60NbeO/) (114K views). Category: feedback. Instagram-only reel; insights and do/don't are derived from the on-screen copy.

## The rule

A badge is a count you clear, not a status. Cap it at 99+, pin it to the corner so the icon never moves, only ever count up, clear it the moment the surface is opened, and put it only on the things that need the user.

## Key insights

- Cap the count: uncapped, the pill grows without limit and reflows the nav. At 99+ the width is bounded and the layout holds.
- Pin it to the corner: the badge is anchored to the icon's corner and grows left. A badge that reflows slides the icon and the layout drifts.
- Two signals, not one: a count is an action (how many, act now, changes on each new item). A status is a state (which state, nothing to do, changes on presence). Different signals, different rules.
- One signal per row: a dot says "changed", a number says "how many". Never both on the same row, or the reader has to ask "which one?".
- Open it, clear it: a badge that never clears trains people to ignore it. Opening the inbox marks it read and the count goes.
- Count up, never blink: counts only climb (3 › 4 › 5 › 6). A reset to zero between updates (5 › 0 › 6 › 0 › 7) reads as a broken badge.
- Badge the decision, not everything: badge everything and nothing stands out. Signal needs silence, so only what needs the user gets a number.

## Do / Don't

- **Do:** cap at 99+ so the pill has a bounded width and the nav never reflows.
- **Do:** anchor the badge to the icon's corner and let it grow left.
- **Do:** clear the count when the surface is opened, and only ever increment between opens.
- **Do:** pick one signal per row: a dot for changed, a number for pending.
- **Don't:** use a count where a status dot is the honest signal (presence, connection, availability).
- **Don't:** blink the badge to zero on a refresh; keep the last count until the user clears it.
- **Don't:** badge every category; reserve the number for mentions and things that need the user.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Badge · Unread count | Bell tile with 24, then "One rule, every surface": mail 3, bell 24, chat 12. |
| 2 | 3s | Cap the count (uncapped) | 1174 pill measured at 230px, same badge in a real nav, "the pill grows without limit". |
| 3 | 6s | Cap the count (capped) | 99+ pill at 184px with a lock, nav holds, "width is bounded, layout holds". |
| 4 | 9s | Pin it to the corner | Anchored vs reflowing tiles at 1, "icon slid 0px". |
| 5 | 10.5s | Pin it to the corner (12) | Badge grows left on the anchored tile; the reflowing icon slides 24px. |
| 6 | 13.5s | Two signals, not one | Bell with 9 (count · action) vs SC avatar with a green dot (status · state). |
| 7 | 18s | Two signals, not one (table) | Answers / You must / Changes on: how many, act now, each new item vs which state, nothing, presence. |
| 8 | 21s | One signal per row | Miles Reyes dot "changed", Priya Nair 5 "how many", Deploy Bot dot + 3 "which one?" flagged noise. |
| 9 | 27s | Open it, clear it | Two inboxes at 12 unread, cursor on the first row. |
| 10 | 30s | Open it, clear it (after) | First inbox "✓ cleared / read", second still 12 after reading: "still 12?". |
| 11 | 33s | Count up, never blink | Both tiles at 3: "rolls up" vs "blinks to 0". |
| 12 | 36s | Count up, never blink (sequences) | 5 vs 0, clean 3 › 4 › 5 › 6, buggy 5 › 0 › 6 › 0 › 7. |
| 13 | 39s | Badge the decision, not everything | Badge everything (5 badges) vs Only what needs you (Mentions 3). |
| 14 | 45s | Outro | More UI systems: Cap at 99+, Pin to the corner, Clear on open. designmotionhq.com. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="nb">
  <button class="nb-tile" id="bell" style="width:64px;height:64px;border-radius:16px">…bell svg…</button>
</div>
<script type="module">
  import { CornerBadge, formatBadge, rowSignal, decideBadges } from './pattern.js';
  const badge = CornerBadge(document.getElementById('bell'), { cap: 99 });
  badge.set(12);          // renders "12"
  badge.set(4);           // ignored: counts never blink down
  badge.increment();      // "13"
  badge.clear();          // open it, clear it
  formatBadge(1174);      // "99+"
  rowSignal({ pending: 5 });            // { kind: 'count', label: '5' }
  decideBadges({ messages: 4, mentions: 9 });   // { messages: '', mentions: '9' }
</script>
```

`formatBadge` caps the count. `Badge` and `CornerBadge` render a live count that only climbs and only clears on open. `rowSignal` picks dot, count or nothing for a row. `decideBadges` badges only the categories that need the user. `Inbox` marks rows read and clears the badge when opened.

## Where it belongs

Tab bars, nav items, app icons, inbox headers and category lists. A number for things the user must act on and clear; a dot for something that changed; a status dot, never a count, for presence.
