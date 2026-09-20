// Scene player. ?scene=N shows only scene N (used by tools/shot.mjs); ?t=SECONDS fast-forwards
// that scene's animations so a screenshot matches the source frame at that time.
// Each scene may define its own timeline by listening for the 'scene:enter' event with detail.t.
(() => {
  const q = new URLSearchParams(location.search);
  const scenes = [...document.querySelectorAll('.scene')];
  const n = q.has('scene') ? Number(q.get('scene')) : null;
  const t = q.has('t') ? Number(q.get('t')) : null;
  if (n !== null) {
    document.body.classList.add('single');
    scenes.forEach((s, i) => s.classList.toggle('active', i + 1 === n));
    const s = scenes[n - 1];
    if (s) {
      if (t !== null) { // jump every CSS animation/transition in the scene to time t (seconds since scene start)
        s.getAnimations({ subtree: true }).forEach(a => { try { a.currentTime = Math.max(0, (t - (Number(s.dataset.t) || 0)) * 1000); a.pause(); } catch {} });
      }
      s.dispatchEvent(new CustomEvent('scene:enter', { detail: { t: t ?? 0 } }));
    }
    return;
  }
  let i = 0; const nav = document.createElement('div'); nav.className = 'scene-nav';
  const show = k => { i = (k + scenes.length) % scenes.length; scenes.forEach((s, j) => s.classList.toggle('active', j === i)); scenes[i].dispatchEvent(new CustomEvent('scene:enter', { detail: { t: 0 } })); nav.querySelector('span').textContent = `${i + 1}/${scenes.length}`; };
  nav.innerHTML = '<button data-d="-1">prev</button><span></span><button data-d="1">next</button>';
  nav.addEventListener('click', e => { const d = e.target.dataset.d; if (d) show(i + Number(d)); });
  document.body.appendChild(nav);
  document.body.classList.add('single'); show(0);
  document.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
})();
