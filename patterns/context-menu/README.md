# Context Menu

> A context menu is a system, not just a list of actions.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/context-menu](https://www.designmotionhq.com/patterns/context-menu) · [Instagram](https://www.instagram.com/reel/DaxPFk9tOuy/) (123K views). Category: interaction.

## The rule

Measure before you open, group by intent with the destructive action last in red, hold submenus open with a safe triangle, let the keyboard walk and jump, and wire a long press to the same actions on mobile.

## Key insights

- A context menu measures before it opens. No room below, it flips up; no room to the right, it mirrors left, always anchored to your cursor and always inside the viewport.
- Twelve flat actions read as noise. Group by intent and split with dividers: pair Rename with Duplicate, Share with Copy link, and isolate Delete at the bottom in red.
- Submenus die the instant the cursor drifts off the row. Draw an invisible safe triangle from cursor to submenu so the menu holds while you move diagonally toward it. That is hover intent.
- Power users never aim. Arrows walk the list, letters jump (press D, land on Duplicate), and Escape closes one level, not the whole menu.
- Mobile has no right click. A long press opens the same actions as a bottom sheet: one menu system, two triggers.

## Do / Don't

- **Do:** measure available space and flip the menu so it always opens inside the viewport.
- **Do:** group actions by intent with dividers, and set the destructive action apart at the bottom in red.
- **Do:** add a safe triangle from cursor to submenu so it survives a diagonal move.
- **Don't:** close a submenu the moment the cursor leaves the row, ignoring the diagonal path toward it.
- **Don't:** dump a dozen ungrouped actions into one flat, unscannable list.
- **Don't:** ship right-click only; wire a long press to the same actions on mobile.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | It measured first. | Files window, right-click on roadmap.fig: ring + measure box, then the menu opens flipped left. cursor 930 · 652, viewport 1080 × 1920, flip ←. |
| 2 | 3s | Measure, then open | acme.app/library viewport with four skeleton menus: fits ↓, flip ↑, mirror ←, flip ↖. |
| 3 | 12s | Group by intent | 12 flat actions = noise. |
| 4 | 16.5s | Group by intent | 3 groups by intent +1 destructive, labelled PRIMARY, EDIT, SHARE, DELETE. |
| 5 | 22.5s | The safe triangle | Safe triangle (hover intent, Figma-style) vs no triangle (naive hover), triangle drawn from cursor tip to submenu edge. |
| 6 | 27s | The safe triangle | Diagonal move: menu holds vs menu dies mid-path, submenu lost. |
| 7 | 31.5s | Power users never aim | ↓ ↓ D walks and jumps to Duplicate, type-ahead: D. |
| 8 | 36s | Power users never aim | ↓ → opens the Move to… submenu on Documents. |
| 9 | 38.5s | Power users never aim | esc = one level · parent stays. |
| 10 | 40.5s | No right-click on mobile | Desktop right-click menu beside a phone Library with a long-press bottom sheet: same actions, two triggers. |
| 11 | 46.5s | Outro | Right-click is a system. Working keyboard menu, Follow for more UX engineering. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="cm"><ul id="files">…</ul></div>
<script type="module">
  import { ContextMenu } from './pattern.js';
  const menu = ContextMenu(document.getElementById('files'), {
    items: [
      { label: 'Open', icon: '#i-open', kbd: '⌘O' }, { label: 'Rename', icon: '#i-rename' },
      { label: 'Move to…', icon: '#i-move', children: [{ label: 'Documents' }, { label: 'Projects' }] }, '-',
      { label: 'Copy link', icon: '#i-link' }, { label: 'Share', icon: '#i-share' }, '-',
      { label: 'Delete', icon: '#i-trash', danger: true }
    ]
  });
  menu.on('select', e => console.log(e.detail.label));
</script>
```

`ContextMenu` opens on right-click or a 500 ms long press, calls `place()` to flip or mirror inside the viewport, opens submenus with `inSafeTriangle()` hold logic, and wires `keyboardNav()` (arrows walk, letters jump, Right opens, Left/Esc close one level). `renderMenu(items)` builds the `.cm-menu` markup on its own; `longPress(el, fn, ms)` is the touch trigger.

## Where it belongs

File lists, tables, canvases, cards, anything with more than two actions per item. Same items on desktop (right-click) and mobile (long press to a bottom sheet). Never a flat dump of every verb the object supports.
