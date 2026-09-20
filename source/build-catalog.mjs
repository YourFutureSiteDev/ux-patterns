import fs from 'node:fs';
const site = JSON.parse(fs.readFileSync('source/patterns.json','utf8'));
const igmeta = {}; for (const f of fs.readdirSync('source/igmeta').filter(f=>f.endsWith('.json'))) { const j = JSON.parse(fs.readFileSync('source/igmeta/'+f)); igmeta[f.slice(0,-5)] = { caption: (j.description||'').split('\n')[0].trim(), views: j.view_count||null, likes: j.like_count||null, date: j.upload_date||null, dur: j.duration||null }; }
const reels = Object.fromEntries(fs.readFileSync('source/reels.txt','utf8').trim().split('\n').map(l=>{const [c,v]=l.split(' ');return [c,v];}));
// IG reels that are the same topic as an existing site pattern (attach the link)
const sameAsSite = { DdGkqx_t3vH:'css-has-selector', DdLvXSsNLpr:'reverse-engineered-linear', DdQ7QwqNLiY:'de-ai-landing-hero', DbdABtaNMs0:'behind-the-button', DbQJvWxty4v:'autosave-ux', DbX0IKMtBKr:'settings-system', DbvCsRetjhR:'disabled-buttons', Dbp5G_otN_c:'hover-trap', DbIaxSzNg97:'inline-editing', DbAsaXANvpq:'live-cursors', DaxPFk9tOuy:'context-menu', DasD0mctu1m:'swipe-actions', Dam5kJONlIN:'undo-ux', DahwAvbhOmx:'focus-states', DaU4BxwtF5N:'microcopy', 'Da4-EmYNYAP':'destructive-actions', DZmkBhghnD8:'otp-input', DZZ5y8cNZiE:'input-masking', DXCMEljsw3w:null };
// New patterns only on Instagram: code -> [slug, category, working title]
const igOnly = {
  'Dc-4jNbtyJg':['de-ai-dashboard','visual','De-AI Dashboard'],
  Dc3KFOaNfnW:['data-table-system','interaction','Data Table System'],
  Dc8RfGzNPCN:['responsive-table','interaction','Responsive Table'],
  DcGQMxYNjxh:['resizable-panels','interaction','Resizable Panels'],
  'DcikWR-NQPT':['avatar-system','visual','Avatar System'],
  DcLaVaGNfoy:['scroll-restoration','navigation','Scroll Restoration'],
  Dcnuc60NbeO:['notification-badge','feedback','Notification Badge'],
  'DcS6-2ltaLc':['copy-to-clipboard','feedback','Copy to Clipboard'],
  'DctFPo-tTQO':['dark-mode-surfaces','visual','Dark Mode Surfaces'],
  Dcx__07t8e5:['border-radius-system','visual','Border Radius System'],
  'DcYUpuzthq-':['double-submit-guard','forms','Double Submit Guard'],
  DcYX_cxNfOA:['number-formatting','content','Number Formatting'],
  DdbOcQ9tpKW:['calendar-week-view','interaction','Calendar Week View'],
  Ddd04e2tQWx:['typography-system','visual','Typography System'],
  DdWFVgYNYRB:['chat-ui-system','content','Chat UI System'],
  Db78b8stxa6:['pull-to-refresh','interaction','Pull to Refresh'],
  DbgqEnahoz6:['text-truncation','content','Text Truncation'],
  DZ2Dp5wt0pJ:['drag-and-drop-tips','interaction','Drag and Drop Tips'],
  DUoZ4_GDMWp:['perfect-button','visual','Perfect Button'],
  DUy5XFaDHqZ:['modal-backdrop','visual','Modal Backdrop and Depth'],
  DU_Nv2UjFSm:['decoy-effect','content','Decoy Effect'],
  DV84QvajG4R:['fitts-law','interaction','Fitts\'s Law'],
  DVC2fsoiEFC:['design-system-build','visual','Build a Design System'],
  DVLUTTWDHpz:['color-harmony','visual','Color Harmony'],
  DVZOM4HDJif:['radius-spectrum','visual','Radius Spectrum'],
  DVdixdNjGhC:['glassmorphism','visual','Glassmorphism'],
  DVqncGUjLec:['optical-corrections','visual','Optical Corrections'],
  DWCB3g6DPfi:['whitespace-types','visual','Whitespace Types'],
  DXCMEljsw3w:['atomic-design','visual','Atomic Design'],
  DUEjWRukT_2:['perceived-performance','feedback','Perceived Performance'],
  DUDy5gNDBVM:['button-feedback','feedback','Button Feedback'],
  DUJ5D2SCmDv:['pop-out-effect','visual','Pop-Out Effect'],
  DUKBLjHCsS8:['card-spacing-fixes','visual','Card Spacing Fixes'],
  DUQqwPBDLhL:['buy-button-css','visual','Buy Button CSS'],
  DUSsx9SDCCv:['rounded-shapes','visual','Rounded Shapes'],
  DUf3nehjIg7:['pricing-psychology','content','Pricing Psychology'],
};
const skipped = { DbLMlT3q8NA:'UX Engine promo', Dbnf7g1Kzp3:'UX Engine 2.0 promo', DWGjSOCjDBR:'Figma prototype promo', DUF21n5DPTj:'A* algorithm explainer', DUGAUJQDLe3:'Shazam explainer', DUGXEN7DOeO:'Dijkstra explainer', DUItsSpDnEC:'maze algorithm explainer', DUJIy7pDNW7:'dark patterns (hidden costs)', DUMdRsmjMWI:'dark patterns (manipulation)', DUOL_xpDA9C:'dark patterns (infinite scroll)', DUUAQyljIz9:'dark patterns (anxiety engine)' };
const cat = [];
for (const p of site) {
  const code = (p.instagram.match(/\/(?:reel|p)\/([^/]+)/)||[])[1] || Object.entries(sameAsSite).find(([c,s])=>s===p.slug)?.[0] || null;
  cat.push({ slug:p.slug, title:p.title, category:p.category, hook:p.hook, source:'site', video:`source/videos/${p.slug}.mp4`, frames:`source/frames/${p.slug}`, site:`https://www.designmotionhq.com/patterns/${p.slug}`, instagram: code?`https://www.instagram.com/reel/${code}/`:null, views: code?reels[code]||null:null, insights:p.insights, dodont:p.dodont, related:p.related });
}
for (const [code,[slug,category,title]] of Object.entries(igOnly)) {
  cat.push({ slug, title, category, hook:'', source:'instagram', video:`source/igvideos/${code}.mp4`, frames:`source/frames/${code}`, site:null, instagram:`https://www.instagram.com/reel/${code}/`, views:reels[code]||null, caption:igmeta[code].caption, insights:[], dodont:[], related:[] });
}
fs.writeFileSync('catalog.json', JSON.stringify(cat,null,2));
fs.writeFileSync('source/skipped.json', JSON.stringify(skipped,null,2));
console.log(cat.length,'patterns;', Object.keys(skipped).length,'skipped; by category:', Object.entries(cat.reduce((a,p)=>(a[p.category]=(a[p.category]||0)+1,a),{})).map(e=>e.join(' ')).join(', '));
