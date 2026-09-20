// Command palette: fuzzy subsequence matching, grouped results, keyboard driven, prefilled with recents,
// async commands that spin inline, and nested commands with a breadcrumb that Esc walks back one level.

// Fuzzy subsequence match: returns the matched character indexes ("stg" in "Settings" → [0,2,5]) or null.
export function fuzzy(query, text) {
  const q = query.toLowerCase(), t = text.toLowerCase(); const idx = []; let j = 0;
  for (let i = 0; i < t.length && j < q.length; i++) if (t[i] === q[j]) { idx.push(i); j++; }
  return j === q.length ? idx : null;
}
// Score: earlier and tighter matches rank higher; a word-start hit is a bonus.
export function score(query, text) { const m = fuzzy(query, text); if (!m) return -1; const spread = m[m.length - 1] - m[0]; return 100 - spread - m[0] * 2 + (m[0] === 0 ? 10 : 0); }
export const highlight = (text, idx) => [...text].map((ch, i) => idx && idx.includes(i) ? `<mark>${ch}</mark>` : ch).join('');

// Group a flat list of commands into labelled sections (Recent first, then by cmd.group in first-seen order).
export function groupResults(cmds, recentIds = []) {
  const groups = new Map(); if (recentIds.length) groups.set('Recent', cmds.filter(c => recentIds.includes(c.id)));
  for (const c of cmds) { if (recentIds.includes(c.id)) continue; const g = c.group || 'Commands'; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(c); }
  return [...groups].filter(([, list]) => list.length);
}

// Mount a palette on a .cm-pal element. opts: { commands, recent, onRun, placeholder }
// Commands: { id, label, icon, group, kbd, children?: [...], run?: () => Promise<[...]> } (run resolves to child commands loaded async)
export function CommandPalette(root, opts = {}) {
  const input = root.querySelector('.cm-pal__in'), list = root.querySelector('.cm-list');
  let query = '', stack = [], cursor = 0, loading = null, items = [];
  const icon = name => name ? `<svg><use href="#${name}"/></svg>` : '';
  const kbd = k => k ? `<span class="cm-kbd">${k.split(' ').map(x => `<i>${x}</i>`).join('')}</span>` : '';
  const level = () => stack.length ? stack[stack.length - 1].children : opts.commands;
  function render() {
    const q = query.trim();
    const pool = level() || [];
    const scored = q ? pool.map(c => ({ c, s: score(q, c.label) })).filter(x => x.s >= 0).sort((a, b) => b.s - a.s).map(x => x.c) : pool;
    const groups = q || stack.length ? [['', scored]] : groupResults(scored, opts.recent || []);   // prefill: recents first when the query is empty
    items = groups.flatMap(([, l]) => l); cursor = Math.min(cursor, Math.max(0, items.length - 1));
    const crumbs = stack.map(s => `<span class="cm-crumb">${s.label}<svg viewBox="0 0 24 24" fill="none"><use href="#i-chev"/></svg></span>`).join('');
    input.innerHTML = `<svg><use href="#i-search"/></svg>${crumbs}<span${q ? '' : ' class="cm-ph"'}>${q || opts.placeholder || 'Type a command or search...'}</span><i class="cm-caret"></i>`;
    if (!items.length) { list.innerHTML = `<div class="cm-empty"><svg><use href="#i-x-circle"/></svg><b>No results</b><span>Try fewer letters</span></div>`; return; }
    let i = 0;
    list.innerHTML = groups.map(([g, l]) => (g ? `<div class="cm-group">${g}</div>` : '') + l.map(c => { const k = i++; const m = q ? fuzzy(q, c.label) : null;
      const tail = loading === c ? '<span class="cm-spin"></span>' : c.children || c.run ? '<svg class="cm-chev"><use href="#i-chev"/></svg>' : kbd(c.kbd);
      return `<div class="cm-item${k === cursor ? ' is-on' : ''}" data-i="${k}">${icon(c.icon)}<span>${highlight(c.label, m)}</span>${tail}</div>`; }).join('')).join('');
  }
  async function run(c) {
    if (c.children) { stack.push(c); query = ''; cursor = 0; render(); return; }
    if (c.run) { loading = c; render(); const kids = await c.run(); loading = null; stack.push({ ...c, children: kids }); query = ''; cursor = 0; render(); return; }   // async: spin inline, keep the palette open
    opts.onRun && opts.onRun(c); root.dispatchEvent(new CustomEvent('cm:run', { detail: c }));
  }
  root.tabIndex = 0;
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { cursor = (cursor + 1) % items.length; render(); }
    else if (e.key === 'ArrowUp') { cursor = (cursor - 1 + items.length) % items.length; render(); }
    else if (e.key === 'Enter') { if (items[cursor]) run(items[cursor]); }
    else if (e.key === 'Escape') { if (stack.length) { stack.pop(); render(); } else root.dispatchEvent(new CustomEvent('cm:close')); }   // Esc walks back exactly one level
    else if (e.key === 'Backspace') { query = query.slice(0, -1); render(); }
    else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) { query += e.key; cursor = 0; render(); }
    else return; e.preventDefault();
  });
  list.addEventListener('click', e => { const el = e.target.closest('.cm-item'); if (el) run(items[Number(el.dataset.i)]); });
  return { render, run, get query() { return query; }, set query(v) { query = v; cursor = 0; render(); }, get depth() { return stack.length; }, focus: () => root.focus() };
}

// Global ⌘K / Ctrl+K opener.
export function bindHotkey(open) { document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); } }); }
