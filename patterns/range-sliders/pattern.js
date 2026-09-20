// Range Sliders: filled track, whole-row hit area, snap to steps, floating value, two-thumb range, keyboard.
// Usage: RangeSlider(el, { min, max, value, step, hit, tip, format, onChange, onKey })
//   el is a .rs-slider (holds --p 0..1). `hit` is an optional larger element that also accepts drags.

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function RangeSlider(el, opts = {}) {
  const min = opts.min ?? 0, max = opts.max ?? 100, step = opts.step ?? 0, thumb = parseFloat(getComputedStyle(el).getPropertyValue('--rs-thumb')) || 24;
  let value = opts.value ?? min;
  const snap = v => step ? Math.round((v - min) / step) * step + min : v;
  const set = (v, silent) => {
    value = clamp(snap(v), min, max);
    el.style.setProperty('--p', (value - min) / (max - min));
    el.setAttribute('aria-valuenow', value);
    if (opts.tip) opts.tip.textContent = (opts.format || (x => x))(value);
    if (!silent) opts.onChange?.(value);
  };
  // Pointer: the whole hit area maps to the thumb's travel (track width minus one thumb), so a click anywhere on the row lands the value.
  const fromEvent = e => { const r = el.getBoundingClientRect(); const p = clamp((e.clientX - r.left - thumb / 2) / (r.width - thumb), 0, 1); return min + p * (max - min); };
  const target = opts.hit || el;
  target.addEventListener('pointerdown', e => {
    e.preventDefault(); target.setPointerCapture(e.pointerId); el.classList.add('is-dragging'); el.focus?.({ preventScroll: true });
    set(fromEvent(e));
    const move = ev => set(fromEvent(ev));
    const up = () => { el.classList.remove('is-dragging'); target.removeEventListener('pointermove', move); target.removeEventListener('pointerup', up); target.removeEventListener('pointercancel', up); };
    target.addEventListener('pointermove', move); target.addEventListener('pointerup', up); target.addEventListener('pointercancel', up);
  });
  // Keyboard: arrows step by one (or the snap step), Home and End jump to the extremes, PageUp/Down by 10%.
  el.addEventListener('keydown', e => {
    const s = step || 1, big = (max - min) / 10; let v = value, hit = true;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowUp': v += s; break;
      case 'ArrowLeft': case 'ArrowDown': v -= s; break;
      case 'Home': v = min; break;
      case 'End': v = max; break;
      case 'PageUp': v += big; break;
      case 'PageDown': v -= big; break;
      default: hit = false;
    }
    if (!hit) return;
    e.preventDefault(); set(v); opts.onKey?.(e.key);
  });
  if (!el.hasAttribute('role')) { el.setAttribute('role', 'slider'); el.setAttribute('aria-valuemin', min); el.setAttribute('aria-valuemax', max); }
  if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
  set(value, true);
  return { get value() { return value; }, set };
}

// Two thumbs with a filled band between them. Thumbs cannot cross; the nearer thumb takes a click on the track.
export function DualRange(el, opts = {}) {
  const min = opts.min ?? 0, max = opts.max ?? 100, step = opts.step ?? 1, thumb = 24;
  let a = opts.a ?? min, b = opts.b ?? max;
  const ta = el.querySelector('.rs-range__thumb--a'), tb = el.querySelector('.rs-range__thumb--b');
  const snap = v => Math.round((v - min) / step) * step + min;
  const render = silent => {
    el.style.setProperty('--a', (a - min) / (max - min)); el.style.setProperty('--b', (b - min) / (max - min));
    ta.setAttribute('aria-valuenow', a); tb.setAttribute('aria-valuenow', b);
    if (!silent) opts.onChange?.(a, b);
  };
  const setA = v => { a = clamp(snap(v), min, b); render(); };
  const setB = v => { b = clamp(snap(v), a, max); render(); };
  const fromEvent = e => { const r = el.getBoundingClientRect(); return min + clamp((e.clientX - r.left - thumb / 2) / (r.width - thumb), 0, 1) * (max - min); };
  el.addEventListener('pointerdown', e => {
    e.preventDefault(); const v = fromEvent(e);
    const which = e.target === ta ? 'a' : e.target === tb ? 'b' : (Math.abs(v - a) <= Math.abs(v - b) ? 'a' : 'b');
    const setter = which === 'a' ? setA : setB; (which === 'a' ? ta : tb).focus({ preventScroll: true });
    el.setPointerCapture(e.pointerId); setter(v);
    const move = ev => setter(fromEvent(ev));
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up);
  });
  for (const [t, get, setter] of [[ta, () => a, setA], [tb, () => b, setB]]) {
    t.setAttribute('aria-valuemin', min); t.setAttribute('aria-valuemax', max);
    t.addEventListener('keydown', e => {
      const v = get(); const map = { ArrowRight: v + step, ArrowUp: v + step, ArrowLeft: v - step, ArrowDown: v - step, Home: min, End: max };
      if (!(e.key in map)) return; e.preventDefault(); setter(map[e.key]);
    });
  }
  render(true);
  return { get a() { return a; }, get b() { return b; }, setA, setB };
}
