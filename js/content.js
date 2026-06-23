/* ============================================================
   NEURAL ARCH — Dynamic Content Loader v3 (clean rewrite)
   ============================================================ */

const CAT_LABELS = { ml:'Machine Learning', nlp:'NLP', genai:'Generative AI', viz:'Data Viz / Analytics' };
const CAT_SVG = {
  ml:`<svg viewBox="0 0 300 188" xmlns="http://www.w3.org/2000/svg"><path d="M10 150 Q80 40 150 100 T290 30" stroke="#F7F1E8" stroke-width="2" fill="none"/><circle cx="10" cy="150" r="4" fill="#F7F1E8"/><circle cx="150" cy="100" r="4" fill="#F7F1E8"/><circle cx="290" cy="30" r="4" fill="#F7F1E8"/></svg>`,
  nlp:`<svg viewBox="0 0 300 188" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="40" width="40" height="40" fill="#F7F1E8" opacity=".7"/><rect x="80" y="80" width="40" height="40" fill="#F7F1E8" opacity=".9"/><rect x="140" y="50" width="40" height="40" fill="#F7F1E8" opacity=".6"/><rect x="200" y="100" width="40" height="40" fill="#F7F1E8" opacity=".8"/></svg>`,
  genai:`<svg viewBox="0 0 300 188" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="94" r="50" fill="none" stroke="#F7F1E8" stroke-width="1.5"/><circle cx="150" cy="94" r="30" fill="none" stroke="#F7F1E8" stroke-width="1.5"/><circle cx="150" cy="94" r="10" fill="#F7F1E8"/></svg>`,
  viz:`<svg viewBox="0 0 300 188" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="100" width="24" height="60" fill="#F7F1E8"/><rect x="70" y="60" width="24" height="100" fill="#F7F1E8"/><rect x="110" y="120" width="24" height="40" fill="#F7F1E8"/><rect x="150" y="40" width="24" height="120" fill="#F7F1E8"/><rect x="190" y="80" width="24" height="80" fill="#F7F1E8"/></svg>`
};

function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function formatDate(iso){ if(!iso) return ''; const d=new Date(iso); return isNaN(d)?iso:d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }
function setHTML(id,html){ const e=document.getElementById(id); if(e) e.innerHTML=html; }

async function getJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('HTTP '+res.status+' fetching '+path);
  return res.json();
}

function projectCard(p){
  const thumb = p.image ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">` : (CAT_SVG[p.category]||CAT_SVG.ml);
  const stack = (p.stack||[]).map(s=>`<span>${s}</span>`).join('');
  const demo  = p.demo_url   && p.demo_url   !='#' ? `<a href="${p.demo_url}"  target="_blank" rel="noopener">Live demo</a>` : '';
  const gh    = p.github_url && p.github_url !='#' ? `<a href="${p.github_url}" target="_blank" rel="noopener">GitHub</a>` : '';
  return `<article class="card project-card" data-category="${p.category}">
    <div class="thumb"><span class="cat">${CAT_LABELS[p.category]||p.category}</span>${thumb}</div>
    <div class="body"><h3>${p.title}</h3><p>${p.description}</p><div class="stack">${stack}</div>${(demo||gh)?'<div class="links">'+demo+gh+'</div>':''}</div>
  </article>`;
}

function blogCard(p,i){
  const bg = p.cover_image
    ? `background:url('${p.cover_image}') center/cover`
    : ['background:linear-gradient(135deg,var(--maroon),var(--espresso))','background:linear-gradient(135deg,var(--terracotta),var(--maroon))','background:linear-gradient(135deg,var(--espresso),var(--gold-thread))'][i%3];
  return `<article class="card blog-card">
    <div class="thumb" style="aspect-ratio:16/10;${bg};"></div>
    <div class="body">
      <span class="date">${formatDate(p.date)}</span>
      <h3>${p.title}</h3>
      <p>${p.summary||''}</p>
      <a href="blog-post.html?post=${slugify(p.title)}" class="read">Read article →</a>
    </div>
  </article>`;
}

async function loadFeaturedProjects(id){
  const el=document.getElementById(id); if(!el) return;
  try{
    const data=await getJSON('/data/projects.json');
    const list=(data.projects||data).filter(p=>p.featured);
    if(!list.length){ el.innerHTML='<p style="opacity:.6;font-family:var(--font-mono);font-size:.85rem;">No featured projects yet.</p>'; return; }
    el.innerHTML=list.map(projectCard).join('');
    el.classList.add('reveal-stagger','in');
    if(window.initFilters) window.initFilters();
  }catch(e){ console.error('[NA] projects error',e); el.innerHTML='<p style="color:var(--terracotta);font-family:var(--font-mono);font-size:.82rem;">Could not load projects.</p>'; }
}

