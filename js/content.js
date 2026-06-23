/* ============================================================
   NEURAL ARCH — Dynamic Content Loader
   Reads from data/projects.json, data/blog.json, data/about.json
   Renders cards/sections dynamically so the CMS drives all content.
   ============================================================ */

const CAT_LABELS = {
  ml:    'Machine Learning',
  nlp:   'NLP',
  genai: 'Generative AI',
  viz:   'Data Viz / Analytics'
};

const CAT_SVG = {
  ml: `<svg viewBox="0 0 300 188" xmlns="http://www.w3.org/2000/svg"><path d="M10 150 Q80 40 150 100 T290 30" stroke="#F7F1E8" stroke-width="2" fill="none"/><circle cx="10" cy="150" r="4" fill="#F7F1E8"/><circle cx="150" cy="100" r="4" fill="#F7F1E8"/><circle cx="290" cy="30" r="4" fill="#F7F1E8"/></svg>`,
  nlp: `<svg viewBox="0 0 300 188" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="40" width="40" height="40" fill="#F7F1E8" opacity=".7"/><rect x="80" y="80" width="40" height="40" fill="#F7F1E8" opacity=".9"/><rect x="140" y="50" width="40" height="40" fill="#F7F1E8" opacity=".6"/><rect x="200" y="100" width="40" height="40" fill="#F7F1E8" opacity=".8"/></svg>`,
  genai: `<svg viewBox="0 0 300 188" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="94" r="50" fill="none" stroke="#F7F1E8" stroke-width="1.5"/><circle cx="150" cy="94" r="30" fill="none" stroke="#F7F1E8" stroke-width="1.5"/><circle cx="150" cy="94" r="10" fill="#F7F1E8"/></svg>`,
  viz: `<svg viewBox="0 0 300 188" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="100" width="24" height="60" fill="#F7F1E8"/><rect x="70" y="60" width="24" height="100" fill="#F7F1E8"/><rect x="110" y="120" width="24" height="40" fill="#F7F1E8"/><rect x="150" y="40" width="24" height="120" fill="#F7F1E8"/><rect x="190" y="80" width="24" height="80" fill="#F7F1E8"/></svg>`
};

/* ---------- helpers ---------- */
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'});
}

function loading(el, msg = 'Loading…') {
  if (el) el.innerHTML = `<p style="font-family:var(--font-mono);font-size:.85rem;opacity:.55;padding:1rem 0;">${msg}</p>`;
}

function error(el, msg) {
  if (el) el.innerHTML = `<p style="color:var(--terracotta);font-family:var(--font-mono);font-size:.82rem;padding:1rem 0;">⚠ ${msg}</p>`;
}

/* ---------- render a single project card ---------- */
function projectCard(p) {
  const thumb = p.image
    ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">`
    : (CAT_SVG[p.category] || CAT_SVG.ml);

  const stack = (p.stack || []).map(s => `<span>${s}</span>`).join('');
  const demo  = p.demo_url  && p.demo_url  !== '#' ? `<a href="${p.demo_url}"  target="_blank" rel="noopener">Live demo</a>` : '';
  const gh    = p.github_url && p.github_url !== '#' ? `<a href="${p.github_url}" target="_blank" rel="noopener">GitHub</a>` : '';
  const links = (demo || gh) ? `<div class="links">${demo}${gh}</div>` : '';

  return `
    <article class="card project-card" data-category="${p.category}">
      <div class="thumb">
        <span class="cat">${CAT_LABELS[p.category] || p.category}</span>
        ${thumb}
      </div>
      <div class="body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="stack">${stack}</div>
        ${links}
      </div>
    </article>`;
}

/* ---------- render a single blog card ---------- */
function blogCard(post, idx) {
  const slug   = slugify(post.title);
  const bg     = post.cover_image
    ? `background:url('${post.cover_image}') center/cover`
    : ['background:linear-gradient(135deg,var(--maroon),var(--espresso))',
       'background:linear-gradient(135deg,var(--terracotta),var(--maroon))',
       'background:linear-gradient(135deg,var(--espresso),var(--gold-thread))'][idx % 3];

  return `
    <article class="card blog-card">
      <div class="thumb" style="aspect-ratio:16/10;${bg};"></div>
      <div class="body">
        <span class="date">${formatDate(post.date)}</span>
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
        <a href="blog-post.html?post=${slug}" class="read">Read article →</a>
      </div>
    </article>`;
}

/* ============================================================
   PROJECTS — Featured (index.html + projects.html)
   ============================================================ */
async function loadFeaturedProjects(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  loading(el, 'Loading projects…');
  try {
    const res  = await fetch('/data/projects.json');
    const data = await res.json();
    const featured = (data.projects || []).filter(p => p.featured);
    if (!featured.length) { error(el, 'No featured projects yet — add some in the admin panel.'); return; }
    el.innerHTML = featured.map(projectCard).join('');
    el.classList.add('reveal-stagger', 'in');
    if (window.initFilters) window.initFilters();
  } catch(e) {
    error(el, 'Could not load projects.');
  }
}

/* ============================================================
   PROJECTS — All (all-projects.html)
   ============================================================ */
