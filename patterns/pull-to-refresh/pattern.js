// Pull to refresh, rebuilt from the @designmotionhq reel "Pull-to-refresh UX tips".
// Six rules: fire past a threshold (never before), resist like the content has weight, hand the
// stretch ring over to the spinner, tick once at the threshold before release, overshoot then settle,
// and never freeze the list while it loads.

export const INBOX = [
  { ini: 'SC', name: 'Sarah Chen',  text: 'Sent you the final specs',  time: '2m',  tone: 'blue' },
  { ini: 'AR', name: 'Alex Rivera', text: 'Reacted to your comment',   time: '6m',  tone: 'purple' },
  { ini: 'MT', name: 'Mia Torres',  text: 'Shared a file · Q3.pdf',    time: '14m', tone: 'orange' },
  { ini: 'JL', name: 'Jordan Lee',  text: 'Mentioned you in Design',   time: '22m', tone: 'green' },
  { ini: 'PN', name: 'Priya Nair',  text: 'Approved your request',     time: '40m', tone: 'pink' },
  { ini: 'NK', name: 'Noah Kim',    text: 'Added you to Roadmap',      time: '1h',  tone: 'grey' },
];
export const NEW_ROW = { ini: 'DO', name: 'Dana Osei', text: 'Just replied to your thread', time: 'now', tone: 'teal', fresh: true };

// Elastic resistance: finger 220 -> content 106, finger 207 -> content 103 (d / (1 + d/k), k = 205).
export const elastic = (d, k = 205) => d / (1 + d / k);
export const linear = d => d;

const ICONS = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  inbox: '<path d="M3 13l2.5-8h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 13h5l1.5 3h5L16 13h5"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>',
};
const icon = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;

export const rowHTML = r => `<div class="ptr-row${r.fresh ? ' is-fresh' : ''}"><div class="ptr-avatar ptr-avatar--${r.tone}">${r.ini}</div><div class="ptr-row__body"><div class="ptr-row__name">${r.name}</div><div class="ptr-row__text">${r.text}</div></div><div class="ptr-row__time">${r.time}${r.fresh ? '<i class="ptr-dot"></i>' : ''}</div></div>`;

// Ring: 44px, 3px stroke. progress 0..1 draws that fraction of the circle; state 'spin' rotates a short arc.
const R = 19, C = 2 * Math.PI * R;
export const ringHTML = (progress = 1, state = 'pull') => `<div class="ptr-ring is-${state}"><svg viewBox="0 0 44 44"><circle class="ptr-ring__track" cx="22" cy="22" r="${R}"/><circle class="ptr-ring__arc" cx="22" cy="22" r="${R}" style="stroke-dasharray:${C};stroke-dashoffset:${C * (1 - progress)}"/></svg><svg class="ptr-ring__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10l5 5 5-5"/></svg></div>`;

// Render one inbox phone. opts: pull(px), state(idle|pull|stretch|armed|spin), progress(0..1), tone(teal|pink),
// rows(count), prepend(row), threshold({y, armed}), ripple(bool), topLine('teal'|'pink'), finger({x,y}).
export function renderInbox(root, o = {}) {
  const rows = (o.prepend ? [o.prepend] : []).concat(INBOX.slice(0, o.rows ?? 6));
  const state = o.state || 'idle', prog = o.progress ?? (state === 'pull' ? .5 : 1);
  root.classList.add('ptr-phone'); if (o.tone) root.classList.add(`is-${o.tone}`);
  root.innerHTML = `<div class="ptr-screen">
    <div class="ptr-status"><span class="ptr-status__time">9:41</span><i class="ptr-notch"></i><span class="ptr-status__icons"><svg viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx=".6"/><rect x="5" y="5.5" width="3" height="6.5" rx=".6"/><rect x="10" y="3" width="3" height="9" rx=".6"/><rect x="15" y="0" width="3" height="12" rx=".6" opacity=".35"/></svg><svg viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M1.5 4.5a9.5 9.5 0 0 1 13 0M4 7a6 6 0 0 1 8 0M6.5 9.5a2.5 2.5 0 0 1 3 0"/></svg><svg viewBox="0 0 24 12" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1" y="1" width="19" height="10" rx="2.5"/><rect x="3" y="3" width="12" height="6" rx="1" fill="currentColor" stroke="none"/><path d="M22 4.5v3" stroke-linecap="round"/></svg></span></div>
    <div class="ptr-header"><span>Inbox</span><button class="ptr-bell" aria-label="Notifications">${icon('bell')}</button></div>
    <div class="ptr-list">
      ${o.topLine ? `<i class="ptr-topline is-${o.topLine}"></i>` : ''}
      ${o.threshold ? `<div class="ptr-threshold${o.threshold.armed ? ' is-armed' : ''}" style="top:${o.threshold.y}px"><span>threshold</span></div>` : ''}
      ${o.ripple ? `<div class="ptr-ripples" style="top:${(o.pull || 0) - 28}px"><i class="ptr-ripple"></i><i class="ptr-ripple"></i><i class="ptr-ripple"></i></div>` : ''}
      <div class="ptr-pull" style="height:${o.pull || 0}px">${state === 'idle' ? '' : ringHTML(prog, state)}</div>
      <div class="ptr-rows">${rows.map(rowHTML).join('')}</div>
    </div>
    <div class="ptr-tabs">${icon('home')}${icon('search')}${icon('inbox', 'is-active')}${icon('person')}</div>
  </div>${o.finger ? `<i class="ptr-finger" style="left:${o.finger.x}px;top:${o.finger.y}px"></i>` : ''}`;
  return root;
}

