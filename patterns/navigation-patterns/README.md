# Navigation Patterns

> Five nav patterns, one system: mobile = tabs, desktop = sidebar.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/navigation-patterns](https://www.designmotionhq.com/patterns/navigation-patterns) · [Instagram](https://www.instagram.com/reel/DXyrs2YN9iS/) (13.8K views). Category: navigation.

## The rule

Choose navigation by platform and depth, not taste. Bottom tabs on mobile (3-5 destinations, always visible), a persistent sidebar on desktop (5+ sections, never collapsed by default), a hamburger only for secondary links on mobile, a command palette as an accelerator next to visible nav, and breadcrumbs only when the hierarchy runs deeper than two levels.

## Key insights

- Bottom tabs are the mobile default: 3-5 top destinations, always visible and within thumb reach. Burying those same links in a hamburger drops engagement ~40%.
- A persistent sidebar is the desktop answer for hierarchical content with 5+ sections. Keep it in view; collapsing it by default kills discoverability.
- The hamburger is secondary navigation, never primary. Acceptable on mobile, but hiding the menu on desktop drops engagement ~56%.
- A command palette (Cmd K) is a search-driven accelerator for power users. Pair it with visible nav, because new users don't know it exists.
- Breadcrumbs only earn their space when the hierarchy runs deeper than 2 levels; on flat structures they add noise instead of orientation.
- Choose by platform and depth, not taste. The whole set is one system, not five interchangeable options.

## Do / Don't

- **Do:** match the pattern to the platform: bottom tabs on mobile, a persistent sidebar on desktop.
- **Do:** keep primary destinations visible: 3-5 for tabs, 5+ sections to justify a sidebar.
- **Do:** reserve breadcrumbs for hierarchies deeper than two levels.
- **Don't:** hide primary navigation in a hamburger; engagement drops 40-56%.
- **Don't:** make a command palette the only path to a feature; new users won't discover it.
- **Don't:** add breadcrumbs to a flat structure where they're just visual noise.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | 5 nav patterns | Collage of all five components. "Pick wrong, lose users." |
| 2 | 3s | 01 / 05 Bottom tabs | Phone with Home, Search, Library, Profile tabs. Rule: 3-5 destinations · mobile only · always visible. Avoid: hidden in a hamburger drops engagement 40%. |
| 3 | 12s | 02 / 05 Persistent sidebar | Acme app with six-section sidebar and dashboard grid. Rule: persistent · desktop · 5+ sections. Avoid: collapsed by default kills discoverability. |
| 4 | 21s | 03 / 05 Hidden menu | Account screen with hamburger and the open drawer (Profile, Settings, Billing, Notifications, Help center, Sign out). Rule: mobile only · secondary navigation. Avoid: desktop hamburger drops engagement 56%. |
| 5 | 30s | 04 / 05 Command palette | "Type a command" with ⌘ K, four commands, Open settings active. Rule: power users · Cmd K · search-driven. Avoid: new users don't know it exists. |
| 6 | 40.5s | 05 / 05 Breadcrumbs | Workspace › Projects › Acme › Dashboard over a page. Rule: hierarchy depth > 2 levels. Avoid: flat structure breadcrumbs add noise. |
| 7 | 51s | Outro | 5 patterns · 1 system. Mobile = tabs. Desktop = sidebar. Five chips and the save CTA. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="nv">
  <nav class="nv-tabs" id="tabs">
    <button class="nv-tab is-active" data-id="home">Home</button>
    <button class="nv-tab" data-id="search">Search</button>
    <button class="nv-tab" data-id="library">Library</button>
    <button class="nv-tab" data-id="profile">Profile</button>
  </nav>
  <div class="nv-palette" id="palette">
    <div class="nv-palette__search"><input class="nv-palette__input" placeholder="Type a command"><span class="nv-kbd">⌘ K</span></div>
    <div class="nv-palette__list"><button class="nv-cmd">Search project files</button><button class="nv-cmd">Open settings</button></div>
  </div>
  <ol class="nv-crumbs" id="crumbs"></ol>
</div>
<script type="module">
  import { BottomTabs, Sidebar, Drawer, CommandPalette, Breadcrumbs, chooseNavigation } from './pattern.js';
  BottomTabs(document.getElementById('tabs'), { onChange: id => router.go(id) });
  CommandPalette(document.getElementById('palette'), { onRun: cmd => run(cmd.textContent) });
  Breadcrumbs(document.getElementById('crumbs'), [{ label: 'Workspace' }, { label: 'Projects' }, { label: 'Acme' }, { label: 'Dashboard' }], { chip: 2 });
  chooseNavigation({ platform: 'mobile', destinations: 4, depth: 3 }); // { primary: 'bottom-tabs', secondary: ['breadcrumbs'] }
</script>
```

`BottomTabs` and `Sidebar` manage the active item (click and arrow keys). `Drawer(drawerEl, toggleBtn)` opens and closes the hamburger panel (Escape closes). `CommandPalette` filters on input, moves with arrows, runs on Enter, and opens on Cmd/Ctrl K unless `hotkey: false`. `Breadcrumbs` renders the trail and hides itself when it is two levels or fewer. `chooseNavigation` applies the rule.

## Where it belongs

Any app shell. Tabs on phones, a sidebar on desktop, a drawer only for the leftovers, a palette for the people who already know the product, breadcrumbs once you are three levels deep.
