/* ============================================================
   NEURAL ARCH — Shared interactions
   ============================================================ */

/* ---------- 1. Generate the Neural Arch SVG signature ----------
   An arch of nodes (data points) connected by drawing threads,
   echoing the brand line: "tracing the evolution of intelligence
   through data and AI." Used in hero backdrops + footer. */
function buildNeuralArch(container, opts = {}) {
  if (!container) return;
  const {
    nodeCount = 22,
    width = 1200,
    height = 800,
    archHeight = 0.62,
  } = opts;

  const cx = width / 2;
  const cy = height * archHeight;
  const radiusX = width * 0.46;
  const radiusY = height * 0.5;

  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    const t = (i / (nodeCount - 1)) * Math.PI; // 0..PI -> arch
    const jitter = (Math.sin(i * 12.9) * 0.5 + 0.5) * 40 - 20;
    const x = cx - Math.cos(t) * radiusX;
    const y = cy - Math.sin(t) * radiusY + jitter;
    nodes.push({ x, y });
  }

  let svg = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">`;

  // connecting threads (consecutive + a few skip-connections)
  nodes.forEach((n, i) => {
    if (i < nodes.length - 1) {
      const n2 = nodes[i + 1];
      const cls = i % 3 === 0 ? 'thread gold' : 'thread';
      const delay = (i * 0.18).toFixed(2);
      svg += `<path class="${cls}" style="animation-delay:${delay}s" d="M${n.x.toFixed(1)},${n.y.toFixed(1)} L${n2.x.toFixed(1)},${n2.y.toFixed(1)}"/>`;
    }
    if (i % 4 === 0 && i + 5 < nodes.length) {
      const n3 = nodes[i + 5];
      const midY = (n.y + n3.y) / 2 - 60;
      const midX = (n.x + n3.x) / 2;
      svg += `<path class="thread" style="animation-delay:${(i * 0.1).toFixed(2)}s" d="M${n.x.toFixed(1)},${n.y.toFixed(1)} Q${midX.toFixed(1)},${midY.toFixed(1)} ${n3.x.toFixed(1)},${n3.y.toFixed(1)}"/>`;
    }
  });

  // nodes
  nodes.forEach((n, i) => {
    const cls = i % 3 === 0 ? 'node gold' : 'node';
    const delay = (0.4 + i * 0.07).toFixed(2);
    svg += `<circle class="${cls}" style="animation-delay:${delay}s, ${(2 + (i % 5) * 0.3).toFixed(2)}s" cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="3.2"/>`;
  });

  svg += `</svg>`;
  container.innerHTML = svg;
}

/* ---------- 2. Scroll-reveal ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  targets.forEach((t) => io.observe(t));

  // skill bars fill when visible
  const bars = document.querySelectorAll('.skill-bar i');
  const barIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const val = e.target.dataset.value || '70';
        e.target.style.width = val + '%';
        barIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach((b) => barIo.observe(b));
}

/* ---------- 3. Mobile nav toggle + active link + scroll shadow ---------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ---------- 4. Typewriter for hero role line ---------- */
function initTypewriter() {
  const el = document.querySelector('[data-typewrite]');
  if (!el) return;
  const phrases = JSON.parse(el.dataset.typewrite);
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const current = phrases[pi];
    if (!deleting) {
      ci++;
      el.textContent = current.slice(0, ci);
      if (ci === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      ci--;
      el.textContent = current.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 60);
  }
  tick();
}

/* ---------- 5. Cursor glow (desktop only, subtle) ---------- */
function initCursorGlow() {
  if (window.matchMedia('(max-width: 860px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.style.opacity = '0';
  document.body.appendChild(glow);
  let raf = null;
  window.addEventListener('mousemove', (e) => {
    glow.style.opacity = '1';
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  });
}

/* ---------- 6. Project filter (all-projects.html) ---------- */
function initFilters() {
  const bar = document.querySelector('.filter-bar');
  if (!bar) return;
  const buttons = bar.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-category]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach((card) => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}

/* ---------- 7. Contact form (static front-end only) ---------- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = document.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ── Replace YOUR_FORM_ID with your actual Formspree ID (see setup steps below) ──
    const FORMSPREE_ID = 'xeebpqaz';

    if (FORMSPREE_ID === 'YOUR_FORM_ID') {
      status.textContent = '⚠ Form not connected yet — see setup instructions.';
      status.className = 'form-status err';
      return;
    }

    // Loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    status.textContent = '';
    status.className = 'form-status';

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      if (res.ok) {
        status.textContent = '✅ Message sent! I\'ll get back to you soon.';
        status.className = 'form-status ok';
        form.reset();
      } else {
        const data = await res.json();
        throw new Error(data?.errors?.[0]?.message || 'Something went wrong.');
      }
    } catch (err) {
      status.textContent = '❌ ' + err.message + ' — try emailing me directly at dnkathale.work@gmail.com';
      status.className = 'form-status err';
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-neural-arch]').forEach((el) => {
    buildNeuralArch(el, {
      nodeCount: parseInt(el.dataset.nodes || '22', 10),
      archHeight: parseFloat(el.dataset.archHeight || '0.62'),
    });
  });
  initScrollReveal();
  initNav();
  initTypewriter();
  initCursorGlow();
  initFilters();
  initContactForm();
});
