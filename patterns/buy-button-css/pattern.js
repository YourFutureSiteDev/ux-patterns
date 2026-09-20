// Buy Button CSS: the Stripe-style buy button built in four psychological layers.
//   colour = trust · shape = friendly · depth = premium · motion = action
// Each layer is a class on .bb-btn and a block of CSS lines for the editor, so a page can
// walk the button up the ladder one layer at a time (or drop straight to the finished one).

export const LAYERS = [
  { key: 'color',  label: 'Color = Trust',    cls: 'is-color',  lines: ['background: #6366f1;', 'color: white;', 'padding: 20px 64px;'] },
  { key: 'shape',  label: 'Shape = Friendly', cls: 'is-shape',  lines: ['border-radius: 14px;', 'font-family: Inter;', 'font-weight: 600;', 'font-size: 28px;'] },
  { key: 'depth',  label: 'Depth = Premium',  cls: 'is-depth',  lines: ['box-shadow:', '  0 4px 20px rgba(99,102,241,0.4);'] },
  { key: 'motion', label: 'Motion = Action',  cls: 'is-motion', lines: ['&:hover {', '  transform: scale(1.05);', '}'] },
];

// Syntax-colour one CSS line into spans (.p property, .v value, .b braces, .amp nesting selector).
export function highlight(line) {
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  if (/^\s*[{}]\s*$/.test(line)) return `<span class="b">${esc(line)}</span>`;
  const m = line.match(/^(\s*)(&)?(:?[\w-]+)(\s*\{)?$/);
  if (m && (m[2] || m[4])) return `${m[1]}${m[2] ? '<span class="amp">&amp;</span>' : ''}<span class="sel">${esc(m[3])}</span>${m[4] ? `<span class="b">${esc(m[4])}</span>` : ''}`;
  const d = line.match(/^(\s*)([\w-]+)(:\s*)(.*)$/);
  if (d) return `${d[1]}<span class="p">${esc(d[2])}</span>${esc(d[3])}<span class="v">${esc(d[4])}</span>`;
  return `<span class="v">${esc(line)}</span>`;
}

// Apply layers 0..upTo (inclusive) to a button; -1 strips it back to the browser default.
export function applyLayers(btn, upTo) {
  LAYERS.forEach((l, i) => btn.classList.toggle(l.cls, i <= upTo));
  return LAYERS.slice(0, upTo + 1).flatMap(l => l.lines);
}

// Render lines into an editor body, optionally with a caret after the last line.
export function renderCode(body, lines, { caret = false } = {}) {
  body.innerHTML = lines.map(highlight).join('\n') + (caret ? '<span class="bb-caret"></span>' : '');
}

// Type the given lines into an editor character by character, then resolve. Returns a cancel function.
export function typeCode(body, lines, { cps = 40, onLine } = {}) {
  let i = 0, j = 0, stop = false;
  const done = [];
  const tick = () => {
    if (stop) return;
    if (i >= lines.length) { renderCode(body, done); return; }
    j++;
    renderCode(body, done.concat(lines[i].slice(0, j)), { caret: true });
    if (j >= lines[i].length) { done.push(lines[i]); onLine?.(i, lines[i]); i++; j = 0; }
    setTimeout(tick, 1000 / cps);
  };
  tick();
  return () => { stop = true; };
}

// Walk a button through every layer in order, typing each layer's CSS into the editor and updating the label.
export function BuyButtonWalkthrough({ btn, body, label, cps = 40, pause = 900 }) {
  let cancel = () => {}, active = false;
  const step = k => new Promise(res => {
    if (label) label.textContent = LAYERS[k].label;
    const prior = LAYERS.slice(0, k).flatMap(l => l.lines);
    cancel = typeCode(body, prior.concat(LAYERS[k].lines), { cps, onLine: () => {} });
    // reveal the layer once its last line is typed
    const total = prior.concat(LAYERS[k].lines).join('').length;
    setTimeout(() => { applyLayers(btn, k); res(); }, (total / cps) * 1000 + 50);
  });
  return {
    async run() { if (active) return; active = true; applyLayers(btn, -1); renderCode(body, []); for (let k = 0; k < LAYERS.length && active; k++) { await step(k); await new Promise(r => setTimeout(r, pause)); } active = false; },
    stop() { active = false; cancel(); },
  };
}
