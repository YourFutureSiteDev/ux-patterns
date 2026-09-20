// Microcopy: the words on a control carry as much weight as its layout.
// Four small behaviours, one per rule in the reel.

// 1. Labels name the reward. RewardLabel swaps a system verb for the reward copy and
//    reports the lift on a conversion meter (used by the hook's side-by-side cards).
export function ConversionMeter(root, { value = 0, delay = 0 } = {}) {
  const fill = root.querySelector('.mc-meter__fill'), num = root.querySelector('.mc-meter__row b');
  const set = v => { fill.style.setProperty('--v', v + '%'); num.textContent = v + '%'; };
  set(0);
  const run = () => setTimeout(() => set(value), delay);
  return { set, run };
}

// 2. Errors hand the fix. FieldError shows a message that names the problem and offers
//    the next move as a link. `fix` = { text, href, onClick }.
export function FieldError(field, { message, fix } = {}) {
  const msg = field.querySelector('.mc-field__msg');
  const set = (text, next) => {
    field.classList.toggle('is-error', !next); field.classList.toggle('is-fix', !!next);
    msg.replaceChildren();
    if (!next) { const i = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); i.innerHTML = '<use href="#i-ban"/>'; msg.append(i); }
    msg.append(document.createTextNode(text + (next ? ' — ' : '')));
    if (next) { const a = document.createElement('a'); a.href = next.href || '#'; a.textContent = next.text; if (next.onClick) a.addEventListener('click', e => { e.preventDefault(); next.onClick(e); }); msg.append(a); }
  };
  if (message) set(message, fix);
  return { set, clear() { field.classList.remove('is-error', 'is-fix'); msg.replaceChildren(); } };
}

// 3. Empty states teach the first action. EmptyState fills a container with an icon,
//    a plain-language title and the one button that gets the user started.
export function EmptyState(container, { title = 'Nothing here yet', action = 'Get started', onAction } = {}) {
  const wrap = document.createElement('div'); wrap.className = 'mc-inbox__empty';
  wrap.innerHTML = `<div class="mc-inbox__icon"><svg><use href="#i-inbox"/></svg></div><div class="mc-inbox__title"></div><button class="mc-inbox__cta"><svg><use href="#i-compose"/></svg><span></span></button>`;
  wrap.querySelector('.mc-inbox__title').textContent = title; wrap.querySelector('.mc-inbox__cta span').textContent = action;
  if (onAction) wrap.querySelector('.mc-inbox__cta').addEventListener('click', onAction);
  container.querySelectorAll('.mc-inbox__ghost').forEach(g => g.remove());
  container.append(wrap); container.classList.add('is-guided');
  return wrap;
}

// 4. Placeholders are not labels. KeptLabel lifts the placeholder into a floating label
//    the moment the field gets a value, so the question never vanishes.
export function KeptLabel(field, { text }) {
  const input = field.querySelector('.mc-field__input'), ph = field.querySelector('.mc-field__placeholder');
  let float = field.querySelector('.mc-field__float');
  const show = () => { if (!float) { float = document.createElement('span'); float.className = 'mc-field__float'; float.textContent = text; input.prepend(float); } field.classList.add('is-kept'); if (ph) ph.hidden = true; };
  return { show, typed: (value, el) => { show(); el.textContent = value; } };
}

// Type a string into an element one character at a time (the reel's "01 / 09 / 1990").
export function typeInto(el, text, { cps = 12, onDone } = {}) {
  let i = 0; el.textContent = '';
  const iv = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(iv); onDone && onDone(); } }, 1000 / cps);
  return () => clearInterval(iv);
}

// 5. Write like a person. humanize() maps system-speak to the brand's voice.
const VOICE = new Map([
  [/^error:?\s*operation failed/i, "Hmm, that didn't go through — try again?"],
  [/^invalid input/i, "That doesn't look right — check it and try again?"],
  [/^unauthori[sz]ed/i, 'You need to sign in first.'],
  [/^not found/i, "We couldn't find that page."],
]);
export function humanize(systemMessage) {
  for (const [re, human] of VOICE) if (re.test(systemMessage)) return human;
  return systemMessage.replace(/^error:?\s*/i, '').replace(/^\w/, c => c.toUpperCase());
}
