// Whitespace Types: micro (padding inside elements), macro (margins between sections), active (emptiness that
// makes one element pop). The helpers animate real spacing values so a card can go from cramped to airy.

// Open or close a .ws-card between its cramped and airy states. CSS transitions tween the spacing; the
// optional spec tags count their pixel values alongside ("padding: 16px" -> "padding: 40px").
// Usage: const card = BreathingCard(cardEl, { tags: { padding: [el, 16, 40], gap: [el, 8, 22] }, duration: 800 });
//        card.open(); card.close(); card.jump(true)  // jump = no transition
export function BreathingCard(card, opts = {}) {
  const dur = opts.duration ?? 800, tags = Object.values(opts.tags || {});
  const go = airy => { card.classList.toggle('is-airy', airy); tags.forEach(([el, a, b]) => CountPx(el, airy ? a : b, airy ? b : a, dur)); };
  return {
    open: () => go(true), close: () => go(false),
    jump(airy) { card.classList.add('no-anim'); card.classList.toggle('is-airy', airy); tags.forEach(([el, a, b]) => el.textContent = (airy ? b : a) + 'px'); void card.offsetWidth; card.classList.remove('no-anim'); },
    get airy() { return card.classList.contains('is-airy'); }
  };
}

// Count a padding tag from one value to another ("padding: 16px" -> "padding: 40px").
// Usage: CountPx(tagEl.querySelector('b'), 16, 40, 600)
export function CountPx(el, a, b, dur = 600) {
  const t0 = performance.now();
  const step = now => { const k = Math.min(1, (now - t0) / dur); el.textContent = Math.round(a + (b - a) * k) + 'px'; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

// Macro spacer: grow the gap between two content blocks and reveal its pixel label once it is wide enough.
// Usage: MacroGap(blocksEl).set(40)
export function MacroGap(root) {
  const gap = root.querySelector('.ws-blocks__gap'), label = gap.querySelector('span');
  return { set(px) { gap.style.height = px + 'px'; if (label) { label.textContent = px + 'px'; label.style.opacity = px >= 24 ? 1 : 0; } } };
}

// Active whitespace: light one CTA and leave the space around it empty (removes any other lit button in scope).
// Usage: Spotlight(scopeEl, buttonEl)
export function Spotlight(scope, btn) {
  scope.querySelectorAll('.is-lit').forEach(b => b.classList.remove('is-lit'));
  btn.classList.add('is-lit');
  return btn;
}

// Karaoke caption: words switch from grey to white as they are spoken.
// Usage: Karaoke(capEl, ['Same content,', 'but', 'now', 'it'], 220)
export function Karaoke(el, words, step = 220) {
  el.innerHTML = words.map(w => `<span>${w}</span>`).join(' ');
  const spans = [...el.children]; let i = 0;
  const iv = setInterval(() => { if (i >= spans.length) return clearInterval(iv); spans[i++].style.color = '#fff'; }, step);
  return { stop: () => clearInterval(iv) };
}
