// File upload UX: drag feedback, honest progress, inline retry, upload preview, independent queue.

export const fmtSize = b => b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;
const eta = (sent, total, rate) => rate > 0 ? Math.max(0, Math.round((total - sent) / rate)) : null;

// Dropzone answers back the moment a file hovers: border, glow and copy all change before the drop.
export function Dropzone(zone, { onFiles, copy = { idle: 'Drop your file here', over: 'Release to upload' } } = {}) {
  const title = zone.querySelector('.fu-zone__title'), sub = zone.querySelector('.fu-zone__sub');
  const idleSub = sub?.textContent;
  const enter = e => { e.preventDefault(); zone.classList.add('is-over'); if (title) title.textContent = copy.over; const f = e.dataTransfer?.items?.[0]; if (sub && f && e.dataTransfer.files?.[0]) sub.textContent = `${e.dataTransfer.files[0].name} — ${fmtSize(e.dataTransfer.files[0].size)}`; };
  const leave = () => { zone.classList.remove('is-over'); if (title) title.textContent = copy.idle; if (sub) sub.textContent = idleSub; };
  zone.addEventListener('dragenter', enter); zone.addEventListener('dragover', enter); zone.addEventListener('dragleave', leave);
  zone.addEventListener('drop', e => { e.preventDefault(); leave(); onFiles?.([...e.dataTransfer.files]); });
  const input = zone.querySelector('input[type=file]');
  input?.addEventListener('change', () => onFiles?.([...input.files]));
}

// One upload with honest progress (percent, time left, rate) and inline retry that resumes from the last byte.
// `send(file, offset, onProgress, signal)` should upload from `offset` and resolve when done; reject on failure.
export function Upload(file, { send, onProgress, onDone, onError, chunk = false } = {}) {
  let offset = 0, sent = 0, lastT = performance.now(), lastB = 0, rate = 0, ctrl = null, status = 'idle';
  const emit = () => onProgress?.({ file, sent, total: file.size, pct: Math.round(sent / file.size * 100), rate, eta: eta(sent, file.size, rate), status });
  const run = async () => {
    status = 'uploading'; ctrl = new AbortController(); emit();
    try {
      await send(file, offset, loaded => {
        sent = offset + loaded; const t = performance.now();
        if (t - lastT > 400) { rate = (sent - lastB) / ((t - lastT) / 1000); lastT = t; lastB = sent; }
        emit();
      }, ctrl.signal);
      status = 'done'; sent = file.size; emit(); onDone?.(file);
    } catch (err) {
      status = 'failed'; offset = sent; emit(); onError?.(err, api);           // file kept in memory, resume from here
    }
  };
  const api = { start: run, retry: run, cancel: () => ctrl?.abort(), get status() { return status; }, get offset() { return offset; } };
  return api;
}

// Preview: thumbnail, type and size as proof the right file arrived (images get a real thumbnail).
export async function preview(file) {
  const type = (file.type.split('/')[1] || file.name.split('.').pop() || '').toUpperCase();
  const out = { name: file.name, type, size: fmtSize(file.size), url: null, dims: null };
  if (file.type.startsWith('image/')) {
    out.url = URL.createObjectURL(file);
    await new Promise(res => { const img = new Image(); img.onload = () => { out.dims = `${img.naturalWidth} × ${img.naturalHeight}`; res(); }; img.onerror = res; img.src = out.url; });
  }
  return out;
}

// Independent queue: every file gets its own lane, its own progress and its own retry. One failure never blocks the rest.
export function UploadQueue(files, { send, concurrency = 3, onLane, onSummary } = {}) {
  const lanes = files.map(file => ({ file, pct: 0, status: 'queued', upload: null }));
  const summary = () => { const done = lanes.filter(l => l.status === 'done').length, failed = lanes.filter(l => l.status === 'failed').length; onSummary?.({ done, failed, total: lanes.length, label: failed ? `${done} of ${lanes.length} — ${failed} failed` : `${done} of ${lanes.length} done` }); };
  let active = 0, i = 0;
  const next = () => {
    while (active < concurrency && i < lanes.length) {
      const lane = lanes[i++]; active++;
      lane.upload = Upload(lane.file, { send,
        onProgress: p => { lane.pct = p.pct; lane.status = p.status; onLane?.(lane); },
        onDone: () => { active--; lane.status = 'done'; onLane?.(lane); summary(); next(); },
        onError: () => { active--; lane.status = 'failed'; onLane?.(lane); summary(); next(); } });
      lane.upload.start();
    }
  };
  next(); summary();
  return { lanes, retry: lane => { lane.status = 'uploading'; lane.upload.retry(); } };
}

// XHR sender with real progress events and Range-style resume via the Content-Range header.
export const xhrSend = url => (file, offset, onProgress, signal) => new Promise((res, rej) => {
  const xhr = new XMLHttpRequest(); xhr.open('PUT', url);
  xhr.setRequestHeader('Content-Range', `bytes ${offset}-${file.size - 1}/${file.size}`);
  xhr.upload.onprogress = e => onProgress(e.loaded);
  xhr.onload = () => xhr.status < 300 ? res(xhr.response) : rej(new Error(xhr.statusText));
  xhr.onerror = () => rej(new Error('Connection lost'));
  signal?.addEventListener('abort', () => xhr.abort());
  xhr.send(file.slice(offset));
});

// Demo sender: fakes a 48 MB upload at ~2.5 MB/s; `failAt` (0..1) throws once at that fraction.
export const fakeSend = ({ rate = 2.5e6, failAt = null } = {}) => { let failed = false; return (file, offset, onProgress, signal) => new Promise((res, rej) => {
  let sent = 0; const total = file.size - offset; const iv = setInterval(() => {
    sent = Math.min(total, sent + rate / 10); onProgress(sent);
    if (failAt !== null && !failed && (offset + sent) / file.size >= failAt) { failed = true; clearInterval(iv); rej(new Error('Connection lost')); }
    else if (sent >= total) { clearInterval(iv); res(); }
  }, 100);
  signal?.addEventListener('abort', () => { clearInterval(iv); rej(new Error('aborted')); });
}); };
