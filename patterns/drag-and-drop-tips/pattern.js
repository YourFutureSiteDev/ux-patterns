// Upload drag-and-drop signals: the zone answers the drag, progress is honest, a failure retries
// inline from where it stopped, the result shows a preview, and every file runs in its own lane.

// DropZone(zoneEl, { accept, onFiles }) — border + glow + copy while a file is over the zone.
// Adds .is-over on dragenter, swaps the title/hint to "Release to upload" + the file name, and
// hands the dropped FileList to onFiles.
export function DropZone(zone, opts = {}) {
  const title = zone.querySelector('.dt-zone__title'), hint = zone.querySelector('.dt-zone__hint');
  const idle = { title: title?.textContent, hint: hint?.textContent };
  const over = e => { e.preventDefault(); zone.classList.add('is-over'); const f = e.dataTransfer?.items?.[0]; if (title) title.textContent = 'Release to upload'; if (hint && f) hint.textContent = f.type || 'file'; };
  const leave = () => { zone.classList.remove('is-over'); if (title) title.textContent = idle.title; if (hint) hint.textContent = idle.hint; };
  zone.addEventListener('dragenter', over); zone.addEventListener('dragover', over); zone.addEventListener('dragleave', leave);
  zone.addEventListener('drop', e => { e.preventDefault(); leave(); zone.classList.add('is-safe'); zone.dispatchEvent(new CustomEvent('dt:files', { detail: e.dataTransfer.files })); opts.onFiles?.(e.dataTransfer.files); });
  return { reset: () => { leave(); zone.classList.remove('is-safe'); } };
}

// HonestProgress(cardEl, { total }) — set(percent, { speed, secondsLeft }) updates the number, the
// bar and the two stat rows so the user can decide to wait or walk away.
export function HonestProgress(root, opts = {}) {
  const n = root.querySelector('.dt-pct .n'), bar = root.querySelector('.dt-bar'), left = root.querySelector('.left'), speed = root.querySelector('.speed');
  const set = (p, x = {}) => {
    const v = Math.max(0, Math.min(100, Math.round(p)));
    n.textContent = v; bar.style.setProperty('--p', v); root.setAttribute('aria-valuenow', v);
    if (left && x.secondsLeft !== undefined) left.textContent = `${Math.max(0, Math.round(x.secondsLeft))}s left`;
    if (speed && x.speed !== undefined) speed.textContent = `${x.speed.toFixed(1)} MB/s`;
    if (v >= 100) root.classList.add('is-done');
  };
  root.setAttribute('role', 'progressbar'); root.setAttribute('aria-valuemin', '0'); root.setAttribute('aria-valuemax', '100');
  return { root, set };
}

// InlineRetry(cardEl, { from, request }) — the card shows the failure inline and keeps the file in
// memory; Retry resumes from `from` percent and runs `request` to finish the remaining bytes.
export function InlineRetry(root, opts = {}) {
  const from = opts.from ?? 90, n = root.querySelector('.dt-retry__pct .n'), bar = root.querySelector('.dt-bar'), status = root.querySelector('.dt-retry__status'), alert = root.querySelector('.dt-alert'), btn = root.querySelector('.dt-alert button');
  const paint = p => { n.textContent = Math.round(p); bar.style.setProperty('--p', p); };
  btn?.addEventListener('click', async () => {
    root.classList.add('is-resuming'); alert?.remove(); status.textContent = `Resuming from ${from}%…`;
    root.dispatchEvent(new CustomEvent('dt:retry', { detail: { from } }));
    const t0 = performance.now(), dur = 1200; const tick = () => { const k = Math.min(1, (performance.now() - t0) / dur); paint(from + (99 - from) * k); if (k < 1) requestAnimationFrame(tick); }; tick();
    try { await opts.request?.(); paint(100); status.textContent = 'Uploaded'; root.dispatchEvent(new CustomEvent('dt:done')); }
    catch { root.classList.remove('is-resuming'); status.textContent = `Paused at ${from}% — file kept in memory`; root.appendChild(alert); }
  });
  return { paint };
}

// UploadQueue(listEl, files, { upload }) — every file gets its own row and its own request; a
// failure marks only that row (.is-failed + Retry) while the others keep going.
export function UploadQueue(list, files, opts = {}) {
  const rows = [...files].map(file => {
    const row = document.createElement('div'); row.className = 'dt-row';
    row.innerHTML = `<span class="dt-row__icon"></span><div class="dt-row__body"><div class="dt-row__name"></div><div class="dt-bar" style="--p:0"><i></i></div></div><div class="dt-row__status"><span class="dt-row__pct">0%</span></div>`;
    row.querySelector('.dt-row__name').textContent = file.name; list.appendChild(row);
    const status = row.querySelector('.dt-row__status'), bar = row.querySelector('.dt-bar');
    const run = async () => {
      row.classList.remove('is-failed'); status.innerHTML = '<span class="dt-row__pct">0%</span>';
      try {
        await opts.upload(file, p => { bar.style.setProperty('--p', p); status.firstChild.textContent = Math.round(p) + '%'; });
        row.classList.add('is-done'); status.innerHTML = '<span class="dt-row__ok"><svg class="dt-ico" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></span>';
      } catch {
        row.classList.add('is-failed'); status.innerHTML = '<button class="dt-row__retry" type="button">Retry</button>'; status.querySelector('button').addEventListener('click', run);
      }
      list.dispatchEvent(new CustomEvent('dt:progress', { detail: summary() }));
    };
    return { file, row, run };
  });
  const summary = () => ({ done: rows.filter(r => r.row.classList.contains('is-done')).length, failed: rows.filter(r => r.row.classList.contains('is-failed')).length, total: rows.length });
  rows.forEach(r => r.run()); // independent lanes: all start, none waits on another
  return { rows, summary };
}
