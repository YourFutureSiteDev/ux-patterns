// Empty states: five rules. 1 Illustration (one icon beats a void), 2 Human tone (brand voice, not a log file),
// 3 Primary CTA (the next real step, never "Try refreshing"), 4 Context (first run, no results, error, filtered
// each get their own copy), 5 Onboarding (a ghost preview teaches the feature before the first item exists).

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The four kinds of empty, with default copy and tone. Override any field per call.
export const KINDS = {
  'first-run': { tag: 'First run', tone: 'pink', icon: 'rocket', title: 'Welcome aboard', body: "Let's set up your workspace in under a minute.", cta: 'Start tutorial' },
  'no-results': { tag: 'No results', tone: 'teal', icon: 'search', title: 'No matches found', body: 'Try different keywords or check your spelling.', cta: 'Clear search' },
  'error': { tag: 'Error', tone: 'amber', icon: 'alert', title: 'Something broke', body: "We couldn't load your data. Try again in a moment.", cta: 'Retry' },
  'filtered': { tag: 'Filtered', tone: 'violet', icon: 'filter', title: 'Hidden by filters', body: n => `You have ${n} items but filters are hiding them all.`, cta: 'Reset filters' },
};

// Rule 4: pick the kind from the situation, never ship one generic screen.
// state: { total, visible, query, filters, error }
export function kindFor({ total = 0, visible = 0, query = '', filters = 0, error = null } = {}) {
  if (error) return 'error';
  if (visible > 0) return null;                       // not empty
  if (total === 0) return 'first-run';
  if (query) return 'no-results';
  if (filters > 0) return 'filtered';
  return 'first-run';
}

export const ICONS = {
  inbox: '<path d="M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6z"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/>',
  chat: '<path d="M12 4a8 8 0 0 0-6.9 12L4 20l4.2-1.1A8 8 0 1 0 12 4z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  rocket: '<path d="M5 15l-2 6 6-2M9 15l6-6M14 4c3-1.5 6-1 6 0s.5 3-1 6l-4 4-5-5zM7 12l-3 1 2-4 2 1M12 17l1 3 4-2-1-2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  alert: '<path d="M12 3l10 18H2zM12 10v5M12 18h.01"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  refresh: '<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3M18 3v4h-4M6 21v-4h4"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 17v3h16v-3"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
};
export const icon = (name, size = 24) => `<svg class="es-i" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;

// Render an empty state into root. Rules 1 to 3 are enforced: an icon, a human title + body, one primary CTA.
export function EmptyState(root, opts = {}) {
  const kind = opts.kind || 'first-run', base = KINDS[kind] || KINDS['first-run'];
  const o = { ...base, ...opts };
  if (typeof o.body === 'function') o.body = o.body(opts.count ?? 0);
  if (!o.cta) throw new Error('EmptyState: a primary CTA is mandatory (rule 3)');
  root.classList.add('es-empty', `es-empty--${o.tone}`);
  root.innerHTML = `${o.tag ? `<span class="es-tag">${esc(o.tag)}</span>` : ''}<div class="es-empty__tile">${icon(o.icon, 36)}</div><h3 class="es-empty__title">${esc(o.title)}</h3><p class="es-empty__body">${esc(o.body)}</p><button class="es-empty__cta" type="button">${esc(o.cta)}</button>${o.secondary ? `<a class="es-empty__alt" href="#">${icon('upload', 14)}${esc(o.secondary)}</a>` : ''}`;
  root.querySelector('.es-empty__cta').addEventListener('click', () => { o.onCta?.(kind); root.dispatchEvent(new CustomEvent('es:cta', { detail: { kind } })); });
  return root;
}

// Rule 5: a ghost preview of what a real item looks like, plus a drop zone. Pure markup, styled by pattern.css.
export function GhostPreview(root, { label = '← This is how a task looks', drop = 'Drag files here to start', progress = 60 } = {}) {
  root.innerHTML = `<div class="es-ghost"><i class="es-ghost__avatar"></i><i class="es-ghost__line" style="left:58px;top:24px;width:135px"></i><i class="es-ghost__line" style="left:58px;top:36px;width:85px"></i><i class="es-ghost__line" style="left:18px;top:60px;width:278px"></i><i class="es-ghost__line" style="left:18px;top:80px;width:215px"></i><div class="es-ghost__bar"><i style="width:${progress}%"></i></div></div><div class="es-ghost__label">${esc(label)}</div>${drop ? `<div class="es-drop">${icon('upload', 20)}<span>${esc(drop)}</span><b>↓</b></div>` : ''}`;
  const dz = root.querySelector('.es-drop');
  if (dz) { dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('is-over'); }); dz.addEventListener('dragleave', () => dz.classList.remove('is-over')); dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('is-over'); root.dispatchEvent(new CustomEvent('es:drop', { detail: [...e.dataTransfer.files] })); }); }
  return root;
}
