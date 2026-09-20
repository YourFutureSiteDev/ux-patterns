// Scrape designmotionhq.com/patterns: index + every pattern page via r.jina.ai
import fs from 'node:fs';
const J = u => fetch('https://r.jina.ai/' + u, {headers:{'X-Return-Format':'markdown'}}).then(r=>r.text());
const idx = await J('https://www.designmotionhq.com/patterns');
const slugs = [...new Set([...idx.matchAll(/designmotionhq\.com\/patterns\/([a-z0-9-]+)\)/g)].map(m=>m[1]))];
console.log('slugs', slugs.length);
const out = [];
for (const slug of slugs) {
  let md = '';
  for (let t=0;t<3 && !md.includes('## Key insights');t++) md = await J('https://www.designmotionhq.com/patterns/'+slug);
  const cat = (md.match(/\n(content|feedback|forms|interaction|motion|navigation|visual)\n\n# /)||[])[1] || '';
  const title = (md.match(/\n# (.+)/)||[])[1]?.trim() || slug;
  const hook = (md.split(/\n# .+\n/)[1]||'').split('\n').map(s=>s.trim()).find(s=>s && !s.startsWith('[')) || '';
  const video = (md.match(/https:\/\/pub-[^)\s]+\/videos\/[^)\s]+\.mp4/)||[])[0] || '';
  const ig = (md.match(/https:\/\/www\.instagram\.com\/(?:reel|p)\/[A-Za-z0-9_-]+\/?/)||[])[0] || '';
  const sec = (h) => { const m = md.match(new RegExp('## '+h+'\n\n([\s\S]*?)\n\n## ')); return m ? m[1].split('\n').filter(l=>l.startsWith('*')).map(l=>l.replace(/^\*\s+/,'').trim()) : []; };
  const insights = sec('Key insights'), dodont = sec('Do / Don\'t');
  const related = [...new Set([...(md.split('## Related patterns')[1]||'').matchAll(/patterns\/([a-z0-9-]+)\)/g)].map(m=>m[1]))];
  out.push({slug, title, category: cat, hook, video, instagram: ig, insights, dodont, related});
  fs.writeFileSync(`md/${slug}.md`, md);
  console.log(slug, cat, insights.length, dodont.length, video?'mp4':'NOVID', ig?'ig':'NOIG');
}
fs.writeFileSync('patterns.json', JSON.stringify(out, null, 2));