async function loadAllProjects(id,countId){
  const el=document.getElementById(id); if(!el) return;
  try{
    const data=await getJSON('/data/projects.json');
    const list=data.projects||data;
    if(!list.length){ el.innerHTML='<p style="opacity:.6;">No projects yet.</p>'; return; }
    el.innerHTML=list.map(projectCard).join('');
    const c=document.getElementById(countId); if(c) c.textContent='All ('+list.length+')';
    el.classList.add('reveal-stagger','in');
    if(window.initFilters) window.initFilters();
  }catch(e){ console.error('[NA] all-projects error',e); }
}

async function loadBlogPosts(id){
  const el=document.getElementById(id); if(!el) return;
  try{
    const data=await getJSON('/data/blog.json');
    const all=data.posts||data;
    console.log('[NA] Total posts:',all.length);
    all.forEach((p,i)=>console.log('  ['+i+'] "'+p.title+'" published='+p.published));
    const pub=all.filter(p=>p.published===true);
    console.log('[NA] Published:',pub.length);
    if(!pub.length){
      el.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:3rem 0;"><p style="font-family:var(--font-mono);font-size:.85rem;color:var(--terracotta);">No published posts yet.</p><p style="font-size:.88rem;opacity:.6;margin-top:.5rem;">Go to the <a href="/admin" style="color:var(--maroon);">admin panel</a>, open your post, turn <strong>Published ON</strong>, save and publish.</p></div>';
      return;
    }
    el.innerHTML=pub.map((p,i)=>blogCard(p,i)).join('');
    el.classList.add('reveal-stagger','in');
  }catch(e){ console.error('[NA] blog error',e); el.innerHTML='<p style="color:var(--terracotta);font-family:var(--font-mono);font-size:.82rem;">Error: '+e.message+'</p>'; }
}

async function loadSinglePost(){
  const slug=new URLSearchParams(location.search).get('post');
  const el=document.getElementById('post-content'); if(!el) return;
  try{
    const data=await getJSON('/data/blog.json');
    const post=(data.posts||data).find(p=>slugify(p.title)===slug&&p.published===true);
    if(!post){ el.innerHTML='<p class="lede">Post not found.</p>'; return; }
    const t=document.getElementById('post-title'); if(t) t.textContent=post.title;
    const d=document.getElementById('post-date');  if(d) d.textContent=formatDate(post.date);
    const c=document.getElementById('post-cover');
    if(c&&post.cover_image){ c.src=post.cover_image; c.style.display='block'; }
    document.title=post.title+' — Don Nipuni Athale';
    el.innerHTML=window.marked ? window.marked.parse(post.content||'') : '<pre style="white-space:pre-wrap;">'+post.content+'</pre>';
  }catch(e){ console.error('[NA] single post error',e); el.innerHTML='<p class="lede">Could not load post.</p>'; }
}

async function loadAboutData(){
  try{
    const d=await getJSON('/data/about.json');
    const hb=document.getElementById('home-bio');  if(hb) hb.textContent=d.bio_home||'';
    const ab=document.getElementById('about-bio'); if(ab) ab.textContent=d.bio_about||'';
    document.querySelectorAll('[data-focus-pills]').forEach(el=>{
      el.innerHTML=(d.focus_areas||[]).map(f=>`<span class="pill">${f}</span>`).join('');
    });
    const hg=document.getElementById('highlights-grid');
    if(hg&&d.achievements) hg.innerHTML=d.achievements.map(a=>`<div class="highlight-card"><span class="num">${a.num}</span><span class="lbl">${a.label}</span></div>`).join('');
    const tl=document.getElementById('timeline');
    if(tl&&d.timeline) tl.innerHTML=d.timeline.map(t=>`<div class="t-item"><span class="t-date">${t.date}</span><h4 style="color:var(--cream);">${t.title}</h4><span class="t-org" style="color:var(--cream);">${t.org_link?`<a href="${t.org_link}" target="_blank" rel="noopener" style="color:var(--terracotta-light);border-bottom:1px solid currentColor;">${t.org}</a>`:t.org}</span><p style="color:var(--cream);">${t.description}</p></div>`).join('');
    const cr=document.getElementById('certifications');
    if(cr&&d.certifications) cr.innerHTML=d.certifications.map(c=>`<div class="t-item"><span class="t-date">${c.date}</span><h4>${c.url?`<a href="${c.url}" target="_blank" rel="noopener" style="border-bottom:1px solid var(--terracotta);color:inherit;">${c.name}</a>`:c.name}</h4><span class="t-org">${c.issuer}</span><p>${c.description}</p></div>`).join('');
  }catch(e){ console.warn('[NA] about error',e); }
}

document.addEventListener('DOMContentLoaded',()=>{
  const page=location.pathname.split('/').pop()||'index.html';
  console.log('[NA] page:',page);
  if(page==='index.html'||page===''){  loadFeaturedProjects('featured-projects'); loadAboutData(); }
  if(page==='projects.html')          loadFeaturedProjects('featured-projects');
  if(page==='all-projects.html')      loadAllProjects('all-projects-grid','all-count');
  if(page==='blog.html')              loadBlogPosts('blog-grid');
  if(page==='blog-post.html')         loadSinglePost();
  if(page==='about.html')             loadAboutData();
});
