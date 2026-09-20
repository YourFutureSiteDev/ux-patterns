# CSS :has() Selector

> One line of CSS. The whole card reacts to its own checkbox.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/css-has-selector](https://www.designmotionhq.com/patterns/css-has-selector) · [Instagram](https://www.instagram.com/reel/DdGkqx_t3vH/) (40.1K views). Category: interaction.

## The rule

When the state already lives in the DOM (checked, invalid, open, child count, a rendered aside), let `:has()` read it from the container instead of mirroring it into JavaScript state to toggle a class.

## Key insights

- `:has()` is the parent selector. `.plan:has(:checked)` styles the whole card when its own radio is checked. For twenty years CSS only looked down and forward; now it looks up. Every major browser supports it since 2023 (Chrome 105, Safari 15.4, Firefox 121, Edge 105).
- Validation without a handler: `.field:has(:user-invalid)` turns the border, label and icon at once. No onChange, no error state in React. The browser already knows the email is wrong, so let it drive the styling.
- Escalate to the form: `form:has(:user-invalid) button { opacity: .4 }` greys out the submit button while any field is invalid. One rule, zero derived state.
- Layout follows the DOM: `.app:has(aside) { grid-template-columns: 280px 1fr }` grows a column when a sidebar renders and collapses when it is removed. No showSidebar prop to thread through.
- Quantity queries live in CSS: `.grid:has(> :nth-child(n + 5))` tightens gap, padding and font size across all cards the moment a fifth one arrives. No counting items in JavaScript.
- The document reacts to a modal: `body:has(dialog[open]) { overflow: hidden }` locks scroll and a second rule dims the app behind it. Close the dialog and everything reverts on its own. No cleanup effect.

## Do / Don't

- **Do:** reach for `:has()` when the state already lives in the DOM: checked, open, invalid, child count.
- **Do:** use `:user-invalid` instead of `:invalid` so errors show after the user leaves the field, not on first render.
- **Do:** put the rule on the container so border, label and icon all update from one selector.
- **Don't:** mirror DOM state into React state just to toggle a class the browser can already compute.
- **Don't:** write a cleanup effect for scroll lock or dimming that a `body:has(dialog[open])` rule undoes by itself.
- **Don't:** count children in JavaScript to pick a layout when a quantity query does it in one rule.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | The card reacts to its checkbox. | Northwind checkout, Team radio ticked, `.plan:has(:checked)` lifts the card. 0 lines of JavaScript. |
| 2 | 4.5s | CSS looks up now. | DOM tree: input:radio (:checked) is the parent edge to .plan; .name descendant, .price sibling. Chrome 105 · Safari 15.4 · Firefox 121 · Edge 105. |
| 3 | 13.5s | The whole field knows. | `.field:has(:user-invalid)` turns border, label and icon red for sarah@acme. 0 onChange · 0 useState. |
| 4 | 25.5s | The whole field knows. | `form:has(:user-invalid) button` greys Pay $147; onChange and useState lines struck out. |
| 5 | 30s | Layout follows the DOM. | Browser mock, main only, columns 1fr. |
| 6 | 36.5s | Layout follows the DOM. | Order summary aside renders, `.app:has(aside)` makes it 280px 1fr. |
| 7 | 40.5s | The grid counts its children. | Four plans, --density wide. |
| 8 | 45s | The grid counts its children. | Agency arrives, `.plans:has(> :nth-child(n + 5))` flips to compact; the JS ternary is struck out. |
| 9 | 51s | The document reacts to the modal. | Confirm payment dialog open, `body:has(dialog[open]) { overflow: hidden }` locks scroll. |
| 10 | 57s | The document reacts to the modal. | Second rule dims .app to .4 behind the dialog. |
| 11 | 63s | The document reacts to the modal. | Dialog closed, everything reverts, the useEffect cleanup is gone. |
| 12 | 66s | Five selectors. Zero JavaScript. | The five selectors, 0 JS, UX Engine plugin card. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<form class="hs hs-form">
  <label class="hs-plan"><input type="radio" name="plan" value="team"> …</label>
  <div class="hs-field"><div class="hs-label">Work email</div><div class="hs-input"><input type="email" required></div><div class="hs-field__err">Enter a valid work email</div></div>
  <button class="hs-pay">Pay $147</button>
</form>
<script type="module">
  import { supportsHas, mirrorHasState, wireDialogs } from './pattern.js';
  if (!supportsHas()) document.querySelectorAll('.hs-form').forEach(mirrorHasState); // old engines only
  wireDialogs(document);
</script>
```

The five rules at the top of `pattern.css` are the pattern: `.hs-plan:has(:checked)`, `.hs-field:has(:user-invalid)`, `.hs-form:has(:user-invalid) .hs-pay`, `.hs-app:has(aside)`, `.hs-plans:has(> :nth-child(n + 5))`, `body:has(dialog[open])`. `pattern.js` only adds `supportsHas()`, a class-mirroring fallback (`mirrorHasState`, `countChildren`) for engines without `:has()`, and `wireDialogs` / `toggleAside` helpers.

## Where it belongs

Plan pickers, form validation, submit gating, optional sidebars, responsive card grids, modal scroll locks: anywhere the state is already in the DOM. Not for state that only exists in JavaScript (fetched data, timers), which still needs a class or attribute written by code.
