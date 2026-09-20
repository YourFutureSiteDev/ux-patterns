# Live Cursors

> Three cursors land on your canvas. None of them are yours.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/live-cursors](https://www.designmotionhq.com/patterns/live-cursors) · [Instagram](https://www.instagram.com/reel/DbAsaXANvpq/) (71.4K views). Category: interaction.

## The rule

Interpolate cursor positions between server ticks, colour every user from a stable hash of their id, show presence before anyone speaks, lock an element the instant someone selects it, and let people ride another user's viewport instead of screen sharing.

## Key insights

- The server streams roughly 10 positions a second while the screen redraws at 60fps. Interpolation fills the gaps so cursors glide instead of teleporting between discrete points.
- Give every user a color hashed from their ID, not assigned at random. The same person keeps the same color across sessions, so you can track identity from the corner of your eye.
- An avatar stack with an overflow counter (three faces, then a +5) signals presence before anyone edits or speaks. You feel the room before you read a single name.
- When someone selects an element, lock it and outline it in their color. Two people editing one shape is a corrupted shape, so the lock prevents the conflict before it can exist.
- Follow mode binds your viewport to another user's: click their avatar and their pans and zooms drive your screen. It replaces a screen share for live design review.

## Do / Don't

- **Do:** interpolate cursor positions between server ticks so movement reads as smooth motion at 60fps.
- **Do:** derive user color from a stable hash of the ID so it survives across sessions.
- **Do:** lock an element the instant it is selected and badge it in the editor's color.
- **Don't:** render cursors at the raw server tick rate, which makes them jump between points.
- **Don't:** assign colors randomly per session, which resets identity every time someone rejoins.
- **Don't:** allow two users to edit the same element at once.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Your canvas. Their cursors. | onboarding-flow canvas with Priya Oberoi card and Weekly actives 12,480; Sarah, Alex and Maya cursors. "3 collaborators · live". |
| 2 | 3s | Interpolation | Raw · 10 Hz cursor jumping between waypoints vs Interpolated cursor gliding. One second of traffic: Server 10/s, Screen 60/s. |
| 3 | 12s | Color from identity | sarah@acme.co → #14B8A6 → swatch. Same teal Sarah cursor on Monday, Wednesday, Friday. |
| 4 | 21s | Presence | Doc header with SC, AR, MK, +5 avatar stack; canvas with named and ghost cursors. "8 online". |
| 5 | 27s | Selection locks | Priya card selected with teal outline, handles and a "Sarah" lock tag. |
| 6 | 31.5s | Selection locks (conflict) | Alex's cursor lands on the card and gets "Sarah is editing". |
| 7 | 37s | Follow mode | MK avatar clicked, amber viewport frame "Following Maya" over Maya's camera. |
| 8 | 42s | Follow mode (later) | Maya has panned and zoomed; our viewport followed. |
| 9 | 45s | Outro | Multiplayer is a system. cursors · interpolation · color · presence · locks · follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="lc"><div class="lc-canvas" id="canvas" style="position:relative;width:800px;height:500px"></div></div>
<script type="module">
  import { CursorLayer, colorFromId, Presence, SelectionLocks, FollowMode } from './pattern.js';
  const cursors = CursorLayer(document.getElementById('canvas'));
  socket.on('cursor', ({ id, name, x, y }) => cursors.update(id, x, y, name)); // ~10 Hz in, 60 fps out
  const locks = SelectionLocks();
  const r = locks.acquire('shape-42', { id: 'sarah@acme.co', color: colorFromId('sarah@acme.co').hex });
  if (!r.ok) showTip(`${r.by.name} is editing`);
</script>
```

`CursorLayer` eases every cursor toward its latest server position each frame. `colorFromId(id)` is a pure FNV hash to a hue, so the colour is the same on every device and session. `Presence(root).render(users)` draws the avatar stack with overflow. `SelectionLocks` grants an element to its first selector. `FollowMode(world).follow(camera)` binds a viewport transform to another user's camera.

## Where it belongs

Design canvases, whiteboards, shared documents, any multi-user editor. Not on read-only pages or single-user forms where a stranger's cursor is noise.
