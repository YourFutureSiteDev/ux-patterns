// Typography System: nine decisions that make type a system rather than a pile of one-offs.
// The helpers below are the working logic behind the reel's scenes; the CSS carries the tokens.

// typeScale(base, ratio, steps): a modular scale, e.g. typeScale(13, 1.25, 5) -> [13, 16, 20, 25, 32]
export function typeScale(base = 13, ratio = 1.25, steps = 5) {
  return Array.from({ length: steps }, (_, i) => Math.round(base * ratio ** i));
}

// leadingFor(size): line-height moves against size: 1.5 at body sizes, tightening to 1.1 at display sizes.
export function leadingFor(size) {
  if (size <= 16) return 1.5; if (size <= 20) return 1.35; if (size <= 25) return 1.2; return 1.1;
}

// trackingFor(size, { caps }): big tightens, small caps open, reading sizes stay at 0.
export function trackingFor(size, { caps = false } = {}) {
  if (caps && size < 16) return '0.05em'; if (size > 24) return '-0.02em'; return '0';
}

// applyType(el, size, opts): set size, leading and tracking from the three rules above.
export function applyType(el, size, opts = {}) {
  el.style.fontSize = `${size}px`; el.style.lineHeight = String(leadingFor(size)); el.style.letterSpacing = trackingFor(size, opts);
  if (opts.weight) el.style.fontWeight = String(opts.weight);
  if (opts.tabular) el.style.fontVariantNumeric = 'tabular-nums';
  return el;
}

// measureSlider(root, { para, from, to }): glide the characters-per-line slider and cap the paragraph's measure in ch.
export function measureSlider(root, { para, from = 166, to = 66, min = 30, max = 150, duration = 1400 } = {}) {
  const thumb = root.querySelector('.ts-slider__thumb'), now = root.querySelector('.ts-slider__now'), track = root.querySelector('.ts-slider__track');
  const width = track.clientWidth || 566, px = ch => Math.max(0, Math.min(width, ((ch - min) / (max - min)) * width));
  const start = performance.now();
  const step = t => {
    const k = Math.min(1, (t - start) / duration), e = 1 - Math.pow(1 - k, 3), ch = Math.round(from + (to - from) * e);
    thumb.style.left = `${px(ch)}px`; now.textContent = ch; if (para) para.style.maxWidth = `${Math.min(ch, 100)}ch`;
    root.dispatchEvent(new CustomEvent('ts:measure', { detail: { ch } }));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// tabularCounter(els, from, to, duration): tick a number up; the element with tabular-nums holds its width, the other wobbles.
export function tabularCounter(els, from, to, duration = 6000, stepMs = 120) {
  const start = performance.now(); const fmt = n => n.toLocaleString('en-US');
  const tick = () => {
    const k = Math.min(1, (performance.now() - start) / duration); const v = Math.round(from + (to - from) * k);
    els.forEach(el => { el.textContent = fmt(v); });
    if (k < 1) setTimeout(tick, stepMs);
  };
  tick();
}

// typeCommand(el, text, ms): type a string one character at a time (the code bar and the terminal).
export function typeCommand(el, text, ms = 60) {
  el.textContent = ''; let i = 0;
  const id = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(id); }, ms);
  return () => clearInterval(id);
}

// tallyCount(el, pairs, duration): animate each "from → to" number in the reel's tally pill.
export function tallyCount(el, pairs, duration = 2000) {
  const bs = [...el.querySelectorAll('b')].filter(b => /^\d+$/.test(b.textContent.trim()));
  const start = performance.now();
  const step = t => {
    const k = Math.min(1, (t - start) / duration);
    pairs.forEach(([from, to], i) => { if (bs[i]) bs[i].textContent = Math.round(from + (to - from) * k); });
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
