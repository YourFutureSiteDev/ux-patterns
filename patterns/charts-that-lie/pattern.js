// Charts That Lie: the same numbers, drawn honestly or not.
// Every helper here takes the data and the axis and does the arithmetic in the open, so a truncated
// axis (min > 0) is a visible choice in the call, not something a library did for you.

// Scale a value into pixel height for an axis running min..max over `px` pixels.
export const scale = (v, min, max, px) => ((v - min) / (max - min)) * px;

// Evenly spaced tick values from max down to min (n ticks).
export const ticks = (min, max, n) => Array.from({ length: n }, (_, i) => max - (i * (max - min)) / (n - 1));

// The "lie factor": how much bigger a difference looks with a truncated axis than with a zero baseline.
export function lieFactor(a, b, min) { const honest = (b - a) / a; const shown = (b - min) / (a - min) - 1; return shown / honest; }

// Render a bar chart into a panel. Geometry is explicit so the reel's layouts can be matched exactly.
//   { plotTop, plotBottom, gridLeft, gridRight, ticks: n, min, max, bars: [{x, w, v, label, cls, valueText}] }
export function renderBars(panel, o) {
  const H = o.plotBottom - o.plotTop, tk = ticks(o.min, o.max, o.ticks);
  const frag = [];
  tk.forEach((t, i) => {
    const y = o.plotTop + (i * H) / (o.ticks - 1);
    frag.push(`<div class="cl-axis" style="top:${y}px;left:${o.axisLeft ?? 0}px">${o.fmt ? o.fmt(t) : Math.round(t)}</div>`);
    frag.push(`<div class="cl-grid${t === 0 && o.zeroLine ? ' cl-grid--zero' : ''}" style="top:${y}px${o.gridLeft != null ? `;left:${o.gridLeft}px` : ''}${o.gridRight != null ? `;right:${o.gridRight}px` : ''}"></div>`);
  });
  for (const b of o.bars) {
    const h = Math.max(0, scale(b.v, o.min, o.max, H));
    frag.push(`<div class="cl-bar ${b.cls || ''}" data-h="${h}" style="left:${b.x}px;width:${b.w}px;height:${h}px;top:${o.plotBottom - h}px;bottom:auto">${b.valueText != null ? `<span class="cl-bar__val">${b.valueText}</span>` : ''}${b.label ? `<span class="cl-bar__cat${b.on ? ' is-on' : ''}">${b.label}</span>` : ''}</div>`);
  }
  panel.insertAdjacentHTML('beforeend', frag.join(''));
  return panel;
}

// Animate the bars of a panel growing from the baseline (live playback only).
export function growBars(panel, ms = 700) {
  panel.querySelectorAll('.cl-bar').forEach((b, i) => b.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: ms, delay: i * 60, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' }));
}

// Polyline points string from data mapped into a w×h box, with optional pixel insets.
export function linePoints(data, w, h, pad = 0) {
  const min = Math.min(...data), max = Math.max(...data);
  return data.map((v, i) => [pad + (i / (data.length - 1)) * (w - 2 * pad), h - pad - scale(v, min, max, h - 2 * pad)]);
}
export const pointsAttr = pts => pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');

// Draw a line series into an <svg> sized w×h. Returns the created <polyline>.
export function renderLine(svg, data, { w, h, pad = 12, cls = 'cl-line__path', dot = true, dotCls = 'cl-line__dot', grid = 0 } = {}) {
  const pts = linePoints(data, w, h, pad);
  let html = '';
  if (grid) { html += '<g class="cl-line__grid">'; for (let i = 1; i < grid; i++) { const x = (i / grid) * w, y = (i / grid) * h; html += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/><line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`; } html += '</g>'; }
  html += `<polyline class="${cls}" points="${pointsAttr(pts)}"/>`;
  if (dot) { const [x, y] = pts[pts.length - 1]; html += `<circle class="${dotCls}" cx="${x}" cy="${y}" r="4"/>`; }
  svg.insertAdjacentHTML('beforeend', html);
  return svg.querySelector('polyline:last-of-type');
}

// Reveal a polyline to `fraction` of its length (0..1). Uses pathLength so the numbers are stable.
export function revealLine(poly, fraction) {
  poly.setAttribute('pathLength', 100);
  poly.style.strokeDasharray = 100; poly.style.strokeDashoffset = 100 - 100 * fraction;
}

// Data-ink ratio meter.
export function dataInk(meter, pct) { meter.querySelector('.cl-meter__fill').style.setProperty('--w', pct + '%'); meter.querySelector('b').textContent = pct + '%'; }

// Banking to 45°: the plot height that makes the median segment slope 45° for a given width.
export function bankedHeight(data, width) {
  const dx = width / (data.length - 1), range = Math.max(...data) - Math.min(...data);
  const slopes = data.slice(1).map((v, i) => Math.abs(v - data[i]) / range).sort((a, b) => a - b);
  const median = slopes[Math.floor(slopes.length / 2)] || 1;
  return dx / median; // height such that the median rise per step equals one step of run
}
