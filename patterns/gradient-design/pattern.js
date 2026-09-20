// Gradient design helpers: hue distance, a 60°-rule check, direction, a mesh renderer and the wheel wedge.

// Shortest angular distance between two hues in degrees (0..180).
export function hueDistance(h1, h2) {
  const d = Math.abs(((h1 - h2) % 360 + 360) % 360);
  return d > 180 ? 360 - d : d;
}

// Rule 01: hues within `limit` degrees (default 60) blend cleanly; beyond that the middle goes muddy.
export function isHarmonious(h1, h2, limit = 60) { return hueDistance(h1, h2) <= limit; }

// hsl string helper used by the wheel and the mesh points.
export const hsl = (h, s = 90, l = 60) => `hsl(${((h % 360) + 360) % 360} ${s}% ${l}%)`;

// Rule 02: a CSS gradient string. 135° is the premium angle; 0° reads flat.
export function gradient(from, to, angle = 135) { return `linear-gradient(${angle}deg, ${from}, ${to})`; }

// Rule 03: paint N colour points as blurred blobs inside `root` (a .gd-mesh element).
// points: [{ x, y, color, r }] with x, y as 0..1 fractions of the box, r in px.
export function Mesh(root, points, { showPoints = true } = {}) {
  root.querySelectorAll('.gd-mesh__blob, .gd-mesh__pt').forEach(n => n.remove());
  for (const p of points) {
    const b = document.createElement('i'); b.className = 'gd-mesh__blob';
    const r = p.r ?? 220;
    b.style.cssText = `left:${p.x * 100}%;top:${p.y * 100}%;width:${r * 2}px;height:${r * 2}px;margin:-${r}px 0 0 -${r}px;background:${p.color}`;
    root.appendChild(b);
    if (showPoints) { const d = document.createElement('span'); d.className = 'gd-mesh__pt'; d.style.cssText = `left:${p.x * 100}%;top:${p.y * 100}%`; root.appendChild(d); }
  }
  return { linear() { root.classList.add('is-linear'); root.classList.remove('is-mesh'); }, mesh() { root.classList.remove('is-linear'); root.classList.add('is-mesh'); } };
}

// Draws a `span` degree wedge on a .gd-wheel (an SVG overlay) starting at `from` degrees, 0 = right, clockwise.
export function WheelWedge(wheel, from = 150, span = 60) {
  const size = wheel.offsetWidth || 260, c = size / 2, r = c + 2;
  const a1 = from * Math.PI / 180, a2 = (from + span) * Math.PI / 180;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'gd-wheel__wedge'); svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M${c} ${c} L${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)} A${r} ${r} 0 ${span > 180 ? 1 : 0} 1 ${c + r * Math.cos(a2)} ${c + r * Math.sin(a2)} Z`);
  svg.appendChild(path); wheel.appendChild(svg);
  return svg;
}

// Simple follow toggle for the outro.
export function FollowButton(btn) {
  let on = false;
  btn.addEventListener('click', () => { on = !on; btn.classList.toggle('is-on', on); btn.textContent = on ? 'Following' : 'Follow'; });
  return { get following() { return on; } };
}
