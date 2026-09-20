# Chat UI System

> Same thread. Half the noise. Six decisions make a chat UI read.

Rebuilt from the @designmotionhq reel. Source: [Instagram](https://www.instagram.com/reel/DdWFVgYNYRB/) (40.6K views). Category: content.

## The rule

A chat thread is a system of six decisions, not a list of bubbles: group the same sender inside a two-minute window, show time only where it carries information, land the bubble before the request, never move the reader's viewport, put typing in the message flow, and cap the composer at five lines with attachments above.

## Key insights

- Same sender inside a 2 min window shares one avatar: 4 px between lines inside a group, 16 px between groups. The thread reads 43 % shorter with the same content (13 avatars become 6).
- Precision on demand: a divider on date change ("Yesterday", "Today"), the exact time only on hover. Timestamps on every row are noise.
- The bubble lands first. Enter renders the message in the list on the keypress (0 frames), the server confirms +12 frames later with a quiet "Sent". Zero spinners.
- When a send fails, the message stays in place with "Not sent · Retry" on the row. Retry stays on the message, not in a toast.
- The list does not jump: when the reader has scrolled up, new messages arrive with 0 px shift and a "3 new messages" pill; at the bottom the list follows.
- Typing lives in the flow as the next group (avatar + dots), so the real message replaces it with 0 px moved. Not a "Sam is typing..." bar above the composer.
- Composer: grows to five lines, then scrolls. Enter sends, Shift + Enter adds a line, attachments stack above the text.

## Do / Don't

- **Do:** collapse consecutive messages from one sender into a group with a single avatar and name.
- **Do:** show the exact time on hover and a divider when the date changes.
- **Do:** append the outgoing message optimistically and keep the retry control on the failed row.
- **Do:** hold the scroll position when the reader is above the bottom, and offer a pill to jump down.
- **Don't:** repeat the avatar, name and timestamp on every line.
- **Don't:** show a spinner on send or a typing bar above the composer.
- **Don't:** let the composer grow past five lines or push attachments below the text.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Chat UI is a system · 01 | Naive thread: 13 avatars, a bubble and timestamp per message. |
| 2 | 3s | 01 · 6 decisions | Same thread grouped with dividers: 13 avatars become 6. |
| 3 | 4.5s | Same sender, one avatar · 02 | Four bubbles from two senders, grouping window 2 min, inside 4 px, between 16 px. |
| 4 | 9s | 02 · measured | Grouped: 4 px / 4 px / 16 px callouts, 43 % shorter, one group / new group on the timeline. |
| 5 | 13.5s | Precision on demand · 03 | No dividers, no times. |
| 6 | 18s | 03 · hover | Yesterday / Today dividers, exact time on hover with cursor. |
| 7 | 22.5s | The bubble lands first · 04 | Composer focused with a draft; Enter → Bubble in list → Sent strip at keypress. |
| 8 | 24s | 04 · sent | Message in the list with "Sent", strip complete (0 f, +12 f), 0 spinners. |
| 9 | 28.5s | 04 · failed | "Can you review PR 412?" outlined pink, Not sent · Retry stays on the message. |
| 10 | 33s | The list does not jump · 05 | Scrolled up, scrollbar with new-message marks. |
| 11 | 36s | 05 · pill | 0 px shift line at the anchor, "3 new messages" pill. |
| 12 | 39s | 05 · follow | At bottom, the list follows the new messages. |
| 13 | 42s | Typing lives in the flow · 06 | Sam Okafor group with three dots, "next message lands here". |
| 14 | 48s | 06 · landed | Real message replaces the dots, 0 px moved. Struck-through "Sam is typing..." bar. |
| 15 | 51s | Five lines, then it scrolls · 07 | Composer at three lines with line numbers, Enter send, Shift + Enter new line. |
| 16 | 57s | 07 · attachment | spec-v3.pdf above the text, five lines, then scroll. |
| 17 | 60s | Six decisions · 08 | Grid of the six decisions above a mini thread. |
| 18 | 63s | Think like a senior UX designer | Claude Code palette: /ux-design, /ux-audit, /ux-review, /restyle. |
| 19 | 66s | Palette filtered | "/ux-d" typed, first command highlighted. |
| 20 | 72s | UX Engine outro | Claude Code plugin card, Link in bio. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="cu">
  <div class="cu-panel" style="position:static;height:600px">
    <div class="cu-list cu-list--scroll" id="list"></div>
    <div class="cu-composer" id="composer"><div class="cu-attachments"></div>
      <div class="cu-composer__row"><div class="cu-gutter"></div><textarea rows="1" placeholder="Message #design"></textarea></div>
      <div class="cu-composer__bar"><span class="cu-kbd">Enter</span><span class="cu-hint">send</span><button class="cu-send">…</button></div></div>
  </div>
</div>
<script type="module">
  import { renderThread, Composer, ScrollAnchor, optimisticSend, TypingIndicator } from './pattern.js';
  const list = document.getElementById('list'), messages = [/* { id, sender, initials, day, time, text } */];
  renderThread(list, messages, { timestamps: 'hover' });
  const anchor = ScrollAnchor(list, pillEl);
  Composer(document.getElementById('composer'), { maxLines: 5, onSend: text => {
    const after = anchor.hold();
    optimisticSend(list, messages, { id: crypto.randomUUID(), sender: 'You', initials: 'YO', day: 'today', time: '10:49', text },
      () => fetch('/api/send', { method: 'POST', body: text }).then(r => { if (!r.ok) throw r; }), { timestamps: 'hover' }).then(after);
  } });
</script>
```

`groupMessages` applies the 2 min window and date dividers; `renderThread` draws groups, hover times and Sent / Not sent · Retry states; `optimisticSend` appends first and reconciles after; `ScrollAnchor.hold()` returns the function that restores the viewport (0 px shift) or follows; `TypingIndicator(list, sender).show()/resolve(msg)` keeps typing in the flow; `Composer` handles Enter / Shift + Enter, the five-line cap and attachments above.

## Where it belongs

Team chat, support inboxes, comment threads, DM screens, any message list with a composer. Not for single-shot forms or notification feeds without replies.
