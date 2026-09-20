# Avatar System

> One image fails? Degrade, don't break. Same name, same colour, everywhere.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DcikWR-NQPT/) (104K views). Category: visual.

## The rule

An avatar is a system, not a picture. Resolve it through a fallback chain (image, then initials from the name, then a generic icon, never a broken square), colour it from a hash of the name so the same person is the same hue on every screen, show two initials by default and one only when tiny, overlap groups and cap the row with a +N, put presence on the ring instead of a second badge, and stop at three sizes.

## Key insights

- Fallback chain: image if it loads, initials from the name, generic icon as the last resort. The fallback ships anyway, so the UI never shows a broken square.
- Deterministic colour: hash the name ("Sarah Chen" → 0x629b2403 → % 6 = 1 → #0EA5E9). One function, every screen. A random palette makes the same person look like three people.
- Initials: two letters read as a person. Below about 24px they turn to mush, so drop to one. A lone "J" on a full-size avatar reads as a bug.
- Stacks: overlap the group (about −40% of the size), cap the row at four, fold the rest into "+3".
- Presence: status lives on the ring (green online, amber away, grey offline). A dot plus an "Online" chip plus "active now" is stacked and redundant.
- Sizes: 24 list, 32 header, 40 profile. Three tokens, nothing between.

## Do / Don't

- **Do:** resolve every avatar through image → initials → icon.
- **Do:** derive the colour from a hash of the name, never from a random pick.
- **Do:** show two initials, one only when the avatar is tiny.
- **Do:** put presence on the ring as the single signal.
- **Don't:** render a broken image square, ever.
- **Don't:** show more than four avatars in a row; cap and count the rest.
- **Don't:** invent a fourth size.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Avatar · Component system | Ringed SC avatar, "fallback → initials", one fails → use the next. |
| 2 | 3s | Fallback · Chain | image, initials, generic icon (all ✓), broken square (never). Resolve order. |
| 3 | 9s | Color · Deterministic | "Sarah Chen" → hash → % 6 → #0EA5E9 across chat header, comment, member list vs a random palette. |
| 4 | 19.5s | Initials · Default | Sarah Chen → SC; Sarah Chen, Miles Reyes, Ada Okafor. |
| 5 | 22.5s | Initials · Default | 48px, 32px, 24px keep two letters; 16px drops to "S". |
| 6 | 25.5s | Initials · Default | "JD Jamie Dean commented" is a person; "J commented" is a bug. |
| 7 | 28.5s | Stack · Overflow | SC MR AO LP +3, overlap −52px, cap 4 shown, Design Review with 7 collaborators. |
| 8 | 33s | Presence · Ring | On the ring vs second badge; ONLINE green, AWAY amber, OFFLINE grey. |
| 9 | 42s | Size · Scale | 24 list, 32 header, 40 profile on a baseline; three list cards. |
| 10 | 48s | Outro | More UI systems, designmotionhq.com. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="av">
  <span id="me"></span>
  <span id="team"></span>
</div>
<script type="module">
  import { Avatar, AvatarStack, colorFromName, initials } from './pattern.js';
  Avatar(document.getElementById('me'), { name: 'Sarah Chen', src: '/photos/sarah.jpg', size: 'header', status: 'online' });
  AvatarStack(document.getElementById('team'), [{ name: 'Sarah Chen' }, { name: 'Miles Reyes' }, { name: 'Ada Okafor' }, { name: 'Lena Park' }, { name: 'Omar Diaz' }], { max: 4, size: 'list' });
</script>
```

`Avatar` walks the chain (image on load, initials on error, icon when there is no name), sizes from `SIZES` (list 24, header 32, profile 40) and puts presence on the ring via `data-status`. `colorFromName` hashes with FNV-1a and picks from `palette`; `initials(name, size)` returns one letter under 24px. `AvatarStack` overlaps, caps at `max` and appends "+N". `setPresence(el, status)` flips the ring.

## Where it belongs

Chat headers, comment threads, member lists, collaborator stacks, profile cards. Anywhere a person is shown, which is everywhere.
