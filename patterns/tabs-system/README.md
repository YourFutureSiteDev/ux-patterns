# Tabs System

> Tabs aren't a widget. They're a system. Stop letting them jump.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/tabs-system](https://www.designmotionhq.com/patterns/tabs-system) · [Instagram](https://www.instagram.com/reel/DYj367uNQlW/) (73.3K views). Category: navigation.

## The rule

Slide the indicator with a spring, never teleport it. Scroll an overflowing row instead of wrapping it. Make the row keyboard-operable with a focus ring that never shares the active colour. Fade content out, pause, fade in, with heights matched. On mobile use a segmented control under 5 tabs and a bottom sheet over 5.

## Key insights

- The active indicator should slide, never teleport. Drive it with a spring (damping 22, stiffness 200) and match its timing to the content fade: slow in, fast out.
- When tabs overflow one screen, never wrap to a second line. Scroll horizontally, add edge fades to hint at what's off-screen, and put chevron buttons on desktop.
- Make it keyboard-operable: arrows move between tabs, Home jumps to first, End to last, and Tab exits to the next focusable group.
- The focus ring and the active state must never share a colour, otherwise keyboard users can't tell where they are versus what's selected.
- Content should never hard-cut on switch. Fade out 80ms, pause 80ms, fade in 80ms, and match panel heights so nothing shifts.
- Mobile isn't a shrunk desktop: a segmented control under 5 tabs, a bottom sheet over 5, never a scaled-down bar. Touch targets ≥ 44px, thumb zone first.

## Do / Don't

- **Do:** slide the active indicator with a spring, timed to match the content fade.
- **Do:** scroll an overflowing tab row horizontally with edge fades and desktop chevrons.
- **Do:** give the focus ring and active state distinct colours.
- **Don't:** wrap an overflowing tab row onto a second line.
- **Don't:** hard-cut content on switch; fade out, pause, fade in instead.
- **Don't:** reuse the desktop tab bar shrunk down on mobile.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Same click on Settings: HARD CUT · 0MS on top, SMOOTH SLIDE · 280MS below. |
| 2 | 3s | 01 · Indicator | The underline slides. spring({ damping: 22, stiffness: 200 }), content fade 180 ms, ease out (slow in, fast out). Hard cut vs slide bars. |
| 3 | 12s | 02 · Overflow | 8 tabs · 1 screen with edge fade and chevrons. Scroll horizontal, edge fades, chevrons on desktop. Don't wrap to 2 lines. |
| 4 | 21s | 03 · Keyboard | Arrows. Home. End. Tab. Dashed blue focus ring on Overview, Save changes button, key caps, FOCUS never the same as ACTIVE. |
| 5 | 30s | 04 · Mobile | Under 5 tabs: segmented control. Over 5 tabs: bottom sheet of sections. Never do this: a shrunk desktop bar. Touch targets ≥ 44px · thumb zone first. |
| 6 | 36s | 05 · Content, bad | Hard cut between Stats and Activity. |
| 7 | 40.5s | 05 · Content, good | Fade out 80ms · 80ms pause · fade in 80ms. |
| 8 | 43.5s | 05 · Content, match the height | Container height interpolates, no layout shift. |
| 9 | 46.5s | Outro | Follow for more UI systems. Save this for your next dashboard. @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="tb">
  <button class="tb-chev" id="prev">‹</button>
  <nav class="tb-tabs" id="tabs">
    <button class="tb-tab is-active">Overview</button><button class="tb-tab">Activity</button>
    <button class="tb-tab">Settings</button><button class="tb-tab">Billing</button>
    <i class="tb-tabs__ind"></i>
  </nav>
  <button class="tb-chev" id="next">›</button>
  <section class="tb-panel"><div class="tb-panel__content" id="p1">…</div><div class="tb-panel__content" id="p2" hidden>…</div></section>
</div>
<script type="module">
  import { Tabs, OverflowTabs, pickMobileTabs, BottomSheet } from './pattern.js';
  Tabs(document.getElementById('tabs'), { panels: [p1, p2, p3, p4], fade: 80, pause: 80, onChange: id => {} });
  OverflowTabs(document.getElementById('tabs'), { prev, next, step: 278 }); // only when the row overflows
  pickMobileTabs(7); // 'bottom-sheet'
</script>
```

`Tabs` moves the `.tb-tabs__ind` indicator to the active tab (spring-ish transition), handles click, ArrowLeft/Right, Home and End, and swaps panels with fade out → pause → fade in. `OverflowTabs` turns the row into a horizontal scroller with edge fades and wires the chevrons. `pickMobileTabs(count)` returns `segmented-control` under 5 or `bottom-sheet` otherwise; `BottomSheet` runs the sheet.

## Where it belongs

Settings pages, dashboards, profile and detail views: anywhere sibling content shares one place on screen. Segmented control or bottom sheet on phones, never the desktop bar shrunk down.
