// Screenshot every scene of a pattern demo at 720x1280 and lay each one beside its source frame.
// usage: node tools/shot.mjs <slug> [<slug>...]   -> tools/shots/<slug>/scene-N.png + compare-N.jpg
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import http from 'node:http';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const exe = path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium_headless_shell-1234', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
// Serve the repo over http so <script type="module"> imports work (they are blocked over file://).
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: exe });

for (const slug of process.argv.slice(2)) {
  const p = catalog.find(c => c.slug === slug);
  if (!p) { console.error('no such pattern', slug); continue; }
  const demo = path.join(root, 'patterns', slug, 'demo.html');
  if (!fs.existsSync(demo)) { console.error('no demo', slug); continue; }
  const out = path.join(root, 'tools', 'shots', slug);
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1 });
  const url = `${base}/patterns/${slug}/demo.html`;
  await page.goto(url);
  const scenes = await page.$$eval('.scene', els => els.map(e => ({ t: Number(e.dataset.t) || 0, shot: e.dataset.shot ? Number(e.dataset.shot) : null })));
  for (let i = 0; i < scenes.length; i++) {
    const t = scenes[i].shot ?? scenes[i].t; // data-shot: the source time (s) this scene is compared at
    await page.goto(`${url}?scene=${i + 1}&t=${t}`);
    await page.waitForTimeout(500);
    const shot = path.join(out, `scene-${i + 1}.png`);
    await page.screenshot({ path: shot });
    const idx = String(Math.max(1, Math.round(t / 1.5) + 1)).padStart(3, '0'); // frames every 1.5 s, 001 = 0 s
    const frame = path.join(root, p.frames, `${idx}.jpg`);
    if (fs.existsSync(frame)) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', frame, '-i', shot, '-filter_complex', '[0:v]scale=720:1280[a];[1:v]scale=720:1280[b];[a][b]hstack', '-q:v', '3', path.join(out, `compare-${i + 1}.jpg`)]);
  }
  console.log(slug, scenes.length, 'scenes ->', path.relative(root, out));
  await page.close();
}
await browser.close();
server.close();
