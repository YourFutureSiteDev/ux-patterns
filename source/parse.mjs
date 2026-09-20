import fs from 'node:fs';
const slugs = fs.readdirSync('md').map(f=>f.replace(/\.md$/,''));
const out = [];
for (const slug of slugs) {
  const md = fs.readFileSync(`md/${slug}.md`,'utf8').replace(/\r/g,'');
  const cat = (md.match(/\n(content|feedback|forms|interaction|motion|navigation|visual)\n\n# /)||[])[1] || '';
  const title = (md.match(/\n# (.+)/)||[])[1]?.trim() || slug;
  const hook = (md.split(/\n# .+\n/)[1]||'').split('\n').map(s=>s.trim()).find(s=>s && !s.startsWith('[')) || '';
  const video = (md.match(/https:\/\/pub-[^)\s]+\/videos\/[^)\s]+\.mp4/)||[])[0] || '';
  const ig = (md.match(/https:\/\/www\.instagram\.com\/(?:reel|p)\/[A-Za-z0-9_-]+\/?/)||[])[0] || '';
  const bullets = (h) => { const i = md.indexOf('## '+h); if (i<0) return []; const body = md.slice(i).split('\n').slice(1); const res=[]; for (const l of body){ if (l.startsWith('## ')) break; if (l.startsWith('*')) res.push(l.replace(/^\*\s+/,'').trim()); } return res; };
  const insights = bullets('Key insights'), dodont = bullets("Do / Don't");
  const related = [...new Set([...(md.split('## Related patterns')[1]||'').matchAll(/patterns\/([a-z0-9-]+)\)/g)].map(m=>m[1]))];
  out.push({slug, title, category: cat, hook, video, instagram: ig, insights, dodont, related});
}
fs.writeFileSync('patterns.json', JSON.stringify(out, null, 2));
const bad = out.filter(p=>!p.insights.length||!p.dodont.length||!p.video||!p.category);
console.log(out.length, 'patterns; incomplete:', bad.map(p=>p.slug+':'+[!p.insights.length&&'ins',!p.dodont.length&&'dd',!p.video&&'vid',!p.category&&'cat'].filter(Boolean)));
console.log('no IG link:', out.filter(p=>!p.instagram).length);
