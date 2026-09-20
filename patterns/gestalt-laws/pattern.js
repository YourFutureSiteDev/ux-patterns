// Gestalt Laws: five grouping principles as small, reusable behaviours.
// Each helper takes existing DOM and flips it between the "chaos" and "grouped" state the reel shows.

// Closure: a ring drawn with a gap still reads as a circle. Ring(el).set(0.79) draws 79% of the circumference.
export function Ring(root, r = 108) {
  const c = root.querySelector('circle'), len = 2 * Math.PI * r;
  return { set(frac) { const d = len * frac; c.style.setProperty('--dash', d); c.style.setProperty('--gap', len - d); }, len };
}

// Similarity: give each row a shared property (colour) and it becomes a group. groups = { nav: [0], content: [1, 2], actions: [3] }
export function Similarity(grid, groups) {
  const dots = [...grid.querySelectorAll('.gl-dot')], cols = 4;
  Object.entries(groups).forEach(([g, rows]) => rows.forEach(r => dots.slice(r * cols, r * cols + cols).forEach(d => d.dataset.g = g)));
  return { group: () => grid.classList.add('is-grouped'), ungroup: () => grid.classList.remove('is-grouped'), toggle: () => grid.classList.toggle('is-grouped') };
}

// Continuity: align a set of positioned pills on one axis (transition handles the motion), or scatter them back.
export function Continuity(pills, opts = {}) {
  const x = opts.x ?? 360, top = opts.top ?? 391, gap = opts.gap ?? 66.7;
  const scattered = pills.map(p => ({ left: p.style.left, top: p.style.top, transform: p.style.transform }));
  return {
    align() { pills.forEach((p, i) => { p.style.left = `${x}px`; p.style.top = `${top + i * gap}px`; p.style.transform = 'translateX(-50%)'; }); },
    scatter() { pills.forEach((p, i) => Object.assign(p.style, scattered[i])); },
  };
}

// Figure-ground: opening the modal pushes the app to the ground (blur + dim); closing brings it back.
export function FigureGround(app, modal) {
  return {
    open() { app.classList.add('is-ground'); modal.hidden = false; modal.style.animation = 'none'; void modal.offsetWidth; modal.style.animation = ''; },
    close() { app.classList.remove('is-ground'); modal.hidden = true; },
  };
}

// Common region: move loose controls into bordered cards. rows = [{ label, items: [iconEl, chipEl, toggleEl] }]
export function CommonRegion(scene, rows, opts = {}) {
  const left = opts.left ?? 67, top = opts.top ?? 314, step = opts.step ?? 75, w = opts.width ?? 586;
  const regions = rows.map((r, i) => { const el = document.createElement('div'); el.className = 'gl-region'; el.style.left = `${left}px`; el.style.top = `${top + i * step}px`; el.style.animationDelay = `${i * .15}s`; el.innerHTML = `<span class="gl-region__label">${r.label}</span>`; el.hidden = true; scene.appendChild(el); return el; });
  return {
    group() {
      rows.forEach((r, i) => { const y = top + i * step + 27, [icon, chip, toggle] = r.items;
        icon.style.left = `${left + 85}px`; icon.style.top = `${y - 14}px`;
        chip.style.left = `${left + w / 2 - chip.offsetWidth / 2}px`; chip.style.top = `${y - 14}px`;
        toggle.style.left = `${left + w - 6}px`; toggle.style.top = `${y - 11}px`; });
      regions.forEach(el => { el.hidden = false; });
    },
    ungroup() { regions.forEach(el => { el.hidden = true; }); },
  };
}

// Toggle switch used inside the settings rows.
export function Toggle(btn, on = false, onChange) {
  const set = v => { btn.classList.toggle('is-on', v); btn.setAttribute('aria-checked', v); onChange?.(v); };
  btn.setAttribute('role', 'switch'); set(on);
  btn.addEventListener('click', () => set(!btn.classList.contains('is-on')));
  return { set };
}
