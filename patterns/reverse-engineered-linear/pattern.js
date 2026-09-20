// Reverse-Engineered Linear: five decisions that make an issue list feel expensive, as toggles.
//  density   13px text, 32px rows, letter-spacing -0.01em (14 rows in the viewport instead of 8)
//  borders   no shadows; three stacked surfaces + a 1px border at 8% white; hover changes the surface
//  oneColor  one brand colour (selected row + primary button); status and priority become grey icons
//  keyboard  every action prints its shortcut; hover in 80ms, transitions under 150ms, no overshoot
//  alignment 4px grid, 16px icons centred on the text line, labels left, numbers and dates right
// Usage: const app = IssueTracker(el, { decisions: { density: true } }); app.set('oneColor', true); app.applyAll();

export const ISSUES = [
  { id: 'NOR-140', title: 'Fix focus ring on command palette', status: 'progress', priority: 'high', label: 'Bug', who: 'SC', date: 'Sep 1' },
  { id: 'NOR-141', title: 'Migrate billing webhooks to v2', status: 'progress', priority: 'high', label: 'Infra', who: 'MK', date: 'Sep 1' },
  { id: 'NOR-142', title: 'Empty state for archived projects', status: 'todo', priority: 'medium', label: 'Design', who: 'JR', date: 'Sep 2', selected: true },
  { id: 'NOR-143', title: 'Keyboard shortcut cheat sheet', status: 'todo', priority: 'low', label: 'Feature', who: 'AL', date: 'Sep 2' },
  { id: 'NOR-144', title: 'Onboarding checklist drop-off', status: 'progress', priority: 'medium', label: 'Design', who: 'TP', date: 'Sep 3' },
  { id: 'NOR-145', title: 'Rate limit on search endpoint', status: 'todo', priority: 'high', label: 'Infra', who: 'MK', date: 'Sep 3' },
  { id: 'NOR-146', title: 'Dark mode contrast on badges', status: 'done', priority: 'medium', label: 'Bug', who: 'SC', date: 'Sep 4' },
  { id: 'NOR-147', title: 'Bulk edit for labels', status: 'todo', priority: 'low', label: 'Feature', who: 'AL', date: 'Sep 4' },
  { id: 'NOR-148', title: 'Sidebar collapse animation jank', status: 'progress', priority: 'medium', label: 'Bug', who: 'JR', date: 'Sep 5' },
  { id: 'NOR-149', title: 'Export issues to CSV', status: 'todo', priority: 'low', label: 'Feature', who: 'TP', date: 'Sep 5' },
  { id: 'NOR-150', title: 'Retry failed webhook deliveries', status: 'done', priority: 'high', label: 'Infra', who: 'MK', date: 'Sep 6' },
  { id: 'NOR-151', title: 'Mobile row height too tall', status: 'todo', priority: 'medium', label: 'Bug', who: 'SC', date: 'Sep 6' },
  { id: 'NOR-152', title: 'Snooze notifications', status: 'todo', priority: 'low', label: 'Feature', who: 'AL', date: 'Sep 7' },
  { id: 'NOR-153', title: 'Cycle burndown rounding bug', status: 'done', priority: 'medium', label: 'Bug', who: 'JR', date: 'Sep 7' },
];
export const DECISIONS = ['density', 'borders', 'oneColor', 'keyboard', 'alignment'];
const STATUS = { todo: 'Todo', progress: 'In progress', done: 'Done' };
const PRIORITY = { high: 'High', medium: 'Medium', low: 'Low' };

