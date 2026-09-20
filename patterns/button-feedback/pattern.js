// Button feedback: the three secrets behind a button that feels good.
//   easing       - never move anything linearly; ease out so it decelerates like a real object
//   feedback     - every press answers within a frame (ripple, glow, state change)
//   anticipation - squash before the action, spring after it (Disney, 1937)
// Each helper works on a plain element and only adds classes / a ripple span from pattern.css.

// Toggle: click flips .is-on and aria-checked. The knob eases with an overshoot curve in CSS.
export function Toggle(el, opts = {}) {
  el.setAttribute('role', 'switch');
  const set = on => { el.classList.toggle('is-on', on); el.setAttribute('aria-checked', on); el.dispatchEvent(new CustomEvent('bf:toggle', { detail: { on } })); };
  el.addEventListener('click', () => set(!el.classList.contains('is-on')));
  set(opts.on ?? el.classList.contains('is-on'));
  return { get on() { return el.classList.contains('is-on'); }, set };
}

// Ripple: spawns a .bf-ripple at the pointer position and lights the button for a beat.
export function ripple(btn, opts = {}) {
  btn.addEventListener('pointerdown', e => {
    const r = btn.getBoundingClientRect(), s = document.createElement('span');
    s.className = 'bf-ripple'; s.style.left = `${e.clientX - r.left}px`; s.style.top = `${e.clientY - r.top}px`;
    btn.appendChild(s); s.addEventListener('animationend', () => s.remove());
    btn.classList.add('is-lit'); setTimeout(() => btn.classList.remove('is-lit'), opts.lit ?? 600);
  });
}

// Anticipation: squash slightly on pointerdown, spring back on release (transform only, no layout).
export function squash(el, opts = {}) {
  const down = opts.down ?? 'scale(.94)', spring = opts.spring ?? 'cubic-bezier(.34,1.56,.64,1)';
  el.addEventListener('pointerdown', () => { el.style.transition = 'transform .1s ease'; el.style.transform = down; });
  const up = () => { el.style.transition = `transform .45s ${spring}`; el.style.transform = ''; };
  el.addEventListener('pointerup', up); el.addEventListener('pointerleave', up); el.addEventListener('pointercancel', up);
}

// Confirm button: press -> run the request -> flip to the .is-done check state -> reset.
// Usage: confirmButton(btn, { request: () => fetch(...), hold: 1800 })
export function confirmButton(btn, opts = {}) {
  if (opts.silent) { btn.addEventListener('click', e => e.preventDefault()); return; } // the "no response" control
  const request = opts.request || (() => new Promise(r => setTimeout(r, opts.latency ?? 400)));
  btn.addEventListener('click', async () => {
    if (btn.classList.contains('is-busy')) return;
    btn.classList.add('is-busy');
    try { await request(); btn.classList.add('is-done'); btn.dispatchEvent(new CustomEvent('bf:confirmed')); }
    finally { setTimeout(() => btn.classList.remove('is-done', 'is-busy'), opts.hold ?? 1800); }
  });
}

// Toast: drops a "Changes saved!" style notice into host, slides it in, removes it after `ttl`.
export function toast(host, text, opts = {}) {
  const el = document.createElement('div');
  el.className = 'bf-toast'; el.style.left = opts.left ?? '0'; el.style.top = opts.top ?? '0';
  el.innerHTML = '<div class="bf-toast__check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><b></b>';
  el.querySelector('b').textContent = text; host.appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, opts.ttl ?? 2400);
  return el;
}

// Easing race: restarts the linear vs ease-out slider race inside a .bf-race root.
export function EasingRace(root) {
  return { replay() { root.classList.remove('bf-race'); void root.offsetWidth; root.classList.add('bf-race'); } };
}
