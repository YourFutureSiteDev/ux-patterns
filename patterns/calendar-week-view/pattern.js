// Calendar week view: six layout rules that make a week read at a glance.
// 1 grid + now line, 2 colour stripe not fill, 3 overlaps share the hour side by side,
// 4 height is duration (min one line), 5 drag draws with a 15 min snap, 6 all-day lives in a pinned row.
// Events: { id, title, day (0..6), start, end (decimal hours), cal: 'work'|'personal'|'team', allDay?: true }

export const SNAP = 0.25;                                     // 15 minutes
export const snap = h => Math.round(h / SNAP) * SNAP;
export const fmt = h => { const m = Math.round((h % 1) * 60), hh = Math.floor(h) % 12 || 12; return `${hh}:${String(m).padStart(2, '0')}`; };
export const fmtDur = h => h >= 1 && h % 1 === 0 ? `${h} h` : `${Math.round(h * 60)} min`;

// Rule 3: events that share an hour are laid out in columns; each cluster splits its day's width evenly.
export function layoutDay(events) {
  const sorted = [...events].sort((a, b) => a.start - b.start || b.end - a.end);
  const out = []; let cluster = [], clusterEnd = -1;
  const flush = () => {
    const cols = [];                                         // greedy column assignment inside the cluster
    for (const e of cluster) { let c = cols.findIndex(end => end <= e.start); if (c < 0) { c = cols.length; cols.push(0); } cols[c] = e.end; e.col = c; }
    cluster.forEach(e => { e.cols = cols.length; out.push(e); }); cluster = [];
  };
  for (const e of sorted) { if (cluster.length && e.start >= clusterEnd) flush(); cluster.push(e); clusterEnd = Math.max(clusterEnd, e.end); }
  if (cluster.length) flush();
  return out;
}

// Rule 4: height is duration at `hourH` px an hour, never shorter than one title line (30 px at 60/h); under ~10 min it is a bar.
export function eventBox(e, { hourH = 60, from = 8, minLine = hourH / 2, bar = hourH / 10 } = {}) {
  const top = (e.start - from) * hourH, raw = (e.end - e.start) * hourH;
  const kind = raw < bar ? 'bar' : raw < minLine ? 'line' : 'box';
  return { top, height: kind === 'bar' ? 3 : Math.max(raw, minLine) - 1, kind };
}

// Render one week grid's contents (columns + events) as HTML. cfg: { days:[{label,num,dim,today}], events, hourH, from, to, now:{day,hour}, colW }
export function weekHTML(cfg) {
  const { days, events, hourH = 60, from = 8, to = 20, colW = 78, gutter = 0 } = cfg;
  const H = (to - from) * hourH; let html = '';
  for (let h = from; h <= to; h++) { const y = (h - from) * hourH, lab = h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`; html += `<div class="cw-hline" style="top:${y}px"></div>`; if (!(cfg.now && Math.abs(h - cfg.now.hour) < .6)) html += `<div class="cw-hlabel" style="top:${y}px">${lab}</div>`; }
  days.forEach((d, i) => {
    const x = gutter + days.slice(0, i).reduce((s, c) => s + (c.w ?? colW), 0), w = d.w ?? colW;
    html += `<div class="cw-col${d.dim ? ' is-dim' : ''}${d.today ? ' is-today' : ''}" style="left:${x}px;width:${w}px;height:${H}px">`;
    for (const e of layoutDay(events.filter(e => e.day === i && !e.allDay))) {
      const b = eventBox(e, { hourH, from }); const cw = (w - 6) / e.cols, left = 3 + e.col * cw;
      html += `<div class="cw-ev cw-ev--${e.cal} is-${b.kind}${cw < 40 ? ' is-narrow' : ''}${e.dim ? ' is-dim' : ''}${e.cls ? ' ' + e.cls : ''}" data-id="${e.id ?? ''}" style="top:${b.top}px;height:${b.height}px;left:${left}px;width:${cw - 2}px" title="${e.title}"><b>${e.title}</b>${e.time ? `<span>${fmt(e.start)} - ${fmt(e.end)}</span>` : ''}${e.badge ? `<i>${e.badge}</i>` : ''}</div>`;
    }
    if (cfg.now && cfg.now.day === i) { const y = (cfg.now.hour - from) * hourH; html += `<div class="cw-now" style="top:${y}px"></div>`; }
    html += '</div>';
  });
  if (cfg.now) { const y = (cfg.now.hour - from) * hourH; html += `<div class="cw-hlabel is-now" style="top:${y}px">${fmt(cfg.now.hour)}</div>`; }
  return html;
}

// Rule 5: drag on empty grid draws a new event, snapped to 15 min; only the bottom edge resizes.
export function DragCreate(gridEl, { hourH = 60, from = 8, onChange, onCommit } = {}) {
  let start = null, col = null, ghost = null;
  const hourAt = y => snap(from + y / hourH);
  gridEl.addEventListener('pointerdown', e => {
    col = e.target.closest('.cw-col'); if (!col || e.target.closest('.cw-ev')) return;
    const r = col.getBoundingClientRect(); start = hourAt(e.clientY - r.top);
    ghost = document.createElement('div'); ghost.className = 'cw-ev cw-ev--work is-ghost'; ghost.innerHTML = '<b></b>'; col.appendChild(ghost); col.setPointerCapture(e.pointerId);
    update(start + SNAP);
  });
  gridEl.addEventListener('pointermove', e => { if (!ghost) return; const r = col.getBoundingClientRect(); update(Math.max(start + SNAP, hourAt(e.clientY - r.top))); });
  gridEl.addEventListener('pointerup', () => { if (!ghost) return; const ev = { start, end: Number(ghost.dataset.end), title: 'New event' }; ghost.classList.remove('is-ghost'); ghost.innerHTML = `<b>New event</b><span>${fmt(start)} - ${fmt(ev.end)}</span>`; onCommit && onCommit(ev, ghost); ghost = null; });
  function update(end) { ghost.dataset.end = end; ghost.style.top = `${(start - from) * hourH}px`; ghost.style.height = `${(end - start) * hourH}px`; ghost.style.left = '3px'; ghost.style.right = '3px'; ghost.querySelector('b').textContent = `${fmt(start)} - ${fmt(end)}`; onChange && onChange({ start, end, dur: end - start }); }
}

// Contrast ratio helper for the "title on the fill" comparison (WCAG relative luminance).
export function contrast(hexA, hexB) {
  const lum = hex => { const c = hex.replace('#', '').match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const a = lum(hexA), b = lum(hexB); return ((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toFixed(1);
}
