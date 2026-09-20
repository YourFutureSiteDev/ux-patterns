// Grid system: a 12-column grid, column ratios, gutters that set the mood, responsive column counts,
// and the same dashboard content re-flowed across all of it.

export const COLUMNS = 12;

// Column count for a viewport width: 12 desktop, 6 tablet, 4 large phone, 1 small phone.
export function columnsFor(width) { return width >= 1024 ? 12 : width >= 640 ? 6 : width >= 400 ? 4 : 1; }

// Gutter presets: the mood each one sets.
export const GUTTERS = { 8: 'Dense / Technical', 24: 'Balanced / Clean', 40: 'Editorial / Premium' };

// Paints faint column guides into `root` (position:relative/absolute box). cols = column count, gutter in px.
export function ColumnGuides(root, { cols = 12, gutter = 8, color = 'rgba(124,82,214,.10)', from = 0, span = null, inset = 0 } = {}) {
  root.querySelectorAll('.gs-guides').forEach(n => n.remove());
  const g = document.createElement('div'); g.className = 'gs-guides';
  const w = (span ?? root.clientWidth) - inset * 2;
  const colW = (w - gutter * (cols - 1)) / cols;
  for (let i = 0; i < cols; i++) {
    const c = document.createElement('i');
    c.style.cssText = `left:${inset + from + i * (colW + gutter)}px;width:${colW}px;background:${color}`;
    g.appendChild(c);
  }
  root.prepend(g);
  return g;
}

const STATS = [['Total Revenue', '$54,650', 'teal'], ['Customers', '2,847', 'green'], ['Growth', '+18.2%', 'purple']];
const NAV = ['Dashboard', 'Analytics', 'Customers', 'Products', 'Settings', 'Billing'];
const BARS10 = [118, 84, 148, 102, 178, 84, 140, 102, 156, 84];
const ROWS = [['Enterprise Plan', '$12,400', 'Active', 'green'], ['Starter Pack', '$3,200', 'Active', 'green'], ['Pro Monthly', '$8,750', 'Pending', 'purple'], ['Custom Deal', '$24,000', 'Active', 'green'], ['Agency License', '$6,300', 'Trial', 'muted']];

// Renders the ratio dashboard: sidebar spans `side` columns, content spans the rest of 12.
export function RatioDashboard(root, { side = 4 } = {}) {
  const content = COLUMNS - side;
  const stats = content >= 8 ? STATS : STATS.slice(0, 2);
  const bars = content >= 8 ? BARS10 : BARS10.slice(0, 8);
  root.style.setProperty('--side', side); root.style.setProperty('--content', content);
  root.innerHTML = `
    <aside class="gs-side">
      <div class="gs-brand"><i></i>Acme</div>
      ${NAV.map((n, i) => `<div class="gs-nav${i ? '' : ' is-on'}"><i></i>${n}</div>`).join('')}
    </aside>
    <main class="gs-main">
      <div class="gs-stats">${stats.map(([l, v, c]) => `<div class="gs-stat"><span>${l}</span><b class="is-${c}">${v}</b></div>`).join('')}</div>
      <div class="gs-chart"><h4>Revenue Overview</h4><div class="gs-bars">${bars.map(h => `<i style="height:${h}px"></i>`).join('')}</div></div>
      <div class="gs-table"><h4>Recent Transactions</h4>
        <div class="gs-tr gs-th"><span>Name</span><span>Amount</span><span>Status</span></div>
        ${ROWS.map(([n, a, s, c]) => `<div class="gs-tr"><span>${n}</span><span class="is-teal">${a}</span><span class="is-${c}">${s}</span></div>`).join('')}
      </div>
    </main>`;
  return { side, content };
}

const KPIS = [['Revenue', '$48.2K', '+12.5%', 'up'], ['Users', '2,847', '+8.1%', 'up'], ['Orders', '1,024', '-2.3%', 'down'], ['Conv. Rate', '3.6%', '+0.4%', 'up']];
const WEEK = [40, 62, 50, 76, 62, 90, 68];
const ORDERS = [['Alex Johnson', '$120'], ['Sarah Chen', '$165'], ['Mike Torres', '$89']];

// Renders the responsive dashboard for a column count (12 / 6 / 4 / 1). Same content, the grid reflows.
export function ResponsiveDashboard(root, cols = 12) {
  root.dataset.cols = cols;
  root.innerHTML = `
    ${KPIS.map(([l, v, d, dir]) => `<div class="gs-kpi"><span>${l}</span><b>${v}</b><em class="is-${dir}">${d}</em></div>`).join('')}
    <div class="gs-week"><span>Weekly Revenue</span><div class="gs-wbars">${WEEK.map(h => `<i style="height:${h}px"></i>`).join('')}</div></div>
    <div class="gs-orders"><span>Recent Orders</span>${ORDERS.map(([n, a]) => `<div><span>${n}</span><b>${a}</b></div>`).join('')}</div>`;
  return cols;
}

// Follow button with a toggled state.
export function FollowButton(btn) {
  let on = false;
  btn.addEventListener('click', () => { on = !on; btn.classList.toggle('is-on', on); btn.querySelector('span').textContent = on ? 'Following' : 'Follow'; });
  return { get following() { return on; } };
}
