# Proximity Rule

> Close = related, far = separate: spacing alone groups your UI, no borders needed.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/proximity-rule](https://www.designmotionhq.com/patterns/proximity-rule) · [Instagram](https://www.instagram.com/reel/DWHMCjKDKea/) (19.2K views). Category: visual.

## The rule

Make the gap inside a group smaller than the gap between groups. That contrast is the whole trick: the eye reads distance as relationship, so spacing does the grouping and borders, boxes and dividers become optional.

## Key insights

- Proximity is a Gestalt principle: elements placed close together read as one group, elements spaced apart read as separate. The eye infers relationships from distance alone.
- You rarely need borders, boxes or dividers to create structure. Spacing does the grouping by itself.
- The trick is contrast: make the gap within a group smaller than the gap between groups. Equal spacing everywhere flattens the hierarchy and everything reads as one undifferentiated block.
- In forms, tighten related fields (about 12px) and open up section breaks (about 40px) so Personal Info and Payment visibly separate without a single line.
- In toolbars and nav, group controls by function (navigate, actions, system) instead of laying them out in one evenly spaced row.
- Same content, more clarity: a flat list of eight sidebar links becomes scannable the moment it is split into labelled groups like Dashboard, Management and Account.

## Do / Don't

- **Do:** keep spacing within a group tighter than the spacing between groups.
- **Do:** group form fields and nav items by function or meaning.
- **Do:** let whitespace carry the grouping before reaching for borders or dividers.
- **Don't:** space every element equally; it erases hierarchy and forces users to parse everything at once.
- **Don't:** reach for boxes and dividers when a larger gap would communicate the same grouping.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Chaos vs Clear | 12 grey squares in a flat grid vs three labelled rows (Navigation, Content, Commerce). "One rule." |
| 2 | 6s | Proximity, even | Six purple squares evenly spaced. Close = related. Far = separate. |
| 3 | 9s | Proximity, grouped | Two groups of three, 32px apart, each underlined "Related". Your brain processes this before you read. |
| 4 | 13.5s | Secret 01: Navigation | Eight icons equally spaced. |
| 5 | 18s | Grouped by function | Navigate, Actions, System in purple, cyan, green. |
| 6 | 21s | Grouped, labelled | 8px inside, 32px between. Same items. Instant clarity. |
| 7 | 25.5s | Secret 02: Forms | Personal Info and Payment separated by spacing only: 12px within, 40px between. Zero dividers. Just spacing. |
| 8 | 36s | Dashboard Sidebar | Before: eight flat links. After: Dashboard, Management, Account groups. Same links. Different clarity. |
| 9 | 49.5s | Outro | One rule. Zero design degree. Follow @designmotionhq. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="px">
  <form class="px-form" id="checkout">
    <div class="px-form__section">
      <div class="px-form__head">Personal Info</div>
      <div class="px-field"><label>Full Name</label><input></div>
      <div class="px-field"><label>Email Address</label><input></div>
    </div>
    <div class="px-form__section">
      <div class="px-form__head">Payment</div>
      <div class="px-field"><label>Card Number</label><input></div>
    </div>
  </form>
</div>
<script type="module">
  import { setProximity, groupBy } from './pattern.js';
  setProximity(document.getElementById('checkout'), 12, 40);   // gap within, gap between
</script>
```

`setProximity(el, within, between)` writes the two spacing tokens (`--px-within`, `--px-between`) any `.px-` component uses. `groupBy(container, groups, kind)` wraps flat `.px-nav__item` or `.px-side__item` children into labelled groups; `ungroup` flattens them again. `proximityRatio(el)` returns between / within so you can check a layout has enough contrast.

## Where it belongs

Forms, toolbars, sidebars, settings lists, card grids: anywhere a flat run of equal items needs structure. Reach for spacing first; add a divider only when the gap alone cannot carry it.
