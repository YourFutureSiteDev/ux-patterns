// De-AI Landing Hero: one landing page (Lumen), five "AI tells", each swapped for the product by a state flag.
// Usage: const l = Landing(el, { headline: 'ai', blob: true }); l.set({ headline: 'plain' });
// State:
//   headline  'ai'   "Supercharge your workflow with AI", gradient, centred      tell 1
//             'plain' "Close the month in one afternoon." for small teams, left
//   blob      true = purple/pink gradient blob behind the hero                      tell 2
//   shot      true = product screenshot card beside the headline                    tell 2 fix
//   primary   'gradient' | 'green'   the first button                              tell 2/3
//   cta       primary button label ('Get started' | 'Start free')
//   secondary 'button' | 'link'      the second call to action                     tell 3
//   proof     'fake' ("Trusted by 10,000+ users" + logos) | 'quote' (Sarah Chen)   tell 4
//   features  'cards' (Fast / Secure / Easy) | 'product' (the Overview screen)     tell 5

export const DEFAULT_STATE = { headline: 'plain', blob: false, shot: false, primary: 'green', cta: 'Get started', secondary: 'button', proof: 'fake', features: 'cards' };
let uid = 0;

const I = {
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 10h.01M15 10h.01"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  list: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/>',
  sync: '<path d="M21 12a9 9 0 0 1-15.5 6.3M3 12a9 9 0 0 1 15.5-6.3M18 3v5h-5M6 21v-5h5"/>',
  bars: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
};
const svg = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;

export const CHART_IN = 'M0 46C8 44 14 40 22 42S34 50 44 48 56 36 70 36 90 46 104 46 120 32 136 30 156 40 170 42 190 28 206 26 226 36 240 36 262 22 276 22 296 34 310 32 326 16 344 16 362 26 372 26 390 10 410 8 428 18 440 16 458 6 470 4';
export const CHART_OUT = 'M0 52C10 52 16 50 26 51S40 56 50 55 62 50 72 50 88 54 100 54 116 48 130 48 150 52 164 52 184 46 200 46 220 50 234 50 252 44 268 44 290 48 304 48 322 42 340 42 360 46 372 46 392 40 410 40 430 44 444 44 460 38 470 38';

function hero(s) {
  const ai = s.headline === 'ai';
  const h = ai
    ? `<h1 class="lh-h1 lh-h1--ai"><span>Supercharge your</span><br><span>workflow with AI</span></h1>
       <p class="lh-sub lh-sub--ai">The all-in-one platform to streamline, automate and scale your<br>business seamlessly.</p>`
    : `<h1 class="lh-h1"><span>Close the month</span><br><span>in one afternoon.</span></h1>
       <p class="lh-sub">Bookkeeping for <b>small teams,</b><br>without the spreadsheet.</p>`;
  const primary = `<a class="lh-btn lh-btn--${s.primary}">${s.cta}</a>`;
  const secondary = s.secondary === 'link' ? `<a class="lh-link">See how it works ${svg('arrow')}</a>` : `<a class="lh-btn lh-btn--gradient">Learn more</a>`;
  const note = ai ? '' : `<p class="lh-fine">No credit card. Cancel anytime.</p>`;
  const shot = s.shot ? `<div class="lh-shot">
      <aside>${['grid', 'list', 'sync', 'bars', 'gear'].map((n, i) => `<i class="${i === 0 ? 'is-on' : ''}">${svg(n)}</i>`).join('')}</aside>
      <div class="lh-shot__body">
        <div class="lh-shot__head"><b>Overview</b><span class="lh-sync">Synced 07:12</span></div>
        <div class="lh-shot__row"><span>Revenue</span><b>$48,210</b></div>
        <div class="lh-shot__row"><span>Unreconciled</span><b>12</b></div>
        <div class="lh-shot__row"><span>Days to close</span><b>3</b></div>
        <svg class="lh-shot__chart" viewBox="0 0 470 60" preserveAspectRatio="none"><defs><linearGradient id="lh-g${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2fd3b0" stop-opacity=".45"/><stop offset="1" stop-color="#2fd3b0" stop-opacity="0"/></linearGradient></defs><path class="g" d="M0 18H470M0 34H470M0 50H470"/><path fill="url(#lh-g${uid})" d="${CHART_IN}V60H0Z"/><path class="l" d="${CHART_IN}"/></svg>
        <div class="lh-shot__row lh-shot__row--dot"><span>Stripe payout</span><b>$12,400</b></div>
        <div class="lh-shot__row lh-shot__row--dot"><span>AWS</span><b>$1,180</b></div>
      </div>
    </div>` : '';
  return `<section class="lh-hero${ai ? ' lh-hero--ai' : ''}">${s.blob ? '<div class="lh-blob"></div>' : ''}<div class="lh-hero__copy">${h}<div class="lh-ctas">${primary}${secondary}</div>${note}</div>${shot}</section>`;
}

function proof(s) {
  if (s.proof === 'quote') return `<section class="lh-proof lh-proof--quote"><figure class="lh-quote">
    <span class="lh-quote__mark">&#8221;</span>
    <blockquote>We closed August in three hours. It used to take a week.</blockquote>
    <figcaption><span class="lh-avatar">SC</span><div><b>Sarah Chen</b><span>Head of Finance, Acme</span></div></figcaption>
  </figure></section>`;
  const logos = [['circle', 'Globex'], ['square', 'Initech'], ['diamond', 'Vandelay'], ['pill', 'Hooli'], ['dots', 'Pied Piper']];
  return `<section class="lh-proof"><div class="lh-trusted">TRUSTED BY 10,000+ USERS</div><div class="lh-logos">${logos.map(([k, n]) => `<span><i class="lh-logo lh-logo--${k}"></i>${n}</span>`).join('')}</div></section>`;
}

