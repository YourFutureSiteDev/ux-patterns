// Copy to clipboard done right: flip to a check the same frame, reset after two seconds,
// copy the raw value (never the formatted span), announce through a live region, and fall back
// to execCommand on insecure origins instead of letting the button lie.

// Write `text` to the clipboard. Returns { ok, method } and never throws: on http:// origins
// navigator.clipboard is undefined or rejects with NotAllowedError, so we fall back to execCommand.
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return { ok: true, method: 'clipboard' }; }
    throw new Error('insecure origin');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch {}
    ta.remove();
    return { ok, method: ok ? 'execCommand' : 'none' };
  }
}

// One shared polite live region. Screen readers announce whatever is written into it.
let region;
export function announce(text) {
  if (!region) { region = document.createElement('div'); region.setAttribute('aria-live', 'polite'); region.setAttribute('role', 'status'); region.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)'; document.body.appendChild(region); }
  region.textContent = ''; requestAnimationFrame(() => { region.textContent = text; });
}

// Copy button. Usage: CopyButton(btn, { text: () => key, resetAfter: 2000 })
// - flips .is-copied on the same frame as the click (no spinner), then reconciles if the write failed
// - resets to idle after `resetAfter` ms so a second copy signals again
// - copies the raw string from `text`, not the DOM's formatted innerText
// - announces "Copied to clipboard" via a polite live region
export function CopyButton(btn, opts = {}) {
  const getText = typeof opts.text === 'function' ? opts.text : () => String(opts.text ?? '');
  const resetAfter = opts.resetAfter ?? 2000; let timer = null;
  const set = copied => { btn.classList.toggle('is-copied', copied); btn.setAttribute('aria-pressed', copied); };
  btn.addEventListener('click', async () => {
    set(true); clearTimeout(timer);                                     // 1. instant feedback
    const res = await copyText(getText().replace(/\s+/g, m => m.includes('\n') ? '' : m)); // 2. raw value (no formatting newlines)
    if (!res.ok) { set(false); btn.dispatchEvent(new CustomEvent('cb:failed')); announce(opts.failMessage ?? 'Copy failed'); return; } // 5. never lie
    announce(opts.message ?? 'Copied to clipboard');                    // 4. say it out loud
    btn.dispatchEvent(new CustomEvent('cb:copied', { detail: res }));
    timer = setTimeout(() => set(false), resetAfter);                    // 3. auto reset
  });
  return { reset() { clearTimeout(timer); set(false); } };
}

// Countdown ring for the auto-reset demo: set(elapsedMs, totalMs) fills the arc with what is left.
export function ResetRing(root) {
  const arc = root.querySelector('.cb-ring__arc');
  return { set(elapsed, total = 2000) { const left = Math.max(0, 1 - elapsed / total); arc.style.strokeDashoffset = 1 - left; arc.style.opacity = left > 0 ? 1 : 0; } };
}
