# Notification System

> Notifications are a system. Pick the wrong surface and users tune out.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/notification-system](https://www.designmotionhq.com/patterns/notification-system) · [Instagram](https://www.instagram.com/reel/DY4MoMjtBhP/) (18K views). Category: feedback.

## The rule

One message, four surfaces: toast, banner, modal, badge. The trigger's severity picks the volume, persistence is part of the contract (toasts auto-dismiss with undo, banners stay until cleared, modals block until answered, badges sit quietly until cleared), and blocking dialogs never queue.

## Key insights

- A notification isn't one component, it's a system of four surfaces: toast, banner, modal and badge. The same content can be delivered at four different volumes.
- The trigger picks the volume. Let the event's severity decide the surface: a low-priority "new message" fits a toast, a degraded-service warning a banner, a blocking "card declined" error a modal, and a passive unread count a badge.
- Persistence is part of the contract. Toasts auto-dismiss in a few seconds (and should offer undo), banners stay until manually cleared, modals block until the user acts, and badges sit quietly until the count is resolved.
- Stack behaviour separates good from broken. Several toasts can stack and breathe; several modals become a trainwreck. Blocking dialogs must never queue on top of each other.
- Over-escalating backfires: route everything to the loudest surface and you get zero attention, because users learn to tune the noise out.

## Do / Don't

- **Do:** map each notification's severity to the surface that matches it: toast, banner, modal or badge.
- **Do:** let toasts auto-dismiss with an undo affordance, and reserve modals for actions that genuinely must block.
- **Do:** stack low-priority notifications so they breathe instead of piling up on screen.
- **Don't:** route every alert to the most intrusive surface; over-escalation trains users to ignore all of them.
- **Don't:** queue multiple modals on top of each other; blocking dialogs stacked together are a trainwreck.
- **Don't:** use a blocking modal for a low-severity, purely informational message.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Hook | A dashboard dimmed behind a "Payment failed" modal (Cancel / Try another card). |
| 2 | 3s | Four surfaces | Same content, four volumes: New message toast, Server v2.4 degraded banner, Card declined modal, bell badge 3. |
| 3 | 10.5s | Four surfaces (caption) | Banner cleared. "Pick the volume that matches the message." |
| 4 | 12s | Severity → Surface | Four triggers routed to four surfaces: New message, Server degraded, Card declined, 3 unread comments. |
| 5 | 21s | Severity → Surface (later) | Toast lands, modal answered, badge stays. "Severity picks the surface". |
| 6 | 24s | Lifecycle | Auto-dismiss (4s · undo), Manual (click ✕), Blocking (requires action), Quiet (until cleared): 3 unread. |
| 7 | 31.5s | Lifecycle (cleared) | Badge cleared. "Persistence is part of the contract." |
| 8 | 36s | Stack behavior | 3 toasts stacked · breathe vs 3 modals trainwreck, "Users bail." |
| 9 | 43.5s | Stack behavior (verdict) | "Wrong surface = zero attention." |
| 10 | 46.5s | Outro | The four surfaces in miniature, "Follow for more UI systems.", save this for your next dashboard. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="nsy">
  <div id="toasts"></div><div id="banner"></div><div id="modal"></div>
  <span class="nsy-bell"><svg>…bell…</svg><span class="nsy-bell__count" id="badge"></span></span>
</div>
<script type="module">
  import { Notifier, pickSurface } from './pattern.js';
  const n = Notifier({ toastRoot: toasts, bannerRoot: banner, modalRoot: modal, badgeEl: badge });
  n.notify({ severity: 'info', title: 'New message', body: 'Sarah Chen sent you a file.' });       // toast, auto-dismiss
  n.notify({ severity: 'warning', title: 'Server v2.4 degraded', body: 'Latency above 2s.' });   // banner, until cleared
  n.notify({ severity: 'error', title: 'Card declined', body: 'Card ending 4242. Use another?', confirm: 'Try again' }); // modal, blocks
  n.notify({ severity: 'passive', count: 3 });                                                  // badge, quiet
  pickSurface({ severity: 'warning' });   // 'banner'
</script>
```

`pickSurface` maps severity to a surface. `Notifier` routes each notification with the right persistence: toasts auto-dismiss (with undo) and stack up to three, banners stay until the ✕, a modal blocks and a second modal is refused while one is open, badges count up until `clearBadge()`.

## Where it belongs

Any product with more than one kind of event: chat and file activity in toasts, service health in banners, payment and destructive confirmations in modals, unread counts in badges. Never every event in a modal.
