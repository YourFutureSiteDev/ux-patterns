// Chat UI system: six decisions that make a thread read.
// grouping (same sender inside a window = one avatar), timestamps (divider on date change, exact time on hover),
// optimistic send (bubble lands first), scroll anchoring (0 px shift, pill when scrolled up), typing in the flow,
// composer (max 5 lines, attachments above). All exports are plain DOM helpers, no framework.

export const GROUP_WINDOW = 120; // seconds: same sender within 2 min = same group

const toSec = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// messages: [{ id, sender, initials, day: 'yesterday'|'today', time: '10:42', text, status?: 'sent'|'failed' }]
// -> [{ type: 'divider', label }, { type: 'group', sender, initials, time, lines: [msg…] }]
export function groupMessages(messages, { window = GROUP_WINDOW, dividers = true, grouped = true } = {}) {
  const out = []; let day = null, group = null;
  for (const m of messages) {
    if (dividers && m.day !== day) { day = m.day; out.push({ type: 'divider', label: day }); group = null; }
    const sameGroup = grouped && group && group.sender === m.sender && toSec(m.time) * 60 - toSec(group.lastTime) * 60 <= window;
    if (sameGroup) { group.lines.push(m); group.lastTime = m.time; }
    else { group = { type: 'group', sender: m.sender, initials: m.initials, time: m.time, lastTime: m.time, lines: [m] }; out.push(group); }
  }
  return out;
}

// Render a thread into listEl. opts: grouped, dividers, timestamps ('always' | 'hover' | 'none'), bubbles, window
export function renderThread(listEl, messages, opts = {}) {
  const { timestamps = 'always', bubbles = false } = opts;
  const items = groupMessages(messages, opts);
  const html = items.map(it => {
    if (it.type === 'divider') return `<div class="cu-divider"><span>${esc(it.label)}</span></div>`;
    const lines = it.lines.map(m => {
      const status = m.status === 'sent' ? `<span class="cu-status">${ICON.check}Sent</span>` : '';
      const failed = m.status === 'failed';
      const text = failed ? `<span class="cu-failed">${esc(m.text)}</span>` : esc(m.text);
      const retry = failed ? `<div class="cu-retry">${ICON.alert}<span>Not sent</span><button class="cu-retry__btn" type="button" data-retry="${m.id}">${ICON.retry}Retry</button></div>` : '';
      const hoverTime = timestamps === 'hover' ? `<span class="cu-line__time">${esc(m.time)}</span>` : '';
      return `<div class="cu-line" data-id="${m.id}">${hoverTime}${bubbles ? `<span class="cu-bubble">${text}</span>` : text}${status}</div>${retry}`;
    }).join('');
    const time = timestamps === 'always' ? `<span class="cu-time">${esc(it.time)}</span>` : '';
    return `<div class="cu-group" data-sender="${esc(it.sender)}"><div class="cu-avatar">${esc(it.initials)}</div><div class="cu-body"><div class="cu-name">${esc(it.sender)}${time}</div>${lines}</div></div>`;
  }).join('');
  listEl.innerHTML = html;
  listEl.classList.toggle('cu-list--bubbles', bubbles);
  listEl.classList.toggle('cu-list--hover', timestamps === 'hover');
  return items;
}

// Optimistic send: the bubble lands in the list on keypress (0 frames), the request runs after. On failure the
// message stays in place with a Retry control; nothing spins.
export function optimisticSend(listEl, messages, msg, request, opts = {}) {
  const m = { status: 'pending', ...msg };
  messages.push(m); renderThread(listEl, messages, opts);
  listEl.dispatchEvent(new CustomEvent('cu:appended', { detail: m }));
  return Promise.resolve().then(request).then(() => { m.status = 'sent'; }, () => { m.status = 'failed'; })
    .then(() => { renderThread(listEl, messages, opts); listEl.dispatchEvent(new CustomEvent('cu:' + m.status, { detail: m })); return m; });
}

