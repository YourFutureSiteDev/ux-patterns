// Password Field UX: live strength meter, rules checklist, reveal toggle, paste allowed, suggested password.
// Usage: PasswordField(wrapperEl, { meter, row, tags, rules, eye, submit, onChange })
//   wrapperEl is the .pf-input element containing an <input>. All options are optional DOM nodes.

const WORDS = ['', 'Weak', 'Fair', 'Almost', 'Strong'];

// Entropy in bits: log2(charset ^ length), with a bonus for dictionary-style passphrases (word-word-word).
export function scoreEntropy(pw) {
  if (!pw) return 0;
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
  const words = pw.split(/[-_ .]/).filter(w => w.length >= 3);
  const passphrase = words.length >= 3 ? words.length * 12.9 : 0; // ~7776-word list, 12.9 bits per word
  return Math.round(Math.max(pw.length * Math.log2(pool || 1), passphrase));
}

// 0..4 level from entropy. 28 bits (P@ssw0rd!) is weak; 73 bits (wrong-mango-battery-sky) is strong.
export function levelFor(bits) { return bits === 0 ? 0 : bits < 30 ? 1 : bits < 45 ? 2 : bits < 60 ? 3 : 4; }

export const RULES = {
  upper: { label: '1 uppercase', test: pw => /[A-Z]/.test(pw) },
  number: { label: '1 number', test: pw => /[0-9]/.test(pw) },
  length: { label: '8+ characters', test: pw => pw.length >= 8 },
  symbol: { label: '1 symbol', test: pw => /[^a-zA-Z0-9]/.test(pw) },
};

// Coaching tags for what the password has earned so far (the reel's "first chars", "+ two words", "+ a number", "+ 16 chars").
export function tagsFor(pw) {
  const tags = [];
  if (pw.length) tags.push({ text: 'first chars', tone: 'pink' });
  const words = pw.split(/[-_ .]/).filter(Boolean);
  if (words.length >= 2) tags.push({ text: '+ two words', tone: 'amber' });
  if (/[0-9]/.test(pw)) tags.push({ text: '+ a number', tone: 'amber' });
  if (pw.length >= 16) tags.push({ text: `+ ${pw.length} chars`, tone: 'teal', spark: true });
  return tags;
}

export function PasswordField(wrap, opts = {}) {
  const input = wrap.querySelector('input');
  if (!input) return null;
  let revealed = input.type !== 'password';
  const render = () => {
    const pw = input.value, bits = scoreEntropy(pw), level = levelFor(bits);
    if (opts.meter) opts.meter.dataset.level = level;
    if (opts.row) { opts.row.dataset.level = level; const w = opts.row.querySelector('.pf-meter__word'); if (w) w.textContent = WORDS[level] || '—'; }
    if (opts.tags) opts.tags.innerHTML = tagsFor(pw).map(t => `<span class="pf-tag pf-tag--${t.tone}">${t.spark ? '<svg><use href="#i-spark"/></svg>' : ''}${t.text}</span>`).join('');
    if (opts.rules) for (const [key, rule] of Object.entries(RULES)) { const el = opts.rules.querySelector(`[data-rule="${key}"]`); if (el) el.classList.toggle('is-ok', rule.test(pw)); }
    if (opts.submit) { const ok = Object.values(RULES).every(r => r.test(pw)); opts.submit.disabled = !ok; opts.submit.classList.toggle('is-disabled', !ok); }
    opts.onChange?.({ value: pw, bits, level, word: WORDS[level] });
  };
  input.addEventListener('input', render);
  input.addEventListener('focus', () => wrap.classList.add('is-focus'));
  input.addEventListener('blur', () => wrap.classList.remove('is-focus'));
  // Never block paste: a password manager fills longer, stronger passwords than anyone types.
  input.addEventListener('paste', () => setTimeout(() => { render(); wrap.dispatchEvent(new CustomEvent('pf:pasted', { detail: { length: input.value.length } })); }));
  if (opts.eye) opts.eye.addEventListener('click', () => { revealed = !revealed; input.type = revealed ? 'text' : 'password'; opts.eye.setAttribute('aria-pressed', revealed); });
  render();
  return { render, get value() { return input.value; }, get bits() { return scoreEntropy(input.value); }, set(v) { input.value = v; render(); } };
}

// One-tap generated password (the OS / browser keychain pattern). 16 chars from a 70-symbol pool ≈ 98 bits.
export function generatePassword(len = 16) {
  const pool = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789#$%&*-_!?';
  const buf = new Uint32Array(len); crypto.getRandomValues(buf);
  return Array.from(buf, n => pool[n % pool.length]).join('');
}

// Crack time at 10 billion guesses per second, as the reel prints it ("2 hours", "3 centuries").
export function crackTime(bits) {
  const s = Math.pow(2, bits) / 1e10;
  if (s < 60) return 'instant';
  if (s < 3600) return `${Math.round(s / 60)} minutes`;
  if (s < 86400) return `${Math.round(s / 3600)} hours`;
  if (s < 31557600) return `${Math.round(s / 86400)} days`;
  if (s < 31557600 * 100) return `${Math.round(s / 31557600)} years`;
  return `${Math.round(s / (31557600 * 100))} centuries`;
}
