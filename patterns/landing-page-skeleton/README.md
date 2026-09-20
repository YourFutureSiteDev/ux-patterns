# Landing Page Skeleton

> Every landing page that converts follows the same 5-section skeleton.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/landing-page-skeleton](https://www.designmotionhq.com/patterns/landing-page-skeleton). Category: content.

## The rule

Five sections in a fixed order: Hero, Proof, Problem, Solution, CTA. The hero answers what, who and why in three seconds; proof sits directly under it; the problem is agitated before the cure; the solution is at most three outcomes; the final CTA repeats the hero's button exactly.

## Key insights

- The skeleton is five sections in a fixed order: Hero, Proof, Problem, Solution, CTA. High-converting pages all map to it.
- The hero has to answer three questions in ~3 seconds: what you offer, who it's for, and why they should care. Headline + subhead + one CTA, nothing more.
- Put social proof right after the hero, not buried at the bottom. Visitors decide whether to trust you almost immediately. Logos, one testimonial, one hard number.
- Agitate the problem before pitching the solution. No felt pain means no reason to care about the cure, so name the real cost in time, money and frustration.
- Sell outcomes, not features: cap it at three benefits and frame each as a result. "Save 10 hours a week" beats "advanced automation."
- Repeat the exact same CTA at the top and bottom, same colour, same copy. Repetition converts the scroller who wasn't ready the first time.

## Do / Don't

- **Do:** lead the hero with a headline, subhead, and a single clear call to action.
- **Do:** place proof (logos, testimonials, a key metric) directly below the hero.
- **Do:** frame benefits as concrete outcomes and keep them to three max.
- **Don't:** use carousels or sliders in the hero; they hide the one message that matters.
- **Don't:** bury social proof at the bottom of the page where nobody scrolls to it.
- **Don't:** jump straight to the solution before establishing the pain it solves.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Broken LP? The 5-section fix. | Phone skeleton with five numbered sections. |
| 2 | 3s | 1 Hero | "3 seconds to answer 3 things": WHAT do you offer? WHO is it for? WHY should I care? |
| 3 | 6s | Hero anatomy, mobile | New chip, Headline, Subhead, CTA "Start free →", visual placeholder, tags. |
| 4 | 10.5s | Hero anatomy, desktop | Same hero, copy left, visual right. |
| 5 | 15s | 2 Proof | "Right after the hero. Not at the bottom." Trusted by LUMEN, VERTEX, NORTH✦, ACME, FLOW. |
| 6 | 19.5s | Proof | Testimonial (Sarah M., Vertex), "Teams shipping with us 2,847", DO THIS / NOT THIS. |
| 7 | 27s | 3 Problem | "Agitate the pain before the cure." 3 weeks, 8,400 $, 12 rounds. |
| 8 | 30s | Problem | "No pain felt → No care given". |
| 9 | 33s | 4 Solution, features | Advanced automation, AI-driven personalization, Enterprise-grade tooling (dimmed). |
| 10 | 37.5s | Solution, outcomes | Save 10 hours a week, 2x your conversion rate, Ship in a single day. Rule of 3. |
| 11 | 40.5s | 5 Final CTA | Page skeleton in a browser: Hero, Proof, Problem, Solution, Ready to ship? |
| 12 | 43.5s | Same button. Top and bottom. | "Start free →" in the hero and under the final CTA, linked. |
| 13 | 46.5s | Repetition | "Repetition isn't lazy. It's conversion." |
| 14 | 49.5s | Outro | @designmotionhq, Follow for more, Save for your next LP. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="lp">
  <div class="lp-hero" id="hero" style="position:static"></div>
  <div class="lp-pains" id="pains" style="position:static"></div>
  <div class="lp-benefits" id="benefits" style="position:static"></div>
</div>
<script type="module">
  import { lintSkeleton, renderHero, renderPains, renderBenefits, countUp } from './pattern.js';
  const page = {
    hero: { headline: 'Ship landing pages\nin minutes.', subhead: 'For devs who ship. 2,800+ teams trust us.', cta: 'Start free →' },
    proof: { logos: ['LUMEN', 'VERTEX'], quote: 'Cut our launch time in half.', metric: 2847 },
    problem: [{ value: '3', unit: 'weeks', label: 'to ship a homepage', tone: 'pink' }],
    solution: [{ label: 'Save 10 hours a week' }, { label: '2x your conversion rate' }, { label: 'Ship in a single day' }],
    cta: { label: 'Start free →' },
  };
  console.log(lintSkeleton(page));               // [] when the page follows the skeleton
  renderHero(document.getElementById('hero'), page.hero, { layout: 'desktop', tags: false });
  renderPains(document.getElementById('pains'), page.problem);
  renderBenefits(document.getElementById('benefits'), page.solution);
</script>
```

`lintSkeleton(spec)` lists every rule the page breaks (order, missing hero answers, carousel in the hero, no proof, no problem, more than three benefits, feature-speak, final CTA that differs from the hero's). `renderHero` draws the annotated hero in mobile or desktop layout, `LayoutToggle` switches it, `renderPains` and `renderBenefits` draw the problem and solution rows (`renderBenefits` throws past three), `countUp` animates the proof number.

## Where it belongs

Product landing pages, launch pages, pricing entry points, any page whose job is one conversion. Not for documentation, dashboards or content sites with many equal goals.