async function loadAllProjects(containerId, countId) {
  const el    = document.getElementById(containerId);
  const count = document.getElementById(countId);
  if (!el) return;
  loading(el, 'Loading all projects…');
  try {
    const res  = await fetch('/data/projects.json');
    const data = await res.json();
    const all  = data.projects || [];
    if (!all.length) { error(el, 'No projects yet.'); return; }
    el.innerHTML = all.map(projectCard).join('');
    if (count) count.textContent = `All (${all.length})`;
    el.classList.add('reveal-stagger', 'in');
    if (window.initFilters) window.initFilters();
  } catch(e) {
    error(el, 'Could not load projects.');
  }
}

/* ============================================================
   BLOG — Listing (blog.html)
   ============================================================ */
async function loadBlogPosts(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  loading(el, 'Loading posts…');
  try {
    const res  = await fetch('/data/blog.json');
    const data = await res.json();
    const published = (data.posts || []).filter(p => p.published);
    if (!published.length) {
      el.innerHTML = `<p class="lede text-center" style="margin-inline:auto;opacity:.7;">No published posts yet — write your first article in the admin panel.</p>`;
      return;
    }
    el.innerHTML = published.map((post, i) => blogCard(post, i)).join('');
    el.classList.add('reveal-stagger', 'in');
  } catch(e) {
    error(el, 'Could not load blog posts.');
  }
}

/* ============================================================
   BLOG — Single Post (blog-post.html)
   ============================================================ */
async function loadSinglePost() {
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('post');
  const titleEl   = document.getElementById('post-title');
  const dateEl    = document.getElementById('post-date');
  const contentEl = document.getElementById('post-content');
  const coverEl   = document.getElementById('post-cover');
  if (!contentEl) return;

  try {
    const res  = await fetch('/data/blog.json');
    const data = await res.json();
    const post = (data.posts || []).find(p => slugify(p.title) === slug && p.published);

    if (!post) {
      contentEl.innerHTML = '<p class="lede">Post not found or not yet published.</p>';
      return;
    }
    if (titleEl)   titleEl.textContent  = post.title;
    if (dateEl)    dateEl.textContent   = formatDate(post.date);
    if (coverEl && post.cover_image) {
      coverEl.src   = post.cover_image;
      coverEl.style.display = 'block';
    }
    document.title = `${post.title} — Don Nipuni Athale`;

    // Render markdown with marked.js (loaded in blog-post.html)
    if (window.marked) {
      contentEl.innerHTML = window.marked.parse(post.content || '');
    } else {
      contentEl.innerHTML = `<pre style="white-space:pre-wrap;">${post.content}</pre>`;
    }
  } catch(e) {
    if (contentEl) contentEl.innerHTML = '<p class="lede">Could not load post.</p>';
  }
}

/* ============================================================
   ABOUT — Dynamic sections (about.html + index.html teaser)
   ============================================================ */
async function loadAboutData() {
  try {
    const res  = await fetch('/data/about.json');
    const data = await res.json();

    /* bio teaser on homepage */
    const homeBio = document.getElementById('home-bio');
    if (homeBio) homeBio.textContent = data.bio_home || '';

    /* full bio on about page */
    const aboutBio = document.getElementById('about-bio');
    if (aboutBio) aboutBio.textContent = data.bio_about || '';

    /* focus pills */
    document.querySelectorAll('[data-focus-pills]').forEach(el => {
      el.innerHTML = (data.focus_areas || []).map(f => `<span class="pill">${f}</span>`).join('');
    });

    /* highlights grid */
    const highlights = document.getElementById('highlights-grid');
    if (highlights && data.achievements) {
      highlights.innerHTML = data.achievements.map(a =>
        `<div class="highlight-card"><span class="num">${a.num}</span><span class="lbl">${a.label}</span></div>`
      ).join('');
    }

    /* timeline (education/experience) */
    const timeline = document.getElementById('timeline');
    if (timeline && data.timeline) {
      timeline.innerHTML = data.timeline.map(t => `
        <div class="t-item">
          <span class="t-date">${t.date}</span>
          <h4 style="color:var(--cream);">${t.title}</h4>
          <span class="t-org" style="color:var(--cream);">
            ${t.org_link ? `<a href="${t.org_link}" target="_blank" rel="noopener" style="color:var(--terracotta-light);border-bottom:1px solid currentColor;">${t.org}</a>` : t.org}
          </span>
          <p style="color:var(--cream);">${t.description}</p>
        </div>`
      ).join('');
    }

    /* certifications */
    const certs = document.getElementById('certifications');
    if (certs && data.certifications) {
      certs.innerHTML = data.certifications.map(c => `
        <div class="t-item">
          <span class="t-date">${c.date}</span>
          <h4>${c.url ? `<a href="${c.url}" target="_blank" rel="noopener" style="border-bottom:1px solid var(--terracotta);color:inherit;">${c.name}</a>` : c.name}</h4>
          <span class="t-org">${c.issuer}</span>
          <p>${c.description}</p>
        </div>`
      ).join('');
    }

  } catch(e) {
    console.warn('Could not load about data:', e);
  }
}

/* ---------- auto-init based on page ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') {
    loadFeaturedProjects('featured-projects');
    loadAboutData();
  }
  if (page === 'projects.html') {
    loadFeaturedProjects('featured-projects');
  }
  if (page === 'all-projects.html') {
    loadAllProjects('all-projects-grid', 'all-count');
  }
  if (page === 'blog.html') {
    loadBlogPosts('blog-grid');
  }
  if (page === 'blog-post.html') {
    loadSinglePost();
  }
  if (page === 'about.html') {
    loadAboutData();
  }
});
