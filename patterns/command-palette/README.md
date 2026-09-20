# Command Palette

> ⌘K is a system, not a search box.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/command-palette](https://www.designmotionhq.com/patterns/command-palette) · [Instagram](https://www.instagram.com/reel/DZruKB6N1X0/) (49.3K views). Category: interaction.

## The rule

A command palette is fuzzy, grouped, keyboard driven, never empty, async in place and nested with a breadcrumb: "stg" finds Settings, results sit in labelled sections, arrows move and Enter runs, recents fill the blank state, long commands spin inline, and Esc walks back exactly one level.

## Key insights

- Use fuzzy matching, not exact substring search: typing "stg" should still surface "Settings", "Storage", and "Staging". Exact matching returns nothing and feels broken.
- Group results into labeled sections (Recent, Actions, Pages) so a long flat list becomes scannable structure instead of an undifferentiated wall.
- Make it fully keyboard-driven: arrows move the highlight, Enter runs the selected command, Esc closes. Never force the user back to the mouse.
- Never open to a blank void. Prefill recent or suggested commands so people have a starting point before they type a single character.
- For async commands, show an inline spinner and keep the palette open. Load results in place rather than freezing the whole screen.
- Support nested commands: one command can drill into a sub-menu with a breadcrumb, and Esc walks back exactly one level.

## Do / Don't

- **Do:** match queries as fuzzy subsequences so "stg" still finds "Settings".
- **Do:** prefill recent and suggested commands so the palette opens with something to act on.
- **Do:** drive everything from the keyboard: arrows to move, Enter to run, Esc to go back.
- **Don't:** require exact substring matches; "stg" ≠ "Settings" leaves users staring at "No results".
- **Don't:** open to a blank "No results" void with nothing to select.
- **Don't:** freeze the whole screen while an async command loads instead of spinning inline.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | ⌘K. Type. Jump anywhere. | ⌘ + K keycaps, "stg" typed, Settings / Storage / Staging deploy / Settings docs. |
| 2 | 3s | Fuzzy matching | "stg" highlights s-t-g inside Settings, Storage, Staging; "stg → Settings". "Type less, find more." |
| 3 | 9s | Fuzzy matching (exact vs fuzzy) | Exact match: No results, "stg" ≠ "Settings". Fuzzy match: three hits. "Match the intent, not the string." |
| 4 | 12s | Group your results | Flat list → Grouped: Recent, Actions, Pages sections. "Structure makes it fast." |
| 5 | 16.5s | Hands off the mouse | ↑ ↓ Enter Esc keys; Open settings highlighted. "Arrows move. Enter runs." |
| 6 | 19.5s | Hands off the mouse (down) | ↓ lit, highlight moves to New document. |
| 7 | 22.5s | Hands off the mouse (Esc) | Esc lit, palette fades out. "Escape closes." |
| 8 | 25.5s | Empty state | Blank void ("No results · Type to search") beside Recent commands. "Give people a starting point." |
| 9 | 33s | Async commands | "switch" → Switch project… with an inline spinner; "Spinner inline — palette stays open." |
| 10 | 35s | Async commands (loaded) | 3 projects load in place: marketing-site, design-system, api-gateway. "Results load in place." |
| 11 | 37.5s | Async commands (frozen screen) | Same palette beside a red "Frozen screen · Whole app blocked". "Spin inline, never freeze the screen." |
| 12 | 40.5s | Nested commands | Open settings, Change theme ›, Notifications ›. "One command opens another." |
| 13 | 42s | Nested commands (drilled in) | Breadcrumb chip "Change theme ›", Light / Dark / System. |
| 14 | 45s | Nested commands (Esc) | "Esc back one level" returns to the parent list with Change theme highlighted. "Escape walks back one level." |
| 15 | 48s | Outro | "follow" → Follow @designmotionhq, Save this reel. Follow for more UI systems. Save. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="cm">
  <div class="cm-pal" id="palette"><div class="cm-pal__in"></div><div class="cm-list"></div></div>
</div>
<script type="module">
  import { CommandPalette, bindHotkey, fuzzy } from './pattern.js';
  const palette = CommandPalette(document.getElementById('palette'), {
    commands: [
      { id: 'settings', label: 'Open settings', icon: 'i-gear', group: 'Actions', kbd: '⌘ ,' },
      { id: 'theme', label: 'Change theme', icon: 'i-palette', group: 'Actions', children: [{ id: 'dark', label: 'Dark', icon: 'i-moon' }] },
      { id: 'switch', label: 'Switch project…', icon: 'i-branch', group: 'Actions', run: () => api.projects() },   // async: spins inline, results load in place
      { id: 'profile', label: 'Profile page', icon: 'i-user', group: 'Pages' },
    ],
    recent: ['settings', 'theme'],                     // prefilled when the query is empty
    onRun: cmd => router.go(cmd.id),
  });
  bindHotkey(() => { palette.render(); palette.focus(); });
</script>
```

`fuzzy(query, text)` returns the matched indexes or null; `score` ranks tighter, earlier matches first; `highlight` wraps the hits in `<mark>`. `groupResults` puts Recent first, then each `group` in order. `CommandPalette` renders into the `.cm-pal`, handles typing, arrows, Enter, Backspace and Esc (one level back, then `cm:close`), drills into `children`, and awaits `run()` with an inline spinner. `bindHotkey` wires ⌘K / Ctrl+K.

## Where it belongs

Any app with more than a handful of destinations or actions: dashboards, editors, admin tools, docs sites. Not a replacement for primary navigation, and not for a single search box over one collection.
