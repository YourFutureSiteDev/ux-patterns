// Tabs System: a sliding indicator, horizontal overflow with chevrons, full keyboard operation,
// a focus ring that never shares the active colour, and content that fades out, pauses, fades in.

// Usage: Tabs(barEl, { panels: [...], fade: 80, pause: 80, onChange })
//   barEl holds .tb-tab buttons and one .tb-tabs__ind; panels are the matching content elements.
export function Tabs(bar, opts = {}) {
  const tabs = [...bar.querySelectorAll('.tb-tab')], ind = bar.querySelector('.tb-tabs__ind'), panels = opts.panels || [];
  const fade = opts.fade ?? 80, pause = opts.pause ?? 80;
  let i = Math.max(0, tabs.findIndex(t => t.classList.contains('is-active') || t.getAttribute('aria-selected') === 'true')), busy = false;
  bar.setAttribute('role', 'tablist');
  const place = () => { // the underline slides: measure the active tab, move the indicator with a spring-ish curve
    const t = tabs[i]; if (!ind || !t || !t.offsetWidth) return; // hidden bars keep their last position
    ind.style.setProperty('--x', (t.offsetLeft) + 'px'); ind.style.setProperty('--w', t.offsetWidth + 'px');
  };
  bar.closest('.scene')?.addEventListener('scene:enter', place);
  const paint = () => { tabs.forEach((t, j) => { const on = j === i; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; }); place(); };
  const swap = async (from, to) => { // content never hard-cuts: fade out, pause, fade in, heights matched by the panel transition
    if (!panels.length) return; busy = true;
    const a = panels[from], b = panels[to];
    if (a) { a.classList.add('is-out'); await wait(fade); a.hidden = true; }
    await wait(pause);
    if (b) { b.hidden = false; b.classList.add('is-out'); void b.offsetWidth; b.classList.remove('is-out'); await wait(fade); }
    busy = false;
  };
  const select = (j, focus) => {
    j = (j + tabs.length) % tabs.length; if (j === i || busy) { if (focus) tabs[j].focus(); return; }
    const from = i; i = j; paint(); swap(from, i); if (focus) tabs[i].focus();
    tabs[i].scrollIntoView?.({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    opts.onChange?.(tabs[i].dataset.id || tabs[i].textContent.trim());
  };
  tabs.forEach((t, j) => {
    t.setAttribute('role', 'tab');
    t.addEventListener('click', () => select(j));
    t.addEventListener('keydown', e => { // arrows move, Home first, End last, Tab exits to the next group
      const k = e.key;
      if (k === 'ArrowRight') { e.preventDefault(); select(j + 1, true); }
      else if (k === 'ArrowLeft') { e.preventDefault(); select(j - 1, true); }
      else if (k === 'Home') { e.preventDefault(); select(0, true); }
      else if (k === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
    });
  });
  panels.forEach((p, j) => { p.setAttribute('role', 'tabpanel'); p.hidden = j !== i; });
  paint(); addEventListener('resize', place);
  return { select, get index() { return i; }, place };
}
const wait = ms => new Promise(r => setTimeout(r, ms));

// Overflow: scroll the row horizontally, keep edge fades, and drive it with chevrons on desktop.
// Usage: OverflowTabs(barEl, { prev: btn, next: btn, step: 139 })
export function OverflowTabs(bar, opts = {}) {
  bar.classList.add('tb-tabs--scroll'); bar.style.overflowX = 'auto'; bar.style.scrollbarWidth = 'none';
  const step = opts.step ?? bar.clientWidth * .6;
  const update = () => {
    const max = bar.scrollWidth - bar.clientWidth;
    if (opts.prev) opts.prev.disabled = bar.scrollLeft <= 1;
    if (opts.next) { opts.next.disabled = bar.scrollLeft >= max - 1; opts.next.classList.toggle('is-on', bar.scrollLeft < max - 1); }
    bar.style.maskImage = bar.style.webkitMaskImage = `linear-gradient(90deg, ${bar.scrollLeft > 1 ? 'transparent, #000 12%' : '#000'}, #000 85%, ${bar.scrollLeft < max - 1 ? 'transparent' : '#000'})`;
  };
  opts.prev?.addEventListener('click', () => bar.scrollBy({ left: -step, behavior: 'smooth' }));
  opts.next?.addEventListener('click', () => bar.scrollBy({ left: step, behavior: 'smooth' }));
  bar.addEventListener('scroll', update, { passive: true }); update();
  return { update };
}

// Mobile: a segmented control under 5 tabs, a bottom sheet over 5. Never a scaled-down desktop bar.
export function pickMobileTabs(count) { return count < 5 ? 'segmented-control' : 'bottom-sheet'; }

// Bottom sheet section picker for the over-5 case.
export function BottomSheet(sheet, opts = {}) {
  const rows = [...sheet.querySelectorAll('.tb-sheet__row')];
  const open = () => sheet.classList.remove('is-closed'), close = () => sheet.classList.add('is-closed');
  rows.forEach(r => r.addEventListener('click', () => { rows.forEach(o => o.classList.toggle('is-active', o === r)); opts.onChange?.(r.textContent.trim()); close(); }));
  opts.trigger?.addEventListener('click', open);
  return { open, close };
}
