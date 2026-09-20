// Card Spacing Fixes: the same card, the same colours, the same components; only four numbers change.
//   #1 padding      8px  -> 28px
//   #2 gap          4px  -> 18px
//   #3 line-height  1.1  -> 1.6
//   #4 spacing      2px  -> 28px   (the room the card leaves around itself)
// The card is styled entirely from custom properties, so a fix is one property write.

export const FIXES = [
  { key: 'pad',   label: 'Padding',         prop: '--pad',   from: 8,   to: 28, unit: 'px', cls: 'is-pad',   name: 'padding' },
  { key: 'gap',   label: 'Element Spacing', prop: '--gap',   from: 4,   to: 18, unit: 'px', cls: 'is-gap',   name: 'gap' },
  { key: 'lh',    label: 'Line Height',     prop: '--lh',    from: 1.1, to: 1.6, unit: '',  cls: 'is-lh',    name: 'line-height' },
  { key: 'space', label: 'Breathing Room',  prop: '--space', from: 2,   to: 28, unit: 'px', cls: 'is-space', name: 'spacing' },
];

// Apply fixes 0..upTo to a card (-1 = cheap). Uses the class hooks so pattern.css owns the actual values.
export function applyFixes(card, upTo) {
  FIXES.forEach((f, i) => card.classList.toggle(f.cls, i <= upTo));
  card.classList.toggle('is-fixed', upTo >= FIXES.length - 1);
  return card;
}

// Write an exact value for one fix (used while animating between from and to).
export function setFix(card, fix, value) { card.style.setProperty(fix.prop, value + fix.unit); }

// Count a number from a to b over `ms`, calling onTick(value) each frame. Returns a cancel function.
export function countUp(a, b, ms, onTick, decimals = 0) {
  let raf, start;
  const step = t => { start ??= t; const k = Math.min(1, (t - start) / ms); const e = 1 - Math.pow(1 - k, 3); onTick(+(a + (b - a) * e).toFixed(decimals)); if (k < 1) raf = requestAnimationFrame(step); };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

// Render the reel's pill: "padding 8px -> 28px" with the old value struck through.
export function renderPill(pill, fix, value = fix.to) {
  pill.innerHTML = `${fix.name} <s>${fix.from}${fix.unit}</s> <span class="cs-arrow">→</span> <b>${value}${fix.unit}</b>`;
}

// Walk a card through all four fixes: animate each property from -> to while the pill counts alongside it.
export function SpacingFixes(card, { pill, kicker, title, ms = 900, pause = 900 } = {}) {
  let cancel = () => {}, running = false;
  const run = async () => {
    if (running) return; running = true;
    applyFixes(card, -1); FIXES.forEach(f => card.style.removeProperty(f.prop));
    for (let i = 0; i < FIXES.length && running; i++) {
      const f = FIXES[i];
      if (kicker) kicker.textContent = `FIX #${i + 1}`; if (title) title.textContent = f.label;
      if (pill) renderPill(pill, f, f.from);
      await new Promise(r => setTimeout(r, pause));
      await new Promise(res => { cancel = countUp(f.from, f.to, ms, v => { if (pill) renderPill(pill, f, v); }, f.unit ? 0 : 1); setTimeout(res, ms); });
      applyFixes(card, i); card.style.removeProperty(f.prop);
      await new Promise(r => setTimeout(r, pause));
    }
    running = false;
  };
  return { run, stop() { running = false; cancel(); } };
}
