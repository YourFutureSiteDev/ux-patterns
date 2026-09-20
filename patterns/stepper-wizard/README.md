# Stepper Wizard

> Twelve fields, one wall. Four steps, one path.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/stepper-wizard](https://www.designmotionhq.com/patterns/stepper-wizard) · [Instagram](https://www.instagram.com/reel/DYzSokhRAXG/) (57.2K views). Category: forms.

## The rule

Chunk a long form into steps grouped by meaning, show progress, validate inside each step so Next stays blocked until the step is valid, and persist every field so Back and Refresh never lose what was typed.

## Key insights

- Chunk long forms into small groups. Three fields read effortlessly, but twelve in a row trigger scroll fatigue. Splitting the flow lowers cognitive load before it breaks it.
- Group fields by context, not by count: Personal, Shipping, Payment, Review. Each step should earn its own screen; splits made on an arbitrary number feel random.
- Always show progress. Pick one indicator (a linear bar, numbered dots, or step labels) so users can feel the end getting close.
- Validate inside each step, not at the end. A bad email on step one shouldn't surface on step four; block the Next button while a field is still invalid.
- Prefer inline errors over final-screen rejection. An immediate red message beats bouncing users all the way back after they thought they were finished.
- Persist state on every step change. Back navigation and a page refresh must preserve entered data. Lose the form once and you lose the user.

## Do / Don't

- **Do:** split forms into steps grouped by meaning like Personal, Payment or Review, not by an arbitrary field count.
- **Do:** show a progress indicator and validate each field within its own step.
- **Do:** save entered data so Back and Refresh never wipe the user's progress.
- **Don't:** surface a step-one error only once the user reaches the final step.
- **Don't:** let a refresh or the Back button discard everything already typed.
- **Don't:** stack twelve fields into one scrolling wall when they can be chunked into steps.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Twelve fields, one wall. | A fading 12-field Checkout wall over a Step 1 of 4 card (25%, Personal). "Four steps, one path." |
| 2 | 3s | 01 · Chunking | Effortless 3 fields (18%), Fatigue 12 fields (95%), Chunked 4 × 3 fields (42%). "Chunking lowers cognitive load." |
| 3 | 12s | 02 · Progress | Linear bar, numbered dots, step labels at Step 2 / 4 (45%), then Step 4 / 4 (94%). "Users need to feel the end is close." |
| 4 | 21s | 03 · Boundaries | Personal, Shipping, Payment, Review cards, each its own screen, Review "Ready to submit". |
| 5 | 30s | 04 · Validation | Inline · instant (Next blocked until valid) vs Final · too late ("Email invalid on step 1 — go back"). |
| 6 | 42s | 05 · State | Back + Refresh keep Payment step 3 filled: localStorage.wizardState = { step, fields }. |
| 7 | 48s | Outro | Stepper wizard 4 / 4 all done. Follow for more UX systems. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<form class="sw" id="wiz">
  <div class="sw-bar" id="bar"><span>Step 1 of 4</span><b>25%</b></div><div class="sw-bar__track"><div class="sw-bar__fill"></div></div>
  <div class="sw-dots" id="dots"><span class="sw-dot"><span>1</span></span><i class="sw-dots__line"></i>…</div>
  <section class="sw-step"><div class="sw-field" id="emailField"><input name="email" type="email"></div><div class="sw-error" id="emailErr">…</div></section>
  <section class="sw-step">…</section>
  <button type="button" class="sw-btn" id="back">Back</button><button type="button" class="sw-btn sw-btn--next" id="next">Next</button>
</form>
<script type="module">
  import { Wizard, StepValidator } from './pattern.js';
  const email = StepValidator(emailField, { input: emailField.querySelector('input'), error: emailErr, test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) });
  Wizard(wiz, { bar: bar.parentElement, dots, next, back, storageKey: 'checkout', validate: (i) => i !== 0 || email.valid });
</script>
```

`Wizard` shows one `.sw-step` at a time, drives the bar, dots and labels, disables Next while `validate(step)` fails, and persists every field to storage under `storageKey` so Back and Refresh restore it. `StepValidator` gives a field its inline red state and message. `WizardState` is the storage layer on its own.

## Where it belongs

Checkout, signup, onboarding, any form longer than about five fields. Group by meaning, never by count; a three-field form stays one screen.
