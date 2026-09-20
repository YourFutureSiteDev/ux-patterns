# UX Patterns: live state

Started 20 Sep 2026. Goal: every @designmotionhq reel rebuilt as an exact HTML/CSS/JS replica, a deployed gallery, and the `ux-patterns` Claude skill that routes a design module to the best few patterns.

## Done
- 106 Instagram posts inventoried (102 reels), 76 site pages scraped with insights and do/don'ts, 65 Instagram-only reels downloaded. `catalog.json` = 112 patterns (76 site + 36 Instagram-only); 11 reels skipped on purpose (`source/skipped.json`: promos, algorithm explainers, dark-pattern psychology).
- Frames every 1.5 s and 6x6 contact sheets for all 141 videos in `source/` (gitignored).
- Shared stage (`patterns/_shared/`), screenshot-vs-frame tool (`tools/shot.mjs`), gallery builder (`tools/build-site.mjs`), builder contract (`BUILDING.md`).
- Reference replica `patterns/optimistic-ui/` verified scene by scene.
- Skill source in `skill/SKILL.md` (routing table by module).

## In progress
- Patterns being built in batches of four by parallel agents (`tools/batches.json`, 28 batches). Each is verified with `node tools/shot.mjs <slug>` and its compare images before it counts.

## Next
- Install skill: copy `skill/` to `~/.claude/skills/ux-patterns/` and push the skills repo.
- `node tools/build-site.mjs` then `npx wrangler pages deploy site --project-name ux-patterns`.
- Push this repo to GitHub `YourFutureSiteDev/ux-patterns` (public; source media is gitignored).
- Register in the Desktop map and write the project memory.
