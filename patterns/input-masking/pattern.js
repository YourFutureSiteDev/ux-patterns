// Input Masking: group a card number 4x4 as it is typed, keep the caret where it was, name the brand from the
// first digit, strip pasted junk, validate on blur, and hand back the raw digits for storage.
// Usage: const mask = CardMask(inputEl, { onBrand, onValidate }); mask.raw -> '4242424242424242'

export const brandOf = digits => /^4/.test(digits) ? 'visa' : /^5[1-5]|^2[2-7]/.test(digits) ? 'mastercard' : /^3[47]/.test(digits) ? 'amex' : '';
export const stripJunk = s => String(s).replace(/\D/g, '');
export const groupFour = d => d.replace(/(\d{4})(?=\d)/g, '$1 ');
export function luhn(d) { let s = 0, alt = false; for (let i = d.length - 1; i >= 0; i--) { let n = +d[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } s += n; alt = !alt; } return d.length >= 13 && s % 10 === 0; }

export function CardMask(input, opts = {}) {
  const max = opts.maxDigits ?? 16;
  let raw = stripJunk(input.value).slice(0, max);

  const render = (caretDigits) => {
    const formatted = groupFour(raw);
    input.value = formatted;
    if (caretDigits != null) {                       // put the caret after the Nth digit, not at the end
      let pos = 0, seen = 0;
      while (seen < caretDigits && pos < formatted.length) { if (/\d/.test(formatted[pos])) seen++; pos++; }
      input.setSelectionRange(pos, pos);
    }
    opts.onBrand?.(brandOf(raw));
    input.dispatchEvent(new CustomEvent('im:change', { detail: { raw, formatted, brand: brandOf(raw) } }));
  };

  input.addEventListener('input', () => {
    const caret = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = stripJunk(input.value.slice(0, caret)).length;
    raw = stripJunk(input.value).slice(0, max);
    render(Math.min(digitsBeforeCaret, raw.length));
    input.classList.remove('is-error');
  });
  input.addEventListener('paste', e => {                // strip junk on paste, then reformat to our grouping
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    const start = input.selectionStart ?? 0, end = input.selectionEnd ?? start;
    const before = stripJunk(input.value.slice(0, start)), after = stripJunk(input.value.slice(end));
    raw = (before + stripJunk(text) + after).slice(0, max);
    render(Math.min(before.length + stripJunk(text).length, raw.length));
    input.dispatchEvent(new CustomEvent('im:paste', { detail: { pasted: text, raw } }));
  });
  input.addEventListener('blur', () => {                // validate on blur, not on keystroke
    if (!raw) return;
    const ok = (opts.validate || luhn)(raw);
    opts.onValidate?.(ok, raw);
    input.dispatchEvent(new CustomEvent('im:validate', { detail: { ok, raw } }));
  });

  render();
  return { get raw() { return raw; }, get formatted() { return groupFour(raw); }, get brand() { return brandOf(raw); }, set(v) { raw = stripJunk(v).slice(0, max); render(raw.length); } };
}
