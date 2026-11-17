// Circle Theme Switch: the new theme grows as a circle from the toggle that was pressed,
// using the View Transitions API. From the reel by Code & Chill (Insta batch 17 Nov 2026).
//
// Usage: CircleThemeSwitch(buttonEl, { root, attr, themes, duration, onChange })
//   Flips root[attr] between themes[0] and themes[1] (default data-theme light/dark).
//   Falls back to an instant swap without the API, and under prefers-reduced-motion.
export function CircleThemeSwitch(btn, opts = {}) {
  const root = opts.root || document.documentElement;
  const attr = opts.attr || 'data-theme';
  const themes = opts.themes || ['light', 'dark'];
  const duration = opts.duration ?? 620;
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const current = () => root.getAttribute(attr) || themes[0];
  const sync = () => btn.setAttribute('aria-pressed', String(current() === themes[1]));
  const flip = () => {
    root.setAttribute(attr, current() === themes[0] ? themes[1] : themes[0]);
    sync();
    opts.onChange?.(current());
  };

  btn.addEventListener('click', () => {
    if (!document.startViewTransition || still()) { flip(); return; }
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = document.startViewTransition(flip);
    t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
  });

  sync();
  return { flip, get theme() { return current(); } };
}
