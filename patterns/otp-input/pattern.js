// OTP Input: six boxes as a view of one string. Paste distributes, focus auto-advances, backspace on an
// empty box jumps back, a wrong code shakes and clears, a right code locks green.
// Usage: const otp = OtpInput(rootEl, { length: 6, verify: code => Promise<boolean> | boolean });

export function OtpInput(root, opts = {}) {
  const boxes = [...root.querySelectorAll('.otp-box')];
  const length = opts.length ?? boxes.length;
  let code = boxes.map(b => (b.value ?? b.textContent).trim()).join('').slice(0, length);   // single source of truth
  let locked = false;

  const render = () => {
    boxes.forEach((b, i) => { const d = code[i] || ''; if ('value' in b) b.value = d; else b.textContent = d; b.classList.toggle('is-ok', locked); b.classList.toggle('is-locked', locked); });
    root.dispatchEvent(new CustomEvent('otp:change', { detail: { code } }));
  };
  const focus = i => { const b = boxes[Math.max(0, Math.min(length - 1, i))]; b.focus?.(); boxes.forEach(x => x.classList.toggle('is-focus', x === b)); };
  const setCode = (next, caret) => { code = next.replace(/\D/g, '').slice(0, length); render(); focus(caret ?? Math.min(code.length, length - 1)); if (code.length === length) submit(); };

  async function submit() {
    if (!opts.verify) return root.dispatchEvent(new CustomEvent('otp:complete', { detail: { code } }));
    const ok = await opts.verify(code);
    if (ok) { locked = true; render(); boxes.forEach(b => { b.classList.remove('is-focus'); if ('disabled' in b) b.disabled = true; }); root.dispatchEvent(new CustomEvent('otp:verified', { detail: { code } })); }
    else { await shakeAndClear(root); code = ''; render(); focus(0); root.dispatchEvent(new CustomEvent('otp:rejected')); }
  }

  boxes.forEach((b, i) => {
    if (!('value' in b)) return;                     // static boxes: view only
    b.setAttribute('inputmode', 'numeric'); if (i === 0) b.setAttribute('autocomplete', 'one-time-code');
    b.addEventListener('focus', () => { if (!locked) focus(i); });
    b.addEventListener('input', () => {
      if (locked) return;
      const digits = b.value.replace(/\D/g, '');
      if (digits.length > 1) return setCode(code.slice(0, i) + digits + code.slice(i + digits.length), i + digits.length);   // OS autofill lands whole codes in one box
      if (!digits) { b.value = ''; return; }
      setCode(code.slice(0, i) + digits + code.slice(i + 1), i + 1);   // auto-advance
    });
    b.addEventListener('keydown', e => {
      if (locked) return;
      if (e.key === 'Backspace') { e.preventDefault(); if (code[i]) setCode(code.slice(0, i) + code.slice(i + 1), i); else setCode(code.slice(0, i - 1) + code.slice(i), i - 1); }   // backspace on empty jumps back
      if (e.key === 'ArrowLeft') focus(i - 1); if (e.key === 'ArrowRight') focus(i + 1);
    });
    b.addEventListener('paste', e => {              // paste is the primary path: strip junk, fill every box
      e.preventDefault(); if (locked) return;
      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      setCode(pasted, pasted.length);
    });
  });

  return { get code() { return code; }, set: v => setCode(v), clear: () => setCode(''), focus, submit };
}

// Shake the boxes, then clear them (resolves when the shake is done).
export function shakeAndClear(root) {
  return new Promise(res => {
    root.classList.remove('is-shaking'); void root.offsetWidth; root.classList.add('is-shaking');
    root.querySelectorAll('.otp-box').forEach(b => b.classList.add('is-error'));
    setTimeout(() => {
      root.classList.remove('is-shaking');
      const boxes = [...root.querySelectorAll('.otp-box')];
      boxes.forEach((b, i) => { b.classList.remove('is-error', 'is-ok', 'is-locked', 'is-focus'); if ('value' in b) b.value = ''; else b.innerHTML = i === 0 ? '<i class="otp-caret"></i>' : ''; });
      boxes[0]?.classList.add('is-focus'); boxes[0]?.focus?.();
      res();
    }, 520);
  });
}

// Resend throttle: disables the button and runs a visible countdown ring until it hits zero.
export function ResendTimer(button, ring, opts = {}) {
  const seconds = opts.seconds ?? 30;
  const arc = ring?.querySelector('.otp-ring__arc'), text = ring?.querySelector('.otp-ring__t'), bt = button?.querySelector('.otp-resend__t');
  const C = 2 * Math.PI * 62; let iv = null, left = seconds;
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const set = s => {
    left = Math.max(0, Math.min(seconds, s));
    if (arc) arc.style.strokeDashoffset = C * (1 - left / seconds);
    if (text) text.textContent = fmt(left);
    if (button) { button.disabled = left > 0; button.classList.toggle('is-ready', left === 0); if (bt) bt.textContent = fmt(left); if (left === 0) button.innerHTML = button.innerHTML.replace(/Resend in.*$/, 'Resend code'); }
  };
  const start = (speed = 1) => { clearInterval(iv); set(seconds); iv = setInterval(() => { set(left - 1); if (left === 0) clearInterval(iv); }, 1000 / speed); };
  return { set, start, stop: () => clearInterval(iv), get left() { return left; } };
}
