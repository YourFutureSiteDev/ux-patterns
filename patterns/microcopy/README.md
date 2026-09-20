# Microcopy

> Same form. Different words. One converts.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/microcopy](https://www.designmotionhq.com/patterns/microcopy) · [Instagram](https://www.instagram.com/reel/DaU4BxwtF5N/) (138K views). Category: content.

## The rule

The words on a control carry as much weight as its layout. Label the button with the reward, turn every error into a next step, fill empty states with the first action, keep the field label pinned, and write like a person.

## Key insights

- Button labels should name the reward, not the mechanic. "Create my free account" feels like a gift; "Submit" feels like a chore. Same action, different conversion.
- Turn errors into help. "Invalid input" tells the user nothing; "That email's taken, want to log in?" names the problem and offers the next move.
- Empty states are onboarding, not dead ends. Instead of a blank inbox, show the first step the user can take right now.
- Placeholder text is not a label. It vanishes the moment they start typing, leaving fields unidentified. Keep a persistent label above or on the input.
- Write like a person. No real human says "operation failed". Match the tone a helpful colleague would use.
- Copy carries as much weight as layout: labels, errors, empty states and tone shape whether the interface feels usable or hostile.

## Do / Don't

- **Do:** label actions with the reward the user gets ("Create my free account"), not the system verb.
- **Do:** turn error messages into a next step ("That email's taken, want to log in?").
- **Do:** fill empty states with the first useful action, not a blank screen.
- **Don't:** rely on placeholder text as a stand-in for a persistent field label.
- **Don't:** ship system-speak like "Invalid input" or "operation failed".

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Same form. One word. | Two sign-up cards: "Submit" converts 19%, "Create my free account" converts 91%. "The words convert." |
| 2 | 3s | Labels: chore | Pink "Submit" button. "last thing they read before committing". Make it the payoff, + conversion. |
| 3 | 7.5s | Labels: promise | Teal "Create my free account" button, same hint in teal. |
| 4 | 13.5s | Error messages: walk away | Email field with pink border, "Invalid input". A detour, not a dead end. |
| 5 | 18s | Error messages: hand the fix | Teal border, "That email's taken — want to log in?" with the link. |
| 6 | 24s | Empty states: blank | Inbox card with three ghost lines and nothing else. Teach the first action. |
| 7 | 27s | Empty states: first step | Inbox icon, "No messages yet", Compose button. |
| 8 | 33s | Placeholders: not a label | "Date of birth" placeholder replaced by "01 / 09 / 1990" as it is typed; "the question vanished the moment they typed". |
| 9 | 39s | Placeholders: a kept label | Same value with "Date of birth" floating on the border; "the question stays put". |
| 10 | 42s | Tone of voice: system | SYSTEM card, mono "ERROR: operation failed". Words carry the brand. |
| 11 | 45s | Tone of voice: your brand | YOUR BRAND card "Hmm, that didn't go through — try again?" and the BRAND VOICE meter filling. |
| 12 | 51s | Outro | Words ship conversion. Create my free account, Follow for more UX writing, Save this for your next form. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="mc">
  <div class="mc-field" id="email">
    <div class="mc-field__label">Email address</div>
    <div class="mc-field__input">you@example.com</div>
    <div class="mc-field__msg"></div>
  </div>
  <div class="mc-inbox" id="inbox"><div class="mc-inbox__head">Inbox</div></div>
</div>
<script type="module">
  import { FieldError, EmptyState, KeptLabel, humanize } from './pattern.js';
  FieldError(document.getElementById('email'), { message: "That email's taken", fix: { text: 'want to log in?', href: '/login' } });
  EmptyState(document.getElementById('inbox'), { title: 'No messages yet', action: 'Compose', onAction: () => location.href = '/compose' });
  console.log(humanize('ERROR: operation failed')); // "Hmm, that didn't go through — try again?"
</script>
```

`FieldError(field, { message, fix })` names the problem and appends the fix as a link (no fix = pink error state). `EmptyState(container, { title, action, onAction })` replaces ghost rows with an icon, a plain title and one button. `KeptLabel(field, { text })` lifts the placeholder into a floating label. `ConversionMeter(root, { value })` drives the hook's bars. `humanize(msg)` maps system-speak to brand voice. `typeInto(el, text)` is the typing helper.

## Where it belongs

Every button label, inline error, empty screen, field label and toast in a product. Not a component so much as a rule for the words inside every other component.
