# UX Patterns: live state

Started 20 Sep 2026. Every @designmotionhq reel rebuilt as an exact HTML/CSS/JS replica, a deployed gallery, and the `ux-patterns` Claude skill that routes a design module to the best few patterns.

## Done (20 Sep 2026)
- 112 patterns built and verified scene by scene against their source frames (`tools/shot.mjs`): 76 from the site breakdowns, 36 Instagram-only. 11 reels skipped on purpose (`source/skipped.json`).
- Gallery live at https://ux-patterns.yourfuturesitedev.workers.dev. Repo public at github.com/YourFutureSiteDev/ux-patterns.
- Skill installed at `~/.claude/skills/ux-patterns`, routed by `product-ui-module`, pushed to Claude-Skills.

## Known approximations (agents' own notes, all cosmetic)
- Emoji glyphs render in Windows Segoe rather than Apple's set; raster art (sunsets, product photos) is SVG/CSS stand-ins; a few unidentified caption fonts are matched with Space Grotesk or Poppins.
- Scenes shot mid-transition in the reel are frozen at the nearest fully drawn state.

## Next, when needed
- New reel: download with yt-dlp, add to `catalog.json` (see `source/build-catalog.mjs`), extract frames (`ffmpeg -vf fps=1/1.5`), build per `BUILDING.md`, verify, `node tools/build-site.mjs`, redeploy, push.
- Retheme rule for client work lives in the skill: port `pattern.css` rules into the project's own css, swap the tokens, never ship the reel palette.
