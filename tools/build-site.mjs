// Build the static gallery into site/: copies every built pattern + the shared stage, renders a
// thumbnail per pattern from tools/shots (scene 1), and writes index.html with category filters.
// usage: node tools/build-site.mjs        then: npx wrangler pages deploy site --project-name ux-patterns
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'site');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const built = catalog.filter(p => fs.existsSync(path.join(root, 'patterns', p.slug, 'demo.html')));

fs.rmSync(site, { recursive: true, force: true });
fs.mkdirSync(path.join(site, 'patterns', '_shared'), { recursive: true });
fs.mkdirSync(path.join(site, 'thumbs'), { recursive: true });
fs.cpSync(path.join(root, 'patterns', '_shared'), path.join(site, 'patterns', '_shared'), { recursive: true });

let scenesTotal = 0;
for (const p of built) {
  const src = path.join(root, 'patterns', p.slug), dst = path.join(site, 'patterns', p.slug);
  fs.mkdirSync(dst, { recursive: true });
  for (const f of ['demo.html', 'pattern.css', 'pattern.js', 'README.md']) if (fs.existsSync(path.join(src, f))) fs.copyFileSync(path.join(src, f), path.join(dst, f));
  p.scenes = (fs.readFileSync(path.join(src, 'demo.html'), 'utf8').match(/class="scene/g) || []).length; scenesTotal += p.scenes;
  const shot = path.join(root, 'tools', 'shots', p.slug, 'scene-1.png');
  if (fs.existsSync(shot)) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', shot, '-vf', 'scale=360:640', '-q:v', '5', path.join(site, 'thumbs', `${p.slug}.jpg`)]);
  p.readme = fs.existsSync(path.join(src, 'README.md')) ? fs.readFileSync(path.join(src, 'README.md'), 'utf8') : '';
}

const cats = [...new Set(built.map(p => p.category))].sort();
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const card = p => `<a class="card" href="patterns/${p.slug}/demo.html" data-cat="${p.category}" data-q="${esc((p.title + ' ' + p.hook + ' ' + (p.caption || '') + ' ' + p.insights.join(' ')).toLowerCase())}">
  <img src="thumbs/${p.slug}.jpg" alt="" loading="lazy" width="360" height="640">
  <div class="card__body"><span class="cat cat--${p.category}">${p.category}</span><h3>${esc(p.title)}</h3><p>${esc(p.hook || p.caption || '')}</p><small>${p.scenes} scenes${p.views ? ' · ' + esc(p.views) + ' views' : ''}</small></div>
</a>`;

fs.writeFileSync(path.join(site, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>UX Patterns</title>
<meta name="description" content="${built.length} UX patterns from @designmotionhq rebuilt as working HTML, CSS and JS components, scene for scene.">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#0b0d11;--panel:#14171c;--border:rgba(255,255,255,.08);--text:#f2f4f7;--muted:#8b93a1;--accent:#2dd4bf}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
header{padding:48px 24px 16px;max-width:1280px;margin:0 auto}h1{font-size:40px;letter-spacing:-.02em;margin:0 0 6px}h1 em{font-style:normal;color:var(--accent)}
header p{color:var(--muted);margin:0 0 20px;max-width:640px;line-height:1.5}header p a{color:var(--accent)}
.bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.bar input{flex:1;min-width:220px;padding:12px 16px;border-radius:10px;border:1px solid var(--border);background:var(--panel);color:var(--text);font:inherit;font-size:15px}
.bar button{padding:9px 14px;border-radius:999px;border:1px solid var(--border);background:transparent;color:var(--muted);font:inherit;font-size:13px;font-weight:600;cursor:pointer}.bar button.on{background:var(--accent);color:#052a22;border-color:var(--accent)}
main{max-width:1280px;margin:0 auto;padding:16px 24px 80px;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px}
.card{display:block;background:var(--panel);border:1px solid var(--border);border-radius:14px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .18s ease,border-color .18s ease}.card:hover{transform:translateY(-3px);border-color:rgba(45,212,191,.5)}.card[hidden]{display:none}
.card img{display:block;width:100%;aspect-ratio:9/16;object-fit:cover;background:#000}.card__body{padding:12px 14px 14px}.card h3{margin:6px 0 4px;font-size:16px}.card p{margin:0 0 8px;color:var(--muted);font-size:13px;line-height:1.4}.card small{color:#5f6772;font-size:12px}
.cat{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}.cat--forms{color:#f59e0b}.cat--visual{color:#a78bfa}.cat--feedback{color:#2dd4bf}.cat--interaction{color:#60a5fa}.cat--content{color:#f472b6}.cat--navigation{color:#34d399}.cat--motion{color:#fb7185}
footer{max-width:1280px;margin:0 auto;padding:0 24px 48px;color:var(--muted);font-size:13px;line-height:1.6}footer a{color:var(--accent)}
@media (max-width:480px){header{padding:32px 16px 12px}h1{font-size:30px}main{padding:12px 16px 60px;grid-template-columns:repeat(2,1fr);gap:10px}}
</style></head><body>
<header><h1>UX <em>Patterns</em></h1><p>${built.length} patterns from <a href="https://www.instagram.com/designmotionhq/">@designmotionhq</a>, each rebuilt scene for scene as a working HTML, CSS and JS component. ${scenesTotal} scenes. Use ← → inside a pattern to step through its scenes.</p>
<div class="bar"><input id="q" type="search" placeholder="Search patterns…" aria-label="Search patterns"><button class="on" data-cat="">All</button>${cats.map(c => `<button data-cat="${c}">${c}</button>`).join('')}</div></header>
<main id="grid">${built.map(card).join('\n')}</main>
<footer>Rebuilt by <a href="https://yourfuturesite.com.au">Your Future Site</a> as our own implementation of each pattern. The originals, and the free written breakdowns, are at <a href="https://www.designmotionhq.com/patterns">designmotionhq.com/patterns</a>.</footer>
<script>
const cards=[...document.querySelectorAll('.card')],q=document.getElementById('q');let cat='';
const apply=()=>{const s=q.value.trim().toLowerCase();cards.forEach(c=>{c.hidden=(cat&&c.dataset.cat!==cat)||(s&&!c.dataset.q.includes(s));});};
q.addEventListener('input',apply);document.querySelectorAll('.bar button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.bar button').forEach(x=>x.classList.remove('on'));b.classList.add('on');cat=b.dataset.cat;apply();}));
</script></body></html>`);

// Per-pattern README as a sidebar page is overkill; the demo is the page. Keep a JSON index for the skill.
fs.writeFileSync(path.join(site, 'index.json'), JSON.stringify(built.map(p => ({ slug: p.slug, title: p.title, category: p.category, hook: p.hook, scenes: p.scenes, instagram: p.instagram, site: p.site })), null, 1));
console.log(`site: ${built.length} patterns, ${scenesTotal} scenes -> site/`);
