// De-AI Dashboard: one dashboard, five "AI tells", each toggled off by a state flag.
// Usage: const d = Dashboard(el, { gradient: true, icons: true }); d.set({ gradient: false });
// Flags (all booleans unless noted):
//   gradient  tell 1: purple gradient header, purple button, purple chart fill  -> off = one flat accent
//   icons     tell 2: coloured icon tile on every stat card                      -> off = the number is the hero
//   hero      tell 3: one primary revenue card + three secondary                 -> on  = one primary, three secondary
//   shadows   tell 4: drop shadow on every panel                                  -> off = shadow only on what floats
//   menu      tell 4: the one thing that floats (a dropdown) gets the shadow
//   title     tell 5: 'welcome' ("Welcome back, Jordan") or 'revenue' ("Revenue · Aug 1 to Aug 31, 2026")
//   shape     tell 5: sparkline + "+12.5% vs Jul" and plain deltas instead of four identical green badges
//   compact   shorter header (the later frames of the reel use it)

export const DEFAULT_STATE = { gradient: false, icons: false, hero: false, shadows: false, menu: false, title: 'welcome', shape: false, compact: false };
let uid = 0;

const ICONS = {
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  bars: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/>',
  dollar: '<path d="M12 2v20M17 6.5H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
  pulse: '<path d="M2 12h4l3-8 4 16 3-8h6"/>',
  up: '<path d="m3 15 5-5 4 4 8-8M14 6h6v6"/>',
  dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  filter: '<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>'
};
const svg = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

// Chart line: a rising wave across a 549 x 60 box.
export const CHART_PATH = 'M0 48C10 44 18 40 30 42S52 55 64 52 84 34 100 34 126 46 142 46 166 30 182 28 210 40 226 42 250 28 266 26 292 40 308 40 334 26 350 26 372 42 386 40 406 18 426 16 448 28 462 28 484 16 500 14 520 20 532 18 544 6 549 4';
export const SPARK_PATH = 'M2 36c6 0 10-8 16-6s6 8 12 6 6-14 12-12 6 8 12 4 6-10 12-8 8 6 14 2 6-12 12-10 8 6 12 2 6-10 12-8 6 6 12 2 4-8 10-6';

const STATS = [
  { label: 'Revenue', value: '$48,250', icon: 'dollar', tint: 'blue' },
  { label: 'Active users', value: '2,340', icon: 'users', tint: 'green' },
  { label: 'Conversion', value: '3.8%', icon: 'trend', tint: 'purple' },
  { label: 'Churn', value: '1.2%', icon: 'pulse', tint: 'orange' }
];
const DELTAS = ['+3.1%', '+0.4 pt', '-0.2 pt'];
const ROWS = [
  ['MT', 'Maya Torres', 'Aug 30', '$1,240.00', 'Paid'],
  ['EB', 'Elias Brandt', 'Aug 29', '$86.00', 'Pending'],
  ['PN', 'Priya Nair', 'Aug 29', '$2,310.50', 'Paid'],
  ['TA', 'Tom Alder', 'Aug 28', '$412.00', 'Refunded']
];

const badge = (text = '+12.5%') => `<span class="dd-badge">${svg('up')}${text}</span>`;