// Live pull-to-refresh on a rendered phone. Pointer-driven: drag the list down, the ring fills, a haptic
// tick fires once at the threshold, release past it hands the ring to the spinner and the list stays live.
export function PullToRefresh(phone, opts = {}) {
  const threshold = opts.threshold ?? 80, resist = opts.resistance || elastic, maxPull = opts.max ?? 160;
  const list = phone.querySelector('.ptr-list'), pullEl = phone.querySelector('.ptr-pull'), rowsEl = phone.querySelector('.ptr-rows');
  let start = null, dist = 0, armed = false, busy = false, raf = 0;
  const draw = (px, state) => { pullEl.style.height = px + 'px'; pullEl.innerHTML = px > 0 || state === 'spin' ? ringHTML(state === 'spin' ? 1 : Math.min(1, px / threshold), state) : ''; };
  const spring = (from, to, done) => { // damped spring: overshoot, then settle
    cancelAnimationFrame(raf); let x = from, v = 0, last = performance.now();
    const step = now => { const dt = Math.min(.032, (now - last) / 1000); last = now;
      const k = 170, c = 14; v += (-k * (x - to) - c * v) * dt; x += v * dt;
      draw(Math.max(0, x), busy ? 'spin' : 'pull');
      if (Math.abs(x - to) > .5 || Math.abs(v) > .5) raf = requestAnimationFrame(step); else { draw(to, busy ? 'spin' : 'idle'); done && done(); } };
    raf = requestAnimationFrame(step);
  };
  list.addEventListener('pointerdown', e => { if (busy) return; start = e.clientY; dist = 0; armed = false; list.setPointerCapture(e.pointerId); cancelAnimationFrame(raf); });
  list.addEventListener('pointermove', e => {
    if (start === null) return; const finger = Math.max(0, e.clientY - start); dist = Math.min(maxPull, resist(finger));
    const nowArmed = dist >= threshold;
    if (nowArmed && !armed) { navigator.vibrate?.(10); phone.dispatchEvent(new CustomEvent('ptr:tick')); } // one tick, before release
    armed = nowArmed; phone.classList.toggle('is-armed', armed); draw(dist, armed ? 'armed' : 'pull');
  });
  const release = async () => {
    if (start === null) return; start = null; phone.classList.remove('is-armed');
    if (!armed) return spring(dist, 0);                                   // below the line: snap back, no reload
    busy = true; spring(dist, threshold * .75);                            // past the line: the ring becomes the spinner
    phone.dispatchEvent(new CustomEvent('ptr:refresh'));
    const fresh = await (opts.load ? opts.load() : new Promise(r => setTimeout(() => r([NEW_ROW]), opts.latency ?? 1400)));
    fresh.forEach(r => rowsEl.insertAdjacentHTML('afterbegin', rowHTML(r)));   // rows land in place, list never froze
    busy = false; spring(threshold * .75, 0);
  };
  list.addEventListener('pointerup', release); list.addEventListener('pointercancel', release);
  return { get armed() { return armed; }, get busy() { return busy; } };
}
