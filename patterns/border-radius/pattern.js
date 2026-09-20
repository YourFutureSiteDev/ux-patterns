// Border radius: nested corners follow one rule (inner = outer − padding), every value comes from one
// scale (4 · 8 · 12 · 16 · 24), and the range you pick sets the personality (sharp corporate, round friendly).

export const radiusScale = [4, 8, 12, 16, 24];
export const roles = { tooltip: 4, input: 8, card: 12, modal: 16, panel: 24 };

// The math rule: a card with radius 16 and padding 8 holds children with radius 8.
export const nestedRadius = (outer, padding) => Math.max(0, outer - padding);

// Snap any number onto the scale (so nobody ships 6px, 10px or 30px).
export function snapRadius(px, scale = radiusScale) { return scale.reduce((a, b) => Math.abs(b - px) < Math.abs(a - px) ? b : a); }

// Reads --radius and the padding of `el`, then sets --inner-radius on it so children can use var(--inner-radius).
export function applyNesting(el) {
  const cs = getComputedStyle(el);
  const outer = parseFloat(cs.getPropertyValue('--radius')) || parseFloat(cs.borderRadius) || 0;
  const pad = Math.min(parseFloat(cs.paddingTop), parseFloat(cs.paddingLeft)) || 0;
  const inner = nestedRadius(outer, pad); el.style.setProperty('--inner-radius', inner + 'px');
  el.querySelectorAll('[data-nest]').forEach(applyNesting);
  return inner;
}

// Radius = personality. `v` runs 0 (serious) to 1 (playful); each surface gets its radius from the scale end.
export function PersonalityDial(cards, { serious = 2, playful = 20 } = {}) {
  const set = v => {
    const r = serious + (playful - serious) * v;
    cards.forEach(c => { c.style.setProperty('--radius', r + 'px'); c.style.setProperty('--inner-radius', Math.max(2, r - 4) + 'px'); c.style.setProperty('--avatar-radius', (2 + 22 * v) + 'px'); c.dataset.mood = v < .5 ? 'serious' : 'playful'; });
    return r;
  };
  return { set };
}

// Demo slider: a div track with a thumb, drives a PersonalityDial. value 0..1.
export function Slider(track, dial, value = .45) {
  const thumb = track.querySelector('.br-slider__thumb');
  const set = v => { v = Math.min(1, Math.max(0, v)); thumb.style.left = (v * 100) + '%'; dial && dial.set(v); track.dataset.value = v.toFixed(2); return v; };
  const move = e => set((e.clientX - track.getBoundingClientRect().left) / track.offsetWidth);
  track.addEventListener('pointerdown', e => { move(e); const up = () => window.removeEventListener('pointermove', move); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up, { once: true }); });
  set(value);
  return { set };
}
