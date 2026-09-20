// Shadow Elevation: depth comes from three stacked shadows (contact, mid, glow) plus a small 3D lift,
// not from one flat drop shadow. Elevation(el, opts) builds the layers one at a time.
// Usage: const e = Elevation(card, { glow: 'rgba(139,92,246,0.15)' }); e.contact(); e.glow(); e.lift();
export function Elevation(el, opts = {}) {
  const layers = {
    contact: opts.contact || '0 1px 3px rgba(0,0,0,0.4)',
    mid: opts.mid || '0 8px 24px rgba(0,0,0,0.3)',
    glow: `0 0 ${opts.spread || 60}px ${opts.glow || 'rgba(139,92,246,0.15)'}`,
  };
  const lift = opts.lift || 'perspective(1000px) rotateX(2deg) translateZ(20px)';
  const on = new Set();
  const render = () => {
    const shadows = ['contact', 'mid', 'glow'].filter(k => on.has(k)).map(k => layers[k]);
    el.style.boxShadow = shadows.join(', ') || 'none';
    el.style.transform = on.has('lift') ? lift : 'none';
    el.dispatchEvent(new CustomEvent('se:elevation', { detail: { layers: [...on] } }));
  };
  const api = {
    reset() { on.clear(); render(); return api; },
    contact() { on.add('contact'); on.add('mid'); render(); return api; },
    glow(color) { if (color) layers.glow = `0 0 ${opts.spread || 60}px ${color}`; on.add('glow'); render(); return api; },
    lift() { on.add('lift'); render(); return api; },
    all() { return api.contact().glow().lift(); },
    get css() { return `box-shadow: ${[layers.contact, layers.mid, layers.glow].join(', ')};\ntransform: ${lift};`; },
  };
  return api;
}

// Brand tints for the glow layer: match the product context so elevation reinforces identity.
export const tints = {
  creative: 'rgba(139, 92, 246, 0.35)',
  fintech: 'rgba(59, 130, 246, 0.35)',
  health: 'rgba(34, 197, 94, 0.35)',
};

// tintGlow(el, rgba): swap only the glow colour on an already-elevated element.
export function tintGlow(el, rgba, spread = 40) {
  el.style.boxShadow = `0 1px 3px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.3), 0 0 ${spread}px ${rgba}`;
}
