// Pop-Out Effect: three colour tricks from the reel, as reusable behaviours.
//  - popOut(grid, primary): mute every action except one so the eye goes straight to it.
//  - ColorTemperature(root): one button, one semantic tone (red urgent, blue safe, green confirmed).
//  - ContrastContext(swatch): flip the ground behind a fixed colour to show simultaneous contrast.
//  - cycle(fn, items, ms): the small timer the demo scenes use to walk through states.

// Usage: popOut(document.querySelector('.po-grid'), '[data-action="buy"]')
export function popOut(grid, primary) {
  const el = typeof primary === 'string' ? grid.querySelector(primary) : primary;
  grid.querySelectorAll('.po-btn').forEach(b => b.classList.toggle('is-primary', b === el));
  grid.classList.toggle('is-focused', !!el);
  grid.dispatchEvent(new CustomEvent('po:focus', { detail: { primary: el } }));
  return el;
}

// Restore every button's own colour (the "everything screams" state).
export function unPopOut(grid) {
  grid.classList.remove('is-focused');
  grid.querySelectorAll('.po-btn').forEach(b => b.classList.remove('is-primary'));
}

// Colour temperature. The root carries data-tone; each hint carries its own data-tone and only the
// matching one is shown. Tones: 'red' (urgent), 'blue' (safe), 'green' (confirmed).
export const TONES = {
  red: { hint: '🔥 Urgent — Act now!', meaning: 'danger, urgency' },
  blue: { hint: '🛡️ Safe & trustworthy', meaning: 'trust, calm' },
  green: { hint: '✅ Go ahead, confirmed', meaning: 'success, permission' },
};
export function ColorTemperature(root, opts = {}) {
  const hints = [...root.querySelectorAll('.po-temp__hint')];
  const set = (tone, { quiet = false } = {}) => {
    root.dataset.tone = tone;
    hints.forEach(h => { h.hidden = h.dataset.tone !== tone; });
    root.classList.toggle('is-quiet', quiet);
    root.dispatchEvent(new CustomEvent('po:tone', { detail: { tone, ...TONES[tone] } }));
  };
  set(opts.tone || root.dataset.tone || 'red', { quiet: root.classList.contains('is-quiet') });
  return { set, get tone() { return root.dataset.tone; } };
}

// Simultaneous contrast: the chip colour never changes, only the ground does.
export function ContrastContext(swatch) {
  return {
    light() { swatch.classList.add('po-swatch--light'); swatch.classList.remove('po-swatch--dark'); },
    dark() { swatch.classList.add('po-swatch--dark'); swatch.classList.remove('po-swatch--light'); },
    toggle() { swatch.classList.contains('po-swatch--light') ? this.dark() : this.light(); },
  };
}

// Walk through a list of states on a timer. Returns a stop() function.
export function cycle(fn, items, ms = 2000) {
  let i = 0; fn(items[0], 0);
  const iv = setInterval(() => { i = (i + 1) % items.length; fn(items[i], i); }, ms);
  return () => clearInterval(iv);
}
