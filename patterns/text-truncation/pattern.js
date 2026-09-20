// Text Truncation: the four fixes for real-world strings.
//   1. min-width: 0 on flex children so text-overflow: ellipsis can fire.
//   2. Truncate the middle of filenames, emails and paths so both ends survive.
//   3. font-variant-numeric: tabular-nums on anything that updates live.
//   4. overflow-wrap: anywhere for URLs, tokens and IDs.

// Cut the middle of a string so that it fits `max` characters, keeping `tail` characters at the end.
// middleTruncate('quarterly_report_final_v3.pdf', 22) -> 'quarterly_rep…nal_v3.pdf'
export function middleTruncate(str, max, tail = 10, ellipsis = '…') {
  if (str.length <= max) return str;
  const keepEnd = Math.min(tail, Math.max(1, max - 2));
  const keepStart = Math.max(1, max - keepEnd - ellipsis.length);
  return str.slice(0, keepStart) + ellipsis + str.slice(str.length - keepEnd);
}

// Middle truncation that measures the element instead of counting characters. Re-runs on resize.
// Usage: fitMiddle(el, 'quarterly_report_final_v3.pdf', { tail: 10 })
export function fitMiddle(el, text, opts = {}) {
  const tail = opts.tail ?? Math.min(10, Math.floor(text.length / 3));
  const canvas = fitMiddle._c || (fitMiddle._c = document.createElement('canvas'));
  const ctx = canvas.getContext('2d');
  const render = () => {
    const cs = getComputedStyle(el);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const width = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (ctx.measureText(text).width <= width) { el.textContent = text; return; }
    let lo = 1, hi = text.length;                       // binary search the longest string that fits
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (ctx.measureText(middleTruncate(text, mid, tail)).width <= width) lo = mid; else hi = mid - 1; }
    el.textContent = middleTruncate(text, lo, tail);
  };
  render();
  const ro = new ResizeObserver(render); ro.observe(el);
  return { refresh: render, destroy: () => ro.disconnect() };
}

// Live metrics ticker: randomises every [data-metric] value so proportional digits visibly twitch.
// Usage: liveMetrics(root, { interval: 900 }) -> { stop() }
export function liveMetrics(root, opts = {}) {
  const els = [...root.querySelectorAll('[data-metric]')];
  const fmt = n => n.toLocaleString('en-US');
  const tick = () => els.forEach(el => { const [min, max] = (el.dataset.metric || '1000,9999').split(',').map(Number); el.textContent = fmt(min + Math.floor(Math.random() * (max - min + 1))); });
  const iv = setInterval(tick, opts.interval ?? 900);
  return { tick, stop: () => clearInterval(iv) };
}

// Three fixtures every text component must survive before it ships.
export const FIXTURES = ['', 'a', 'Bartholomew Vandermeer-Okonkwo Vellum 🚀'];
