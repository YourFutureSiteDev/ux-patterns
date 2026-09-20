# Copy to Clipboard

> Copy needs proof.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DcS6-2ltaLc/) (56.8K views). Category: feedback. Instagram-only reel: the insights and do/don't below are derived from the on-screen copy.

## The rule

A "Copied" button is a promise about the clipboard. Prove it: flip to a check the same frame the click lands, fade back after two seconds so the next copy signals again, copy the raw value rather than the formatted span, announce it through a live region, and on insecure origins fall back to execCommand instead of showing a check over an empty clipboard.

## Key insights

- A copy that shows "Copied" but pastes nothing is worse than no button: the hook shows the paste target receiving 0 characters while the button glows green.
- Instant feedback: flip to a check on the same frame. A spinner that waits 480 ms then confirms reads as slow for an action that is already done.
- Auto reset: hold the confirmed state for about two seconds, then fade back. A button stuck on "Copied" forever cannot signal a second copy.
- Clean value: copy the raw string. Copying the formatted span drags a newline and a non-breaking space onto the clipboard and the CLI fails with "parse error: newline".
- Screen readers: a `<div>Copied</div>` swap is silence to assistive tech. Write the confirmation into an `aria-live="polite"` region so it is announced.
- Insecure origin: on `http://` the async Clipboard API throws NotAllowedError. Wrap it in try/catch and fall back to `execCommand('copy')`, or the button lies.

## Do / Don't

- **Do:** swap the icon to a check synchronously on click, then reconcile if the write fails.
- **Do:** reset to the idle state after roughly two seconds.
- **Do:** copy the value from data, not from the DOM's rendered text.
- **Do:** announce "Copied to clipboard" in a polite live region.
- **Do:** fall back to execCommand when navigator.clipboard is unavailable or rejects.
- **Don't:** show a spinner for a clipboard write.
- **Don't:** leave the button on "Copied" indefinitely.
- **Don't:** show a check when the clipboard write was refused.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | Settings page copies an API key, the paste box receives nothing, "clipboard: 0 bytes", "You pasted nothing." |
| 2 | 3.5s | Instant feedback | Spinner card counts to 192 ms while the Instant card waits at 0 ms. |
| 3 | 3.5s | Instant feedback (done) | Spinner confirms at 480 ms; Instant confirms on the same frame. |
| 4 | 9s | Auto reset (holding) | Check with a countdown ring, "Holding · 0.6s". |
| 5 | 9s | Auto reset (reset) | Button fades back to Copy; "Stuck forever: no signal" vs "Reset in 2s: signals again". |
| 6 | 9s | Auto reset (copied again) | Second copy signals again. |
| 7 | 18s | Clean value (formatted span) | Formatted span copies a newline and a space; CLI says "parse error: newline". BREAKS. |
| 8 | 18s | Clean value (raw) | Raw value copies clean; CLI says "authenticated". WORKS. |
| 9 | 27s | Screen readers (silence) | `<div>Copied</div>` gives "(silence)"; the live region is still "waiting…". |
| 10 | 27s | Screen readers (announced) | `aria-live="polite"` speaks "Copied to clipboard" with a waveform. |
| 11 | 36s | Insecure origin (lies) | No fallback: check shown, 0 bytes, NotAllowedError. LIES. |
| 12 | 36s | Insecure origin (honest) | try/catch falls back to execCommand: "API blocked, execCommand copied". |
| 13 | 43s | Outro | Copy needs proof: the five rules, designmotionhq.com, Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="cb">
  <button class="cb-btn" id="copy">
    <span class="cb-btn__idle"><svg>…copy…</svg>Copy</span>
    <span class="cb-btn__done"><svg>…check…</svg>Copied</span>
  </button>
</div>
<script type="module">
  import { CopyButton } from './pattern.js';
  CopyButton(document.getElementById('copy'), { text: () => apiKey, resetAfter: 2000 });
</script>
```

`CopyButton` flips `.is-copied` on the click frame, writes the raw string with `copyText` (Clipboard API, execCommand fallback), announces through `announce()`'s shared polite live region, resets after `resetAfter` ms, and reverts the check if the write was refused (events `cb:copied`, `cb:failed`). `ResetRing(root).set(elapsedMs, totalMs)` drives the countdown ring.

## Where it belongs

API keys, invite links, share URLs, code snippets, wallet addresses, one-time codes: any value the user will paste somewhere else and needs to trust was actually copied.
