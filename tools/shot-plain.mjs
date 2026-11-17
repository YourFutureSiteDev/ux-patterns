// One screenshot of a pattern demo that has no scenes (our own patterns), saved as scene-1.png
// so build-site.mjs can make its thumbnail. Needs the patterns folder served over http.
// usage: node tools/shot-plain.mjs <base url> <slug> [<slug>...]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exe = path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium_headless_shell-1234', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const [base, ...slugs] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
for (const slug of slugs) {
  await page.goto(`${base}/${slug}/demo.html`, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const out = path.join(root, 'tools', 'shots', slug);
  fs.mkdirSync(out, { recursive: true });
  await page.screenshot({ path: path.join(out, 'scene-1.png') });
  console.log(slug, 'ok');
}
await browser.close();
