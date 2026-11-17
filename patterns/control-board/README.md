# Control Board

> One rail, one head, four tiles, a two thirds and one third split, then the table.

Lifted from the Code XR admin dashboard in the reel by code.xr (https://www.instagram.com/reel/DfT_DWgzb9H/, Insta batch 6 Nov 2026, card 13). Byron asked for its layout in every dashboard: "how it maximises space and has things split up so it's easy to see and also only has what the user really has to see". He did not want its glass: "I like the look of our current ones, just the layout we steal". Not one of the @designmotionhq set. Category: layout.

## The rule

Take the skeleton and leave the skin. Every page of every dashboard is the same stack in the same order, so nothing has to be learnt twice, the screen is full edge to edge, and anything not needed to decide something is not on it.

## The skeleton

- **Rail.** Fixed, about 224px. Pages sorted into small labelled groups. A count appears only when something waits. One small status block at the very bottom.
- **Top bar.** One slim row, about 54px. Search or location on the left, status and tools on the right.
- **Well.** One scrolling area. The rail and top bar never move.
- **Head.** The page's name, one line under it saying what needs attention, at most two actions on the right.
- **Tiles.** Four across. Each is a number, what it is, and one line of context. A delta pill only when the change matters.
- **Split.** Two thirds for the main chart, one third for the thing that explains it. The chart's own range or filter sits inside its card header.
- **Table or cards last.** Status tabs with counts inside them, the action at the end of each row.

Pages can reorder tiles and split (a money page leads with tiles, a home page can lead with the chart), but they never add a new kind of block.

## Key insights

- **One rhythm beats a clever layout.** Overview, Finance, Moderation and Announcements in the reel all use the same grid, so the eye knows where to look on a page it has never seen.
- **Density comes from small gaps, not small text.** 12px gaps and 13 to 15px padding fill the screen while the numbers stay large.
- **Context lines do the explaining.** "oldest sent 6 h ago" and "2 overdue" turn a number into a decision and remove the need for a detail page.
- **Counts on the rail are the to do list.** A badge only shows when there is something to act on.

## Do / Don't

- **Do:** take every colour, font, radius and motion from the host through the `--bd-*` tokens.
- **Do:** give one tile the lead (`.bd-v.lead`), as `de-ai-dashboard` says.
- **Do:** name the page; never greet the user in the title.
- **Do:** cut anything nobody decides from. If a block fails that test, delete it rather than shrink it.
- **Don't:** add blur, glass, gradients or shadows. None of that was asked for.
- **Don't:** copy the reel's coloured icon circles on tiles; the number is the hero.
- **Don't:** go past two actions in the head, or four tiles in a row.
- **Don't:** leave a split with one empty side. `.bd-split:has(> [hidden])` closes it up.

## Use it

1. Copy `pattern.css` into the project's own CSS and map the `--bd-*` tokens to the project's colours (no new palette).
2. Rebuild each page on the stack above. Keep every existing element id so the page's script carries on working.
3. Check 1440 wide, 1100, and 390 on a phone. On a phone the rail becomes a sticky strip under the top bar and the page scrolls as one.
4. Check loading, empty, stale and error states. A number that cannot be trusted says so in the head.

Worked example: Money Maker, `C:\Desk\desk\static\index.html`, `bot.html`, `board.css`, `desk.js`, screenshots in `C:\Desk\docs\board-pilot\`.

## Lives beside

`de-ai-dashboard` for what to strip, `number-formatting` and `charts-that-lie` for what goes in the tiles and charts, `data-table-system` for the table, `empty-states` and `loading-states-system` for the states.
