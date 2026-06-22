# Neural Arch — Don Nipuni Athale Portfolio

A multi-page personal portfolio site for **Don Nipuni Athale**, Aspiring Data Scientist & AI Engineer. Built as plain HTML/CSS/JS (no build step required) so it drops straight into **Google Antigravity** or any static host.

**Brand concept — "Neural Arch":** an arched constellation of connecting nodes/threads, representing data being traced into intelligence. It appears as the logo mark, the animated hero backdrop, and section dividers throughout the site.

---

## 1. Design system

| Token | Value | Usage |
|---|---|---|
| Cream | `#F7F1E8` | section dividers, pills |
| Warm White | `#FAF7F2` | main background |
| Maroon | `#6E0D25` | primary CTA, headings accents |
| Espresso | `#3B241C` | dark sections, headings |
| Terracotta | `#C26D5A` | accent, hover states, motion |
| Charcoal | `#2B2B2B` | body text |
| Gold Thread | `#B8893F` | secondary accent in the Neural Arch motif |

**Type:**
- Display — `Fraunces` (serif, used for headings — italic weight used for emphasis words)
- Body — `Space Grotesk`
- Mono/data — `JetBrains Mono` (used for eyebrows, tags, code-ish labels — nods to the DS/AI subject)

All tokens live in `css/style.css` under `:root`. Change a color once there and it propagates everywhere.

---

## 2. File structure

```
portfolio/
├── index.html              Home — hero, about teaser, featured projects, skills, highlights, CTA
├── about.html               Full bio, focus areas, education/experience timeline, achievements, certifications
├── projects.html            Featured projects (6) with filter bar
├── all-projects.html        Full archive (20 placeholder projects) with category filtering
├── blog.html                Articles/notes grid (3 draft placeholders)
├── contact.html              Contact info + working front-end form
├── css/
│   └── style.css            Full design system (tokens, typography, components, animations)
├── js/
│   └── main.js               Neural Arch SVG generator, scroll reveal, nav, typewriter, filters, form
├── assets/
│   ├── images/
│   │   └── profile-hero.png  Your uploaded portrait
│   └── resume/
│       └── PUT_RESUME_HERE.txt   ← replace with Don_Nipuni_Athale_Resume.pdf
└── README.md                 This file
```

---

## 3. How the build was approached (task log)

1. **Discovery** — clarified field (Data Science/AI), palette (warm maroon/terracotta/cream, explicitly supplied hex values), motion level (maximal), site structure (multi-page), and all real copy (name, bio, tagline, focus areas, brand line, contact details).
2. **Design plan** — rejected the default "navy/black AI site" look per your brief. Built a custom token system (above) and a signature visual — the **Neural Arch** — that ties directly to your brand line ("tracing the evolution of intelligence through data and AI") instead of generic gradient blobs.
3. **Component build** — shared nav/footer markup, button system, card system, timeline component, skill bars, filterable project grid, contact form — all driven from the same CSS tokens so the whole site re-themes from one file.
4. **Motion** — page-load reveal on the hero, scroll-triggered reveals (`IntersectionObserver`) site-wide, an animated typewriter role line, a hover-responsive cursor glow, animated SVG "drawing" threads in the Neural Arch motif, and skill bars that fill on scroll.
5. **Content scaffolding** — featured projects (6) and the full archive (20) are placeholder content matching your focus areas (ML, NLP, Generative AI, Data Viz/Analytics) — swap in your real projects (see Section 5).

---

## 4. Using this in Google Antigravity

1. **Create/open your project** in Antigravity.
2. **Copy the folder structure** above into your Antigravity workspace exactly as-is (keep `css/`, `js/`, and `assets/` as subfolders relative to the HTML files — all links are relative paths).
3. Antigravity (being Gemini/agent-driven) can open this as a static site directly — no `npm install` or build step needed. If Antigravity asks what kind of project this is, choose **static HTML/CSS/JS**.
4. To preview: open `index.html` in Antigravity's built-in browser preview, or run any local static server, e.g.:
   ```bash
   npx serve .
   # or
   python3 -m http.server 5500
   ```
5. **Ask Antigravity to make edits for you** in plain language once it's loaded — e.g. "swap the 3rd featured project for my actual churn project with this GitHub link," or "change the terracotta accent to a slightly deeper shade." Since everything is driven from CSS variables and repeatable component classes, most changes are small, localized edits.
6. **Deploy** — once you're happy, this folder can be pushed as-is to GitHub Pages, Netlify, or Vercel (drag-and-drop the folder on Netlify works immediately, zero config).

---

## 5. What you need to fill in (search for these)

| What | Where | How |
|---|---|---|
| Real project details + screenshots | `projects.html`, `all-projects.html` | Replace the placeholder SVG thumbnail `<div class="thumb">` with a real screenshot `<img>`, update title/description/stack/links |
| Resume PDF | `assets/resume/` | Add `Don_Nipuni_Athale_Resume.pdf` (the download buttons already point to this filename) |
| GitHub / LinkedIn URLs | `index.html`, `about.html`, `contact.html` footers + contact page | Replace `href="#"` next to "GitHub"/"LinkedIn" labels |
| Achievements & certifications | `about.html` | Replace the 4 placeholder highlight cards and 2 placeholder certification timeline items |
| Blog posts | `blog.html` | Replace the 3 draft cards with real posts, or link out to Medium/Substack/Dev.to |
| Contact form backend | `contact.html` + `js/main.js` | See Section 6 below — currently front-end only |

---

## 6. Wiring up the contact form (it doesn't send email yet)

Right now `initContactForm()` in `js/main.js` just shows a confirmation message locally — no email is actually sent, because that requires a backend or third-party service. Two easy no-backend options:

**Option A — Formspree (fastest)**
1. Create a free form at [formspree.io](https://formspree.io) using your email `dnkathale.work@gmail.com`.
2. In `contact.html`, change:
   ```html
   <form id="contact-form" class="card" style="padding:2.2rem;">
   ```
   to:
   ```html
   <form id="contact-form" class="card" style="padding:2.2rem;" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
3. Remove or adjust the `e.preventDefault()` in `initContactForm()` if you want Formspree's native redirect, or keep the JS confirmation and let Formspree handle it via `fetch()` instead (their docs show both patterns).

**Option B — EmailJS**
Lets you send straight from JS without a backend. Sign up at [emailjs.com](https://emailjs.com), then replace the `submit` handler in `initContactForm()` with their `emailjs.sendForm(...)` call using your service/template IDs.

---

## 7. Accessibility & performance notes already baked in
- `prefers-reduced-motion` is respected — all animation durations collapse for users who request it.
- Visible focus states inherit from default browser outlines on form fields (custom box-shadow focus ring added).
- All images have `alt` text; replace placeholder project thumbnails with real screenshots + descriptive `alt`.
- Mobile nav collapses under 860px; grids reflow down to single-column under 640px.

---

## 8. Next iteration ideas (optional, for later passes)
- Individual project detail pages (`project-detail.html?slug=...` or static per-project pages) with problem/approach/results write-ups.
- Dark/light mode toggle (tokens are already centralized, so this is mostly a `data-theme` attribute swap).
- A `/blog/` subfolder with real Markdown-to-HTML posts.
- Replace the SVG project thumbnails with real screenshots, GIFs, or embedded notebook previews.