function features(s) {
  if (s.features === 'product') return `<section class="lh-features lh-features--product"><div class="lh-app">
    <aside class="lh-app__side">
      <div class="lh-app__brand"><i>${svg('bolt')}</i>Lumen</div>
      <div class="lh-app__nav"><a class="is-on">${svg('grid')}Overview</a><a class="no-ic">Transactions</a><a>${svg('sync')}Reconcile</a><a>${svg('bars')}Reports</a><a>${svg('gear')}Settings</a></div>
    </aside>
    <div class="lh-app__main">
      <div class="lh-app__head"><b>Overview</b><span>Aug 1 to Aug 31, 2026</span><em class="lh-sync">Synced 07:12</em><a class="lh-app__export">${svg('download')}Export</a></div>
      <div class="lh-app__stats">
        <div><span>Revenue</span><b>$48,210</b><small>+12.5% vs Jul</small></div>
        <div><span>Unreconciled</span><b>12</b><small>4 new today</small></div>
        <div><span>Days to close</span><b>3</b><small>was 7 in July</small></div>
      </div>
      <div class="lh-app__chart"><div class="lh-app__ct"><b>Cash in vs out</b><span><i class="in"></i>In<i class="out"></i>Out</span></div>
        <svg viewBox="0 0 470 60" preserveAspectRatio="none"><defs><linearGradient id="lh-a${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2fd3b0" stop-opacity=".45"/><stop offset="1" stop-color="#2fd3b0" stop-opacity="0"/></linearGradient></defs><path class="g" d="M0 18H470M0 34H470M0 50H470"/><path fill="url(#lh-a${uid})" d="${CHART_IN}V60H0Z"/><path class="o" d="${CHART_OUT}"/><path class="l" d="${CHART_IN}"/></svg>
        <div class="lh-app__axis"><span>Aug 1</span><span>Aug 15</span><span>Aug 31</span></div></div>
      <div class="lh-app__tx"><div class="lh-app__ct"><b>Recent transactions</b><span>View all</span></div>
        <div class="lh-app__tr"><b>Stripe payout</b><span>Aug 30</span><em>Revenue</em><strong>$12,400.00</strong><small><i></i>Reconciled</small></div>
        <div class="lh-app__tr"><b>AWS</b><span>Aug 29</span><em>Hosting</em><strong>$1,180.20</strong><small><i></i>Reconciled</small></div>
        <div class="lh-app__tr"><b>Figma</b><span>Aug 28</span><em>Software</em><strong>$45.00</strong><small><i class="warn"></i>To review</small></div>
      </div>
    </div></div></section>`;
  const cards = [['bolt', 'blue', 'Fast', 'Lightning fast performance'], ['shield', 'green', 'Secure', 'Enterprise-grade security'], ['smile', 'purple', 'Easy', 'Simple and intuitive']];
  return `<section class="lh-features">${cards.map(([ic, c, t, d]) => `<div class="lh-card"><i class="lh-card__ic lh-card__ic--${c}">${svg(ic)}</i><b>${t}</b><p>${d}</p><span>Learn more <small>&rarr;</small></span></div>`).join('')}</section>`;
}

function render(s) {
  const ai = s.headline === 'ai';
  return `<nav class="lh-nav"><b class="lh-brand${ai ? ' lh-brand--ai' : ''}">Lumen</b><div class="lh-nav__links"><a>Product</a><a>Pricing</a><a>Docs</a></div><a class="lh-signin">Sign in</a></nav>
    ${hero(s)}${proof(s)}${features(s)}
    <footer class="lh-footer"><b>Lumen</b><span>Product · Pricing · Docs · Changelog</span><span>© 2026 Lumen Inc.</span></footer>`;
}

export function Landing(root, state = {}) {
  let s = { ...DEFAULT_STATE, ...state };
  uid++;
  const paint = () => { root.classList.add('lh-page'); root.innerHTML = render(s); };
  paint();
  return { get state() { return s; }, set(patch) { s = { ...s, ...patch }; paint(); }, root };
}

// "headline=ai blob shot primary=green" -> state object
export function parseState(str = '') {
  const out = {};
  for (const tok of str.split(/\s+/).filter(Boolean)) { const [k, v] = tok.split('='); out[k] = v === undefined ? true : (v === 'true' ? true : v === 'false' ? false : v.split('+').join(' ')); }
  return out;
}
export function mountAll(scope = document) {
  return [...scope.querySelectorAll('[data-landing]')].map(el => Landing(el, parseState(el.dataset.state)));
}

// Click-weight meter used by tell 3: ClickWeight(el).set(90) draws a 90 / 10 split.
export function ClickWeight(root) {
  const fill = root.querySelector('.lh-cw__fill'), l = root.querySelector('.lh-cw__l'), r = root.querySelector('.lh-cw__r');
  return { set(pct) { fill.style.width = pct + '%'; l.textContent = pct + ' %'; r.textContent = (100 - pct) + ' %'; root.classList.toggle('is-primary', pct > 50); } };
}