const ICONS = {
  status: { todo: '<circle cx="8" cy="8" r="6"/>', progress: '<circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2.2" fill="currentColor" stroke="none"/>', done: '<circle cx="8" cy="8" r="6"/><path d="M5.5 8l2 2 3.5-4"/>' },
  bars: { low: 1, medium: 2, high: 3 },
  inbox: '<path d="M2 9l2-6h8l2 6v4H2z"/><path d="M2 9h4l1 2h2l1-2h4"/>', user: '<circle cx="8" cy="5" r="3"/><path d="M2.5 14a5.5 5.5 0 0 1 11 0"/>',
  views: '<rect x="2" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><path d="M9 3h5M9 6h5M9 10h5M9 13h5"/>', projects: '<path d="M2 4h4l2 2h6v7H2z"/>', cycles: '<path d="M13 8a5 5 0 0 1-9 3M3 8a5 5 0 0 1 9-3M12 2v3H9M4 14v-3h3"/>',
  filter: '<path d="M2 3h12l-5 6v4l-2 1V9z"/>', display: '<path d="M2 4h12M2 8h12M2 12h12"/><circle cx="5" cy="4" r="1.5" fill="currentColor"/><circle cx="11" cy="8" r="1.5" fill="currentColor"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/>',
  list: '<rect x="2" y="3" width="12" height="4"/><rect x="2" y="9" width="12" height="4"/>', grid: '<rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/>', bell: '<path d="M4 11V7a4 4 0 0 1 8 0v4l1 1H3zM6.5 14h3"/>',
};
const svg = (body, cls = '') => `<svg class="rl-i ${cls}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const bars = n => `<span class="rl-bars" data-n="${n}"><i></i><i></i><i></i></span>`;

export function renderRow(it, d) {
  const status = d.oneColor ? svg(ICONS.status[it.status], 'rl-status') : `<span class="rl-pill rl-pill--${it.status}">${STATUS[it.status]}</span>`;
  const prio = d.oneColor ? bars(ICONS.bars[it.priority]) : `<span class="rl-prio rl-prio--${it.priority}">${PRIORITY[it.priority]}</span>`;
  return `<div class="rl-row${it.selected ? ' is-selected' : ''}" data-id="${it.id}">${status}${prio}<span class="rl-id">${it.id}</span><span class="rl-title">${it.title}</span><span class="rl-label rl-label--${it.label.toLowerCase()}">${it.label}</span><span class="rl-avatar">${it.who}</span><span class="rl-date">${it.date}</span></div>`;
}

export function IssueTracker(root, opts = {}) {
  const d = Object.fromEntries(DECISIONS.map(k => [k, !!(opts.decisions || {})[k]]));
  const issues = opts.issues || ISSUES;
  const render = () => {
    root.className = `rl-app ${DECISIONS.filter(k => d[k]).map(k => 'is-' + k).join(' ')}`;
    root.innerHTML = `
      <aside class="rl-side">
        <div class="rl-side__team"><b>N</b>Northstar<span class="rl-chev">⌄</span></div>
        <div class="rl-side__item">${svg(ICONS.inbox)}Inbox<span class="rl-side__count">3</span></div>
        <div class="rl-side__item">${svg(ICONS.user)}My issues</div>
        <div class="rl-side__item">${svg(ICONS.views)}Views</div>
        <div class="rl-side__item">${svg(ICONS.projects)}Projects</div>
        <div class="rl-side__item">${svg(ICONS.cycles)}Cycles</div>
        <div class="rl-side__head">Teams</div>
        <div class="rl-side__item rl-side__item--team"><i class="rl-dot"></i>Frontend<span class="rl-chev">⌄</span></div>
        <div class="rl-side__item rl-side__item--sub is-active">Issues</div>
        <div class="rl-side__item rl-side__item--sub">Backlog</div>
        <div class="rl-side__user"><span class="rl-avatar">SC</span>Sarah Chen</div>
      </aside>
      <main class="rl-main">
        <div class="rl-head"><b>Active issues</b><span class="rl-count">14</span><span class="rl-head__icons"><i class="is-on">${svg(ICONS.list)}</i><i>${svg(ICONS.grid)}</i><i>${svg(ICONS.bell)}</i></span></div>
        <div class="rl-tools"><button class="rl-btn">${svg(ICONS.filter)}Filter<kbd>F</kbd></button><button class="rl-btn">${svg(ICONS.display)}Display<kbd>D</kbd></button><button class="rl-btn rl-btn--primary"><span class="rl-plus">+</span>New issue<kbd>C</kbd></button></div>
        <div class="rl-list">${issues.map(it => renderRow(it, d)).join('')}</div>
      </main>`;
    root.dispatchEvent(new CustomEvent('rl:render', { detail: { ...d } }));
  };
  const api = {
    set(k, on = true) { d[k] = !!on; render(); return api; },
    applyAll() { DECISIONS.forEach(k => d[k] = true); render(); return api; },
    reset() { DECISIONS.forEach(k => d[k] = false); render(); return api; },
    hover(id) { root.querySelectorAll('.rl-row').forEach(r => r.classList.toggle('is-hover', r.dataset.id === id)); return api; },
    get decisions() { return { ...d }; },
    get count() { return DECISIONS.filter(k => d[k]).length; },
    el: root,
  };
  render();
  return api;
}

// Command palette that the keyboard decision opens on Cmd+K. Items carry their shortcut.
export const COMMANDS = [
  { name: 'Set priority', key: 'P' }, { name: 'Create issue', key: 'C' }, { name: 'Assign to me', key: 'I' },
  { name: 'Search', key: '⌘K' }, { name: 'Toggle sidebar', key: '⌘B' },
];
export function CommandPalette(root, opts = {}) {
  const q = opts.query ?? '';
  const render = query => {
    const ql = query.trim().toLowerCase();
    root.innerHTML = `<div class="rl-cmd__search"><svg class="rl-i" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg><span>${query}</span><i class="rl-caret"></i></div>` +
      COMMANDS.map(c => `<div class="rl-cmd__item${ql && !c.name.toLowerCase().includes(ql) ? ' is-dim' : ''}"><span>${c.name}</span><kbd>${c.key}</kbd></div>`).join('');
  };
  render(q);
  return { query: render };
}
