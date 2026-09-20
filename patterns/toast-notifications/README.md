# Toast Notifications

> Toasts done right: five rules for notifications that inform without blocking.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/toast-notifications](https://www.designmotionhq.com/patterns/toast-notifications) · [Instagram](https://www.instagram.com/reel/DXRpZTTMr9a/) (31.2K views). Category: feedback.

## The rule

Anchor toasts bottom-right on desktop and top on mobile, never the centre. Time them by severity (4s info, 7s warning, errors until acknowledged), show at most three, always give a way out, and pair every colour with an icon and accent border.

## Key insights

- Position deliberately: bottom-right on desktop, top edge on mobile. The screen centre is off-limits: it covers the content users are actively working on and blocks clicks.
- Match dismiss timing to severity: routine info auto-dismisses in ~4s, warnings hold ~7s, and critical errors stay until the user acknowledges them.
- Cap the stack at 3 visible toasts: newest enters at the bottom, older ones float up and out, and the rest queue. Spring motion keeps the shuffle readable.
- Always give a way out: a close button on desktop, swipe-to-dismiss on mobile, and a timer that pauses on hover so people can finish reading.
- Colour-code by type (info, success, warning, error) but never rely on colour alone: pair each with an icon and accent border, since ~6% of users can't tell the colours apart.

## Do / Don't

- **Do:** Anchor toasts bottom-right on desktop and to the top edge on mobile
- **Do:** Pause the auto-dismiss countdown while the user hovers so they have time to read
- **Do:** Reinforce each type's colour with a matching icon and left accent border
- **Don't:** Place toasts in the screen centre, where they block the content users are working on
- **Don't:** Auto-dismiss critical errors; hold them until the user acknowledges
- **Don't:** Show more than three toasts at once; queue the rest instead of piling them up

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Toasts done right. | "Payment received" then "New message" slide in with accent borders and icons. |
| 2 | 3s | Rule 01 · Position | Desktop window with a toast bottom-right (✓ Desktop · Bottom-right), phone with a toast at the top (✓ Mobile · Top). |
| 3 | 3s | Rule 01 · Centre | A pink-outlined window with "Blocks content" in the middle. "✕ Center · Blocks content". "Center blocks what users are actually doing." |
| 4 | 10s | Rule 02 · Timing | File uploaded (4S · AUTO-DISMISS), Session expiring (7S · HOLDS LONGER), Payment failed (∞ · UNTIL ACKNOWLEDGED), each with a draining bar. |
| 5 | 18s | Rule 03 · Stacking | Five toasts pushed in turn; newest at the bottom, older float up and shrink, the fourth pushes the oldest out. DAMPING: 20, STIFFNESS: 180, MAX 3 VISIBLE. |
| 6 | 27s | Rule 04 · Dismissible | Close button (CLICK), Swipe to dismiss (SWIPE), Hover to pause (HOVER) with a timer bar that freezes under the cursor. |
| 7 | 36s | Rule 05 · Color coding | Info, success, warning, error toasts; the colour drains away to show "6% of users can't tell them apart". |

The "Five rules. Zero excuses." outro is a plain follow CTA with no toast in it, so it is not rebuilt.

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="tn"><div id="toasts" class="tn-stack" style="position:fixed"></div></div>
<script type="module">
  import { ToastStack, placeStack } from './pattern.js';
  const stack = ToastStack(document.getElementById('toasts'), { max: 3 });
  placeStack(document.getElementById('toasts'));           // bottom-right on desktop, top on mobile
  stack.push({ type: 'success', title: 'Saved to drafts', sub: 'Changes auto-backed up' });   // 4s
  stack.push({ type: 'warning', title: 'Quota almost up', sub: '92% of plan used' });         // 7s
  stack.push({ type: 'error',   title: 'Connection lost', sub: 'Retrying in 5 seconds' });    // stays until closed
</script>
```

`ToastStack` owns the rules: `DURATIONS` by type (override per call with `duration`), a max of three visible with the rest queued, newest at the bottom, close button, swipe-to-dismiss (pointer drag past 80px), and a countdown that pauses on hover and resumes on leave. `Toast(opts)` builds a single toast element; `placeStack` picks the anchor.

## Where it belongs

Confirmations, background progress, warnings and errors that should not interrupt the task. Never in the centre of the screen, never for anything that needs a decision (use a dialog), and never more than three at once.
