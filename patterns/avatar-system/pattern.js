// Avatar system: fallback chain (image → initials → icon, never a broken square), deterministic colour from
// the name, two initials by default (one when tiny), overlap + overflow stacks, and presence on the ring.

export const palette = [
  { name: 'sky', hex: '#0EA5E9', bg: 'linear-gradient(160deg, #38bdf8, #0ea5e9 60%, #0284c7)' },
  { name: 'pink', hex: '#EC4899', bg: 'linear-gradient(160deg, #f472b6, #db2777)' },
  { name: 'green', hex: '#10B981', bg: 'linear-gradient(160deg, #34d399, #10b981)' },
  { name: 'violet', hex: '#7C3AED', bg: 'linear-gradient(160deg, #a78bfa, #6d5ce8)' },
  { name: 'amber', hex: '#F59E0B', bg: 'linear-gradient(160deg, #fbbf24, #f59e0b)' },
  { name: 'rose', hex: '#F43F5E', bg: 'linear-gradient(160deg, #fb7185, #e11d48)' },
];

// 32-bit FNV-1a: same name in, same number out, on every screen and every device.
export function hashName(name) {
  let h = 0x811c9dc5;
  for (const ch of String(name).trim().toLowerCase()) { h ^= ch.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}
export const hashHex = name => '0x' + hashName(name).toString(16).padStart(8, '0');
export const colorFromName = (name, pal = palette) => pal[hashName(name) % pal.length];

// Two letters read as a person; one letter only when the avatar is too small to hold two.
export function initials(name, size = 32) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const two = ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : parts[0]?.[1] || '')).toUpperCase();
  return size < 24 ? two.slice(0, 1) : two;
}

// Renders an avatar into `el` and walks the fallback chain: image if it loads, initials from the name,
// generic icon as the last resort. Sizes are tokens: 24 list, 32 header, 40 profile.
export const SIZES = { list: 24, header: 32, profile: 40 };
export function Avatar(el, { name = '', src = null, size = 32, status = null, ring = false } = {}) {
  const px = SIZES[size] || Number(size) || 32;
  el.classList.add('av-avatar'); el.style.setProperty('--size', px + 'px');
  el.dataset.name = name; el.setAttribute('role', 'img'); el.setAttribute('aria-label', name || 'user');
  const showInitials = () => { const c = colorFromName(name); el.dataset.fallback = 'initials'; el.style.background = c.bg; el.textContent = initials(name, px); };
  const showIcon = () => { el.dataset.fallback = 'icon'; el.style.background = ''; el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'; };
  if (src) {
    const img = new Image(); img.alt = name; img.decoding = 'async';
    img.onload = () => { el.dataset.fallback = 'image'; el.style.background = ''; el.replaceChildren(img); };
    img.onerror = () => (name ? showInitials() : showIcon());
    img.src = src; el.dataset.fallback = 'loading'; if (name) showInitials(); else showIcon();
  } else if (name) showInitials(); else showIcon();
  if (status) el.dataset.status = status; if (ring || status) el.classList.add('av-avatar--ring');
  return el;
}

// Overlapping group capped at `max`, the rest folded into a "+N" chip.
export function AvatarStack(el, users, { max = 4, size = 32, overlap = null } = {}) {
  el.classList.add('av-stack'); el.replaceChildren();
  const px = SIZES[size] || Number(size) || 32; el.style.setProperty('--size', px + 'px'); if (overlap != null) el.style.setProperty('--overlap', overlap + 'px');
  users.slice(0, max).forEach(u => el.appendChild(Avatar(document.createElement('span'), { name: u.name, src: u.src, size: px })));
  const rest = users.length - max;
  if (rest > 0) { const more = document.createElement('span'); more.className = 'av-avatar av-avatar--more'; more.style.setProperty('--size', px + 'px'); more.textContent = '+' + rest; el.appendChild(more); }
  el.setAttribute('aria-label', `${Math.min(max, users.length)} of ${users.length} members`);
  return el;
}

// Presence lives on the ring: one integrated signal, never a second badge.
export function setPresence(el, status) { el.dataset.status = status; el.classList.toggle('av-avatar--ring', !!status); }