// Scroll anchoring: when the reader is at the bottom, follow new messages; when scrolled up, hold the viewport
// exactly where it is (0 px shift) and show a "N new messages" pill that jumps to the bottom on click.
export function ScrollAnchor(listEl, pillEl, opts = {}) {
  const threshold = opts.threshold ?? 24; let unread = 0;
  const atBottom = () => listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight <= threshold;
  const update = () => { pillEl.hidden = unread === 0; pillEl.querySelector('span').textContent = `${unread} new message${unread === 1 ? '' : 's'}`; };
  const follow = () => { listEl.scrollTop = listEl.scrollHeight; unread = 0; update(); };
  pillEl.addEventListener('click', follow);
  listEl.addEventListener('scroll', () => { if (atBottom() && unread) { unread = 0; update(); } listEl.dispatchEvent(new CustomEvent('cu:anchor', { detail: { atBottom: atBottom() } })); });
  return {
    // call before appending: returns a function to call after the DOM changed
    hold() {
      const wasAtBottom = atBottom(), fromBottom = listEl.scrollHeight - listEl.scrollTop;
      return () => { if (wasAtBottom) follow(); else { listEl.scrollTop = listEl.scrollHeight - fromBottom; unread++; update(); } };
    },
    follow, get unread() { return unread; }, atBottom,
  };
}

// Typing indicator lives in the message flow, as the next group, never as a bar above the composer.
// resolve(msg) swaps the dots for the real message in place (0 px moved).
export function TypingIndicator(listEl, sender) {
  const el = document.createElement('div'); el.className = 'cu-group cu-group--typing';
  el.innerHTML = `<div class="cu-avatar">${esc(sender.initials)}</div><div class="cu-body"><div class="cu-name">${esc(sender.name)}</div><div class="cu-dots"><i></i><i></i><i></i></div></div>`;
  return {
    show() { listEl.appendChild(el); return el; },
    hide() { el.remove(); },
    resolve(msg) {
      el.classList.remove('cu-group--typing');
      el.querySelector('.cu-name').insertAdjacentHTML('beforeend', `<span class="cu-time">${esc(msg.time)}</span>`);
      el.querySelector('.cu-dots').outerHTML = `<div class="cu-line">${esc(msg.text)}</div>`;
    },
  };
}

// Composer: Enter sends, Shift+Enter adds a line, grows to maxLines then scrolls, attachments stack above the text.
export function Composer(root, { maxLines = 5, lineHeight = 25, onSend } = {}) {
  const ta = root.querySelector('textarea'), gutter = root.querySelector('.cu-gutter'), sendBtn = root.querySelector('.cu-send');
  const grow = () => {
    const lines = Math.max(1, ta.value.split('\n').length);
    ta.style.height = Math.min(lines, maxLines) * lineHeight + 'px';
    ta.style.overflowY = lines > maxLines ? 'auto' : 'hidden';
    if (gutter) gutter.innerHTML = Array.from({ length: Math.min(lines, maxLines) }, (_, i) => `<i${i === Math.min(lines, maxLines) - 1 ? ' class="is-cur"' : ''}>${i + 1}</i>`).join('');
    root.classList.toggle('is-multiline', lines > 1);
    if (sendBtn) sendBtn.disabled = ta.value.trim() === '';
  };
  ta.addEventListener('input', grow);
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const v = ta.value.trim(); if (!v) return; ta.value = ''; grow(); onSend?.(v, this); }
  });
  ta.addEventListener('focus', () => root.classList.add('is-focused'));
  ta.addEventListener('blur', () => root.classList.remove('is-focused'));
  sendBtn?.addEventListener('click', () => { const v = ta.value.trim(); if (!v) return; ta.value = ''; grow(); onSend?.(v); });
  grow();
  return { grow, set(v) { ta.value = v; grow(); }, attach(name, size) { const a = root.querySelector('.cu-attachments'); if (!a) return; a.insertAdjacentHTML('beforeend', `<span class="cu-file">${ICON.file}<b>${esc(name)}</b><span>${esc(size)}</span><button type="button" aria-label="Remove">${ICON.x}</button></span>`); a.lastElementChild.querySelector('button').onclick = e => e.currentTarget.parentElement.remove(); } };
}

// Command palette filter for the outro (prefix match on the command).
export function filterCommands(items, query) {
  const q = query.trim().toLowerCase();
  return items.map(it => ({ ...it, match: !q || it.cmd.toLowerCase().startsWith(q) }));
}

export const ICON = {
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  alert: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
  retry: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v5h5"/></svg>',
  file: '<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
};
