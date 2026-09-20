# UX Patterns: where files go

The @designmotionhq UX pattern library (76+ reel breakdowns from
designmotionhq.com/patterns, plus newer Instagram-only reels) rebuilt as
hand-written HTML/CSS/JS components, a deployed gallery, and the Claude skill
`ux-patterns` that picks the right ones for whatever design module is being
built. Public repo `YourFutureSiteDev/ux-patterns`.

| Folder | Contents |
|---|---|
| `source/` | Scraped breakdowns (`patterns.json`, one `.md` per pattern), the mp4s and contact sheets. **mp4s and frames are gitignored: they are designmotionhq's work.** |
| `patterns/<slug>/` | One folder per pattern: `demo.html`, `pattern.css`, `pattern.js`, `README.md` (rule, do/don't, source link). Our own code, committed. |
| `site/` | The gallery, static, deployed to Cloudflare Pages. |
| `skill/` | The `ux-patterns` skill source; symlinked/copied into `~/.claude/skills/ux-patterns`. |

## The landing rule

Anything produced or downloaded for this project moves into this folder in the
same session it is made. Not Downloads, not a scratch directory.

Never commit the source videos or frames. Credit designmotionhq by pattern name
and link in every README. Components are our own implementation of the idea,
not a copy of their assets.
