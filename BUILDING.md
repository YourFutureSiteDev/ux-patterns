# Building a pattern replica

Every folder in `patterns/<slug>/` is an exact rebuild of one @designmotionhq reel: same layout, same colours, same copy, same motion, scene for scene. `patterns/optimistic-ui/` is the reference. Read its four files before building anything.

## Inputs (all under `source/`, gitignored)

- `catalog.json` at the repo root: the entry for your slug. `frames` points at the folder of full-resolution frames (720x1280, one every 1.5 s, `001.jpg` = 0 s). `video` is the mp4. `insights` and `dodont` are the site's text (empty for Instagram-only reels: derive them from the on-screen copy).
- `source/sheets/<name>.jpg`: a 6x6 contact sheet, one frame every 3 s. Use it to find the scenes, then open the full-res frames for every scene you build. Never build from the sheet alone: it is too small to read the copy and you will get numbers wrong (the reference build first read 99% as 40% that way).

## Outputs (four files, nothing else)

```
patterns/<slug>/
  demo.html     the replica: one <section class="scene"> per reel scene, 720x1280 each
  pattern.css   the reusable component styles, prefixed with a 2-3 letter slug prefix (.ou-, .dt-, ...)
  pattern.js    the behaviour as ES module exports (the real logic, not a demo-only hack)
  README.md     title, hook, source links, rule, insights, do/don't, scenes table, usage, "where it belongs"
```

demo.html links `../_shared/stage.css` and `pattern.css`, loads Inter from Google Fonts, and ends with `<script src="../_shared/stage.js"></script>`. Set the reel's own palette on `:root` (`--bg`, `--accent`, `--danger`) in a `<style>` block. Use the shared chrome classes (`.kicker`, `.title`, `.caption`, `.center`, `.glow`, `.cursor`) for the recurring reel furniture, and inline `style="position:absolute;left:…;top:…"` to place components exactly where the frame has them.

## Scenes

- One `<section class="scene" data-t="START" data-shot="T">` per distinct scene. `data-t` is the second the scene starts in the reel; `data-shot` is the second whose frame the screenshot is compared against (pick a frame where the scene is fully drawn, not mid-transition). Frame index = round(T / 1.5) + 1.
- If a scene changes materially over time (a needle sweep, a list filling in, a before/after flip), add a second section for the later state, as the reference does for the 99% stat.
- Motion belongs in the replica. Bars grow, needles sweep, toasts slide, cursors move, states flip. Drive it with CSS animations/transitions so `?t=` can freeze it, or from a `scene:enter` listener (see the reference's gauge) when it needs JS. Screenshots freeze at `data-shot`, so the frozen state must match the frame.
- Skip the "Follow / Save this" outro only if it is purely a CTA with no UI; if it shows the component (as optimistic-ui's does), build it.

## Fidelity bar

Measure from the frames, do not guess: headline size and position, panel widths, radii, border colour, glow colour, icon shapes, exact copy including punctuation and capitalisation, numbers, chip text. The colours vary between reels (early ones are purple on near-black, mid ones teal, some pink or orange); sample the frame, do not assume the reference palette.

Then prove it:

```
node tools/shot.mjs <slug>
```

writes `tools/shots/<slug>/compare-N.jpg` with the source frame on the left and your scene on the right. Open every compare image. Fix anything that differs in layout, size, colour, copy or state, re-shoot, and repeat until a stranger could not tell which side is the reel. Only then is the pattern done.

## Credit

The README's second line links the designmotionhq page (if it exists) and the Instagram reel from `catalog.json`. The code is our own implementation of the pattern; none of their files are copied or committed.
