// Scroll-driven animations. The pattern itself is CSS (animation-timeline: scroll() / view(), see pattern.css).
// This module adds the pieces CSS cannot do on its own: a feature check, a JS fallback that mirrors scroll
// progress into a custom property, a section rail driven by scroll position, and a scroll player that
// tweens a container's scrollTop along a timeline (the demo uses it so ?t= screenshots line up with the reel).

export const supportsScrollTimeline = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()');

// Mirrors a scroller's progress (0..1) into --sd-progress on it, for browsers without scroll timelines.
export function ScrollFallback(scroller) {
  const update = () => { const max = scroller.scrollHeight - scroller.clientHeight; scroller.style.setProperty('--sd-progress', max > 0 ? scroller.scrollTop / max : 0); };
  scroller.addEventListener('scroll', update, { passive: true }); update();
  return { update, destroy() { scroller.removeEventListener('scroll', update); } };
}

// Marks the rail dot of the section that has scrolled past `offset` px below the top of the scroller.
// sections: elements inside the scroller; rail: element with one .sd-rail__dot per section.
export function SectionRail(scroller, sections, rail, { offset = 120 } = {}) {
  const dots = [...rail.querySelectorAll('.sd-rail__dot')];
  const update = () => {
    const y = scroller.scrollTop + offset; let active = 0;
    sections.forEach((s, i) => { if (s.offsetTop <= y) active = i; });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
    rail.dataset.active = sections[active]?.dataset.label || '';
  };
  scroller.addEventListener('scroll', update, { passive: true }); update();
  return { update };
}

// Tweens scrollTop along [[seconds, px], ...]. seek(t) is deterministic, play() runs it on a clock.
export function ScrollPlayer(scroller, keyframes, { loop = true } = {}) {
  const kf = keyframes.slice().sort((a, b) => a[0] - b[0]); const end = kf[kf.length - 1][0]; let raf = 0;
  const at = t => {
    if (loop && end > 0) t = t % end;
    if (t <= kf[0][0]) return kf[0][1];
    for (let i = 1; i < kf.length; i++) if (t <= kf[i][0]) { const [t0, y0] = kf[i - 1], [t1, y1] = kf[i]; return y0 + (y1 - y0) * ((t - t0) / (t1 - t0)); }
    return kf[kf.length - 1][1];
  };
  const seek = t => { scroller.scrollTop = at(t); scroller.dispatchEvent(new Event('scroll')); };
  const stop = () => cancelAnimationFrame(raf);
  const play = (from = 0) => { stop(); const t0 = performance.now() - from * 1000; const tick = now => { seek((now - t0) / 1000); raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); };
  return { seek, play, stop, at };
}

// Demo wiring: every [data-scroll="t:px,t:px"] scroller is driven from its scene's scene:enter event.
// With detail.t (a screenshot) it seeks and holds; live it plays and loops.
export function mountScrollScenes(root = document) {
  root.querySelectorAll('[data-scroll]').forEach(scroller => {
    const kf = scroller.dataset.scroll.split(',').map(p => p.split(':').map(Number));
    const player = ScrollPlayer(scroller, kf, { loop: scroller.dataset.loop !== 'no' });
    if (!supportsScrollTimeline) ScrollFallback(scroller);
    const scene = scroller.closest('.scene'); if (!scene) return;
    scene.addEventListener('scene:enter', e => {
      const local = (e.detail.t || 0) - (Number(scene.dataset.t) || 0);
      // stage.js pauses every animation for a frozen shot; scroll-driven ones must keep following the scroller
      scene.getAnimations({ subtree: true }).forEach(a => { const tl = a.timeline; if (tl && typeof ScrollTimeline !== 'undefined' && (tl instanceof ScrollTimeline)) { try { a.play(); } catch {} } });
      const frozen = new URLSearchParams(location.search).has("t");
      if (frozen) { player.stop(); player.seek(local); } else player.play(0);
    });
  });
}
