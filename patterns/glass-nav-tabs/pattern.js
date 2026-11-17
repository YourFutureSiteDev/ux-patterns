// Glass Nav Tabs: a pill that stretches between items, goes clear while it moves and
// settles solid. Works for links or buttons, with arrow keys, Home and End.
//
// Usage: GlassNav(barEl, { onChange })
//   barEl is a .gn-bar holding .gn-item elements; mark the current one aria-current="page".
//   The pill is added for you. onChange({ item, index }) runs after each move.
export function GlassNav(bar, opts = {}) {
  const items = [...bar.querySelectorAll('.gn-item')];
  const pill = document.createElement('span');
  pill.className = 'gn-pill is-still';
  pill.setAttribute('aria-hidden', 'true');
  bar.prepend(pill);

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = Math.max(0, items.findIndex(i => i.hasAttribute('aria-current')));
  let timer;

  const mark = n => items.forEach((it, k) => {
    if (k === n) it.setAttribute('aria-current', 'page'); else it.removeAttribute('aria-current');
    it.tabIndex = k === n ? 0 : -1;
  });

  // Where the pill should end up, measured with the labels already at their final width.
  const edges = n => {
    const was = index;
    bar.classList.add('gn-measuring');
    mark(n);
    const box = bar.getBoundingClientRect(), r = items[n].getBoundingClientRect();
    const b = bar.clientLeft;
    const out = { left: r.left - box.left - b, right: box.right - r.right - b };
    mark(was);
    void bar.offsetWidth;
    bar.classList.remove('gn-measuring');
    return out;
  };

  const place = e => { pill.style.left = e.left + 'px'; pill.style.right = e.right + 'px'; };

  const go = (n, focus) => {
    if (n === index) return;
    const e = edges(n), toLeft = n < index;
    pill.classList.remove('is-still');
    pill.classList.toggle('to-left', toLeft);
    if (!still) pill.classList.add('is-moving');
    place(e);
    index = n;
    mark(n);
    if (focus) items[n].focus();
    clearTimeout(timer);
    timer = setTimeout(() => pill.classList.remove('is-moving'), still ? 0 : 300);
    opts.onChange?.({ item: items[n], index: n });
  };

  items.forEach((it, n) => it.addEventListener('click', () => go(n)));
  bar.addEventListener('keydown', e => {
    const last = items.length - 1;
    const n = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[e.key];
    if (n === undefined) return;
    e.preventDefault();
    go(n, true);
  });

  const settle = () => { pill.classList.add('is-still'); pill.classList.remove('is-moving'); place(edges(index)); };
  mark(index);
  settle();
  new ResizeObserver(settle).observe(bar.parentElement || bar);
  document.fonts?.ready.then(settle);

  return { go: n => go(n), get index() { return index; } };
}