function render(s, id) {
  const side = ['bolt', 'grid', 'bars', 'users', 'card', 'gear'].map((n, i) => `<span class="dd-side__ic${i === 1 ? ' is-on' : ''}">${svg(n)}</span>`).join('');
  const head = `<header class="dd-head">
    <b class="dd-head__title">Dashboard</b>
    <span class="dd-search">${svg('search')}Search anything</span>
    <span class="dd-bell">${svg('bell')}</span>
    <span class="dd-avatar">JR</span>
    <button class="dd-upgrade" type="button">Upgrade</button>
  </header>`;
  const welcome = s.title === 'revenue'
    ? `<div class="dd-welcome"><b>Revenue</b> · Aug 1 to Aug 31, 2026</div>`
    : `<div class="dd-welcome">Welcome back, Jordan <span class="dd-wave">👋</span></div>`;
  let stats;
  if (s.hero) {
    const [rev, ...rest] = STATS;
    stats = `<div class="dd-grid dd-grid--hero">
      <div class="dd-card dd-hero">
        <div class="dd-card__label">${rev.label}</div>
        <div class="dd-hero__value">${rev.value}</div>
        ${s.shape ? `<svg class="dd-spark" viewBox="0 0 116 40"><path d="${SPARK_PATH}"/><circle cx="112" cy="6" r="3"/></svg><div class="dd-hero__delta">+12.5% vs Jul</div>` : badge('+12.5% from last month')}
        <div class="dd-hero__split"><div><span>Subscriptions</span><b>$41,900</b></div><div><span>One-time</span><b>$6,350</b></div></div>
      </div>
      <div class="dd-col">${rest.map((c, i) => `<div class="dd-card dd-mini"><div class="dd-card__label">${c.label}</div><div class="dd-mini__value">${c.value}</div>${s.shape ? `<span class="dd-delta">${DELTAS[i]}</span>` : badge()}</div>`).join('')}</div>
    </div>`;
  } else {
    stats = `<div class="dd-grid">${STATS.map(c => `<div class="dd-card dd-stat${s.icons ? ' has-icon' : ''}">
      ${s.icons ? `<span class="dd-tile dd-tile--${c.tint}">${svg(c.icon)}</span>` : ''}
      <div class="dd-card__label">${c.label}</div>
      <div class="dd-stat__value">${c.value}</div>
      ${badge()}
    </div>`).join('')}</div>`;
  }
  const chart = `<div class="dd-card dd-chart">
    <div class="dd-chart__head"><b>Daily revenue</b><span class="dd-range"><i>7d</i><i class="is-on">30d</i><i>90d</i></span></div>
    <svg class="dd-chart__plot" viewBox="0 0 549 60" preserveAspectRatio="none">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4ff5" stop-opacity=".75"/><stop offset="1" stop-color="#6b4ff5" stop-opacity="0"/></linearGradient></defs>
      <path class="dd-chart__grid" d="M0 12H549M0 30H549M0 47H549"/>
      <path class="dd-chart__fill" fill="url(#${id})" d="${CHART_PATH}V60H0Z"/>
      <path class="dd-chart__line" d="${CHART_PATH}"/>
    </svg>
    <div class="dd-chart__axis"><span>Aug 1</span><span>Aug 15</span><span>Aug 30</span></div>
  </div>`;
  const rows = ROWS.map(r => `<div class="dd-row"><span class="dd-row__av">${r[0]}</span><span class="dd-row__name">${r[1]}</span><span class="dd-row__date">${r[2]}</span><span class="dd-row__amt">${r[3]}</span><span class="dd-chip${r[4] === 'Paid' ? ' is-paid' : ''}">${r[4]}</span></div>`).join('');
  const menu = s.menu ? `<div class="dd-menu"><div class="is-on">${svg('download')}Export</div><div>${svg('filter')}Filter</div><div>${svg('share')}Share</div></div>` : '';
  const table = `<div class="dd-card dd-table"><div class="dd-table__head"><b>Recent transactions</b><span class="dd-more">${svg('dots')}</span></div>${rows}${menu}</div>`;
  return `<aside class="dd-side">${side}</aside><main class="dd-main">${head}${welcome}${stats}${chart}${table}</main>`;
}

export function Dashboard(root, state = {}) {
  let s = { ...DEFAULT_STATE, ...state };
  const id = `dd-fill-${++uid}`;
  const paint = () => {
    root.classList.add('dd-dash');
    root.classList.toggle('is-gradient', !!s.gradient);
    root.classList.toggle('is-shadows', !!s.shadows);
    root.classList.toggle('is-compact', !!s.compact);
    root.innerHTML = render(s, id);
  };
  paint();
  return { get state() { return s; }, set(patch) { s = { ...s, ...patch }; paint(); }, root };
}

// Parse a data-state string like "gradient icons compact title=revenue" into a state object.
export function parseState(str = '') {
  const out = {};
  for (const tok of str.split(/\s+/).filter(Boolean)) {
    const [k, v] = tok.split('=');
    out[k] = v === undefined ? true : (v === 'true' ? true : v === 'false' ? false : v);
  }
  return out;
}

// Mount every [data-dashboard] element on the page from its data-state.
export function mountAll(scope = document) {
  return [...scope.querySelectorAll('[data-dashboard]')].map(el => Dashboard(el, parseState(el.dataset.state)));
}
