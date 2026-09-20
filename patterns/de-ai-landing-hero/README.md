# De-AI Landing Hero

> Your landing page looks AI-made. Five tells. Five fixes.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/de-ai-landing-hero](https://www.designmotionhq.com/patterns/de-ai-landing-hero) · [Instagram](https://www.instagram.com/reel/DdQ7QwqNLiY/) (99.9K views). Category: visual.

## The rule

A generated hero decorates because it has nothing concrete to show. Swap each decoration (adjective headline, purple blob, twin buttons, fake social proof, icon-in-a-circle cards) for the product itself and the AI look disappears.

## Key insights

- **Gradient headline** full of adjectives ("Supercharge your workflow with AI") is the first tell: a generated hero sells adjectives because it has no product to name. Switch to plain text that says what it does and for whom, like "Close the month in one afternoon" over "Bookkeeping for small teams, without the spreadsheet."
- **The purple blob** behind everything is a gradient smear added because the page needs energy from somewhere. Use a neutral background and put the only color on the product screenshot and one primary button: one accent, zero blobs.
- **Two equal buttons** ("Get started" and "Learn more", same size, side by side) split the click. Keep one primary button and turn the second into a text link with an arrow, moving the visual weight from 50/50 to roughly 90/10.
- **Fake social proof** ("Trusted by 10,000+ users" above five grey logos) is a number nobody can check next to logos nobody recognizes. Replace it with one quote: a name, a role, and a result with a unit, such as closing the month in three hours instead of a week.
- **Three feature cards** with an icon in a circle and one word each (Fast, Secure, Easy) appear on every generated page. Replace the row with one product screenshot and three annotations pointing at real UI elements.
- Every fix follows the same rule: the generated hero decorates because it has nothing concrete to show. Swap each decoration for the product itself and the AI look disappears.

## Do / Don't

- **Do:** Name the outcome in the headline and the audience in the subtitle.
- **Do:** Give the product screenshot and the primary button the only accent color on the page.
- **Do:** Quote one customer with a role and a measurable result.
- **Don't:** Fill the headline with adjectives like supercharge, seamless, or powerful.
- **Don't:** Place two identical buttons side by side.
- **Don't:** Ship the icon-in-a-circle feature row with one-word labels.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Looks AI-made. | The Lumen landing: gradient headline, blob, twin buttons, "Trusted by 10,000+ users", Fast / Secure / Easy. |
| 2 | 0.5s | Five tells. Five fixes. | Markers 1 to 5 on the headline, blob, buttons, proof line and cards. |
| 3 | 4.5s | Tell 01 · The headline | Marker on "Supercharge your workflow with AI". "Outcome first · plain text". |
| 4 | 7.5s | Tell 01 · 0 words about the product | Supercharge, all-in-one, seamlessly struck through. |
| 5 | 12s | Tell 01 fixed | "Close the month in one afternoon." Bookkeeping for small teams (for whom). |
| 6 | 18s | Tell 02 · The blob | Marker 2, the gradient swatch: 7C3AED → EC4899 · blur 90 · behind everything, "decorative". |
| 7 | 24s | Tell 02 · blob gone | Neutral background. |
| 8 | 26s | Tell 02 fixed | Colour on the product: green Get started and the Overview screenshot ("product"). "1 accent · 0 blobs". |
| 9 | 30s | Tell 03 · Two buttons | Zoomed hero, Click weight 50 % / 50 %, "same size, side by side". |
| 10 | 33s | Tell 03 · 200 × 64, twice | Dashed outlines, 200 × 64 tags, "two equal buttons split the click". |
| 11 | 37.5s | Tell 03 fixed | Start free + "See how it works →". Click weight 90 % / 10 %, "one primary takes the click". |
| 12 | 42s | Tell 04 · The proof | "Trusted by 10,000+ users" with 10,000+ struck: "unverifiable". |
| 13 | 49.5s | Tell 04 fixed · a name | Sarah Chen quote card, "✓ a name". |
| 14 | 52s | Tell 04 · name, role, result | "✓ a result with a unit" (three hours), "✓ a role" (Head of Finance, Acme). |
| 15 | 54s | Tell 05 · Feature cards | Marker 5 on Fast / Secure / Easy. "Show the product · not the adjectives". |
| 16 | 61.5s | Tell 05 · same row, every generated page | The three one-word titles underlined. |
| 17 | 64.5s | Tell 05 fixed | The Overview screen: Revenue $48,210, Unreconciled 12, Days to close 3, Cash in vs out, Recent transactions. |
| 18 | 67.5s | Tell 05 · three real things | Export to your accountant in one click · Bank sync, every morning · Categories learned from your history. |
| 19 | 72s | Outro · Claude Code | Five tells, gone. The fixed page with the /ux-design, /ux-audit, /ux-review, /restyle palette. |
| 20 | 78s | Outro · UX Engine | UX Engine, Claude Code plugin, $79 one time. Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="lh">
  <div class="lh-frame" style="position:relative;width:666px;height:703px">
    <div id="page" style="left:0;top:0"></div>
  </div>
</div>
<script type="module">
  import { Landing } from './pattern.js';
  const page = Landing(document.getElementById('page'), { headline: 'ai', blob: true, primary: 'gradient' });
  page.set({ headline: 'plain' });                                  // tell 1
  page.set({ blob: false, shot: true, primary: 'green' });          // tell 2
  page.set({ cta: 'Start free', secondary: 'link' });               // tell 3
  page.set({ proof: 'quote' });                                     // tell 4
  page.set({ features: 'product' });                                // tell 5
</script>
```

`Landing(el, state)` renders the whole page from a state object and returns `{ set(patch), state }`. `parseState("shot primary=green cta=Start+free")` turns a `data-state` string into that object and `mountAll()` mounts every `[data-landing]`. `ClickWeight(el).set(90)` drives the click-weight meter from tell 3. Reel overlays (`.lh-marker`, `.lh-note`, `.lh-tag`, `.lh-outline`, `.lh-strike`, `.lh-underline`, `.lh-swatch`) are placed with inline coordinates.

## Where it belongs

Any SaaS landing hero or marketing page above the fold. The five checks apply whenever a generator has filled the page with a gradient headline, a blob, twin buttons, a trust line and three icon cards.
