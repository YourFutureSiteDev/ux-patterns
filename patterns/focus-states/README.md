# Focus States

> Press Tab. Where did the focus go?

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/focus-states](https://www.designmotionhq.com/patterns/focus-states) · [Instagram](https://www.instagram.com/reel/DahwAvbhOmx/) (42.5K views). Category: navigation.

## The rule

Never remove the focus ring without shipping a better one: 2px, 2px offset, 3:1 contrast, shown only for keyboard users via `:focus-visible`. Keep DOM order and visual order in sync, trap focus inside dialogs and hand it back on Escape, and put a skip link first on the page.

## Key insights

- `outline: none` isn't a style choice. Remove the default focus ring and you've shipped an accessibility failure. If you kill it, replace it with something better.
- A proper focus ring needs three things: 2px thickness, a 2px offset, and enough contrast to stay visible on both light and dark backgrounds.
- `:focus-visible` tells mouse and keyboard apart. A click gets no ring, a Tab press gets one, so keyboard users can navigate without cluttering the pointer experience.
- Focus follows the DOM order, not your visual layout. Reorder columns with CSS and Tab starts teleporting across the page; keep visual order and DOM order in sync.
- Inside a modal, trap the focus: Tab should cycle through the dialog and wrap around, and Escape should close it and hand focus back to the element that opened it.
- A skip link jumps past dozens of nav links in a single keypress. Keep it invisible until focused, and make it the first element on the page.

## Do / Don't

- **Do:** replace a removed outline with a custom ring: 2px thick, offset, and contrasting on every background.
- **Do:** reach for `:focus-visible` so keyboard users get a ring while mouse clicks stay clean.
- **Do:** place a skip link as the first focusable element, hidden until focused.
- **Don't:** set `outline: none` without shipping a visible replacement.
- **Don't:** reorder content with CSS and let the DOM order drift from the visual order.
- **Don't:** let a modal leak focus to the page behind it, or drop focus when it closes.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Checkout card, Tab pressed, no ring anywhere. "Your keyboard users see nothing." |
| 2 | 3s | The focus ring | `button:focus { outline: none; }`, WCAG 2.4.7 FAIL, the ring on light and dark (3.2:1). |
| 3 | 7.5s | The focus ring | Continue button annotated: 2px width, 2px offset, 3:1 contrast. "Kill it? Ship a better one." |
| 4 | 12s | :focus-visible | Mouse: click, no ring. Keyboard: Tab, ring. `button:focus-visible { outline: 2px solid #14B8A6; }` |
| 5 | 24s | Tab order | Stat grid numbered 1, 3, 4, 2: CSS reorder teleports. |
| 6 | 28.5s | Tab order | 1, 2, 3, 4: DOM reordered flows. "Visual order = DOM order" |
| 7 | 33s | Focus trap | Delete account? dialog, Tab lands on Delete. |
| 8 | 37.5s | Focus trap | Tab wraps to Cancel, Esc lit. |
| 9 | 40.5s | Focus trap | Escape closes; focus returns to the Delete account button. "Escape hands focus back." |
| 10 | 42s | Skip link | acme.co: "Skip to main content" focused, 40 links before content. |
| 11 | 46.5s | Skip link | Enter: 40 links skipped, "Latest releases" focused. "Invisible until focused." |
| 12 | 51s | Outro | "Focus is a feature." Follow for more UX engineering. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<body class="fs">
  <a href="#main" id="skip" class="fs-btn fs-btn--skip">Skip to main content</a>
  <nav>…40 links…</nav>
  <main id="main">…</main>
  <button id="open">Delete account</button>
  <div id="dialog" class="fs-dialog" hidden>…<button>Cancel</button><button data-autofocus>Delete</button></div>
</body>
<script type="module">
  import { FocusTrap, SkipLink, auditTabOrder } from './pattern.js';
  SkipLink(document.getElementById('skip'), document.getElementById('main'));
  const trap = FocusTrap(document.getElementById('dialog'));
  document.getElementById('open').addEventListener('click', e => trap.open(e.currentTarget));
  console.table(auditTabOrder());   // flags any element whose DOM index != visual index
</script>
```

The ring itself is CSS: `.fs :focus-visible` draws 2px `#2ecda0` with a 2px offset and a soft glow; `.fs :focus` clears the default so mouse clicks stay clean. `FocusTrap` cycles Tab/Shift+Tab inside the dialog, blocks focus leaking behind it, and on Escape hides the dialog and refocuses the opener (`fs:open`, `fs:close`). `SkipLink` moves focus to `main` and reports how many links it skipped. `auditTabOrder` lists every focusable element with its DOM and visual index.

## Where it belongs

Every interactive element, on every page. Rings on buttons, inputs, links and cards; traps on every modal and drawer; a skip link on any page with a header full of links.
