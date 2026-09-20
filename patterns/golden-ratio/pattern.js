// Golden ratio helpers: the number, a spacing/type scale derived from it, a 61.8/38.2 split and the spiral.
export const PHI = (1 + Math.sqrt(5)) / 2; // 1.618…

// goldenScale(8, 5) -> [8, 13, 21, 34, 55]; goldenScale(16, 4) -> [16, 26, 42, 68]. Rounded to whole pixels.
export function goldenScale(base, steps, ratio = PHI) {
  return Array.from({ length: steps }, (_, i) => Math.round(base * ratio ** i));
}

// goldenSplit(544) -> { major: 336, minor: 208 } (61.8% / 38.2%)
export function goldenSplit(total) {
  const major = Math.round(total / PHI);
  return { major, minor: total - major, majorPct: +(100 / PHI).toFixed(1), minorPct: +(100 - 100 / PHI).toFixed(1) };
}

// SVG path data for a logarithmic spiral. r grows by `growth` (default PHI) every full turn.
// cx, cy = centre; r0 = starting radius; turns = number of full rotations.
export function goldenSpiralPath(cx, cy, r0 = 6, turns = 2.5, growth = PHI, step = 0.08) {
  const b = Math.log(growth) / (Math.PI * 2);
  const pts = [];
  for (let t = 0; t <= turns * Math.PI * 2 + 1e-9; t += step) {
    const r = r0 * Math.exp(b * t);
    pts.push(`${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
}

// Draws a spiral into an <svg class="gr-spiral"> using its data-cx/cy/r0/turns attributes. Returns the path.
export function GoldenSpiral(svg, opts = {}) {
  const d = svg.dataset;
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', goldenSpiralPath(+(opts.cx ?? d.cx ?? 0), +(opts.cy ?? d.cy ?? 0), +(opts.r0 ?? d.r0 ?? 6), +(opts.turns ?? d.turns ?? 2.5), +(opts.growth ?? d.growth ?? PHI)));
  path.setAttribute('pathLength', '1');
  svg.replaceChildren(path);
  return path;
}

// Renders the spacing-scale rows (numbers, bars, names) from a base unit. pxPerUnit sets the bar width per px of spacing.
export function SpacingScale(root, { base = 8, names = ['base', 'small', 'medium', 'large', 'x-large'], pxPerUnit = 8.27, rowGap = 45, delay = 0.35 } = {}) {
  const vals = goldenScale(base, names.length);
  root.replaceChildren(...vals.map((v, i) => {
    const row = document.createElement('div'); row.className = 'gr-scale__row'; row.style.top = `${i * rowGap + (i === names.length - 1 ? 5 : 0)}px`;
    row.innerHTML = `<span class="gr-scale__n">${v}</span><span class="gr-scale__bar gr-grow" style="width:${Math.round(v * pxPerUnit)}px;animation-delay:${(i * delay).toFixed(2)}s"></span><span class="gr-scale__name">${names[i].replace('-', '-<br>')}</span>${i ? `<span class="gr-scale__x">x${PHI.toFixed(3)}</span>` : ''}`;
    return row;
  }));
  return vals;
}

// Simple follow toggle for the outro button.
export function FollowButton(btn) {
  let on = false;
  btn.addEventListener('click', () => { on = !on; btn.classList.toggle('is-on', on); btn.textContent = on ? 'Following' : 'Follow'; });
  return { get following() { return on; } };
}
