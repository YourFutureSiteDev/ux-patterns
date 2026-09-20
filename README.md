# UX Patterns

112 UX patterns from [@designmotionhq](https://www.instagram.com/designmotionhq/), each rebuilt scene for scene as a working HTML, CSS and JavaScript component, plus a Claude Code skill that picks the right few for whatever you are building.

- `patterns/<slug>/` : `demo.html` (the reel, scene by scene, 720x1280), `pattern.css` (the component), `pattern.js` (the behaviour), `README.md` (the rule, insights, do/don't, where it belongs)
- `skill/SKILL.md` : the `ux-patterns` skill with the module-to-pattern routing table
- `catalog.json` : every pattern with category, hook, insights, do/don't and source links
- `tools/shot.mjs <slug>` : screenshots each scene beside its source frame, the verification every pattern passed
- `tools/build-site.mjs` : builds the gallery into `site/`

The written breakdowns are free at [designmotionhq.com/patterns](https://www.designmotionhq.com/patterns). This repo is our own implementation of each pattern; their videos and frames are not included.
