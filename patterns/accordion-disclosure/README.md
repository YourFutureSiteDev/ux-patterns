# Accordion Disclosure

> One accordion glides open, the other jumps. Four small rules separate them.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/accordion-disclosure](https://www.designmotionhq.com/patterns/accordion-disclosure) (no Instagram post). Category: interaction.

## The rule

Animate the panel with `grid-template-rows: 0fr -> 1fr` (never `height: auto`), rotate the chevron on the same curve, make the header a real `<button>` with `aria-expanded` and `aria-controls`, pick single-open for steps and many-open for FAQs, and keep the tapped header anchored when a lower item expands.

## Key insights

- You can't animate `height: auto`; the transition just snaps. Use `display: grid` with `grid-template-rows` going from `0fr` to `1fr`, or measure `scrollHeight` and animate to a pixel value.
- Drive the chevron rotation from the same timing curve as the panel. Even ~10 frames of lag between the two reads as broken, not smooth.
- Decide single vs multi open: an accordion lets one panel open at a time, a disclosure lets many stay open. Sequential steps stay single; FAQ lists let several breathe.
- The header is a `<button>`, not a `<div>`. Wire `aria-expanded` to reflect state and `aria-controls` to point at the panel, so Enter/Space toggle it and the focus ring shows.
- When an item near the bottom expands, anchor the tapped header so the list doesn't jump under the user, and stagger the revealed content in.

## Do / Don't

- **Do:** drive chevron rotation and panel height from one shared timing curve so they move as a unit.
- **Do:** render the header as a real `<button>` with `aria-expanded` and `aria-controls` wired to the panel.
- **Do:** match open behavior to content: one-at-a-time for steps, many-open for FAQ lists.
- **Don't:** animate `height: auto` and expect a transition. Use grid rows or a measured pixel height.
- **Don't:** let the chevron trail the panel; even a few frames of lag feels janky.
- **Don't:** let the list scroll-jump when a lower item expands. Keep the tapped header anchored.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Two FAQ lists: left glides (teal, 300ms grid rows), right jumps (pink, no transition). "One glides. One jumps." |
| 2 | 3s | The height trap | "You can't animate height: auto". accordion.css diff: height: auto struck out, display: grid + grid-template-rows: 0fr added. |
| 3 | 15s | Rotate the chevron WITH the panel | In sync vs Chevron lags, timing curves: teal tracks the panel, pink dashed arrives 10 frames late. |
| 4 | 27s | One at a time, or many open? | Accordion (1 · Shipping address, 2 · Payment, 3 · Review order) vs Disclosure (three FAQs all open). |
| 5 | 36s | Accessibility (expanded) | "It's a button, not a div." aria-expanded = true, aria-controls = "panel-1", Tab / Enter / Space keys. |
| 6 | 39s | Accessibility (collapsed) | Same item closed, aria-expanded = false. |
| 7 | 45s | Anchor the scroll. Stagger the content. | Two Help Center phones: No anchor (list jumped) vs Anchored (tapped header stays put, body lines stagger in). |
| 8 | 51s | Outro | Follow for more UI engineering. Follow @designmotionhq, Save this for your next component. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ac">
  <div class="ac-list" id="faq">
    <div class="ac-item">
      <button class="ac-item__head" aria-expanded="false">Do you offer refunds?<span class="ac-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg></span></button>
      <div class="ac-item__panel"><div><div class="ac-item__body">Yes — full refund within 30 days.</div></div></div>
    </div>
  </div>
</div>
<script type="module">
  import { Accordion, Disclosure } from './pattern.js';
  Accordion(document.getElementById('faq'));            // one open at a time
  // Disclosure(document.getElementById('faq'));       // many may stay open
</script>
```

`Accordion(root, { single, anchor })` wires each header button with `aria-expanded` and `aria-controls`, toggles `.is-open` (the CSS animates `grid-template-rows`), closes siblings when `single` is on, and, inside a `[data-anchor-scroll]` scroller, keeps the tapped header at the same screen position. `Disclosure` is the same with `single: false`. Returns `{ items, toggle, open, close, openIndex }` and fires `ac:toggle`.

## Where it belongs

FAQ lists, settings groups, checkout steps, help centres, filter panels. Any list where headers reveal more. Not for content the user must always see, and not for tabs (only one visible, no collapse).
