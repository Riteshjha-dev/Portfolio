// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if (!navMenu.classList.contains('open')) return;
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
  });
}

// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=(mx-6)+'px';cursor.style.top=(my-6)+'px';});
function animRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=(rx-18)+'px';ring.style.top=(ry-18)+'px';requestAnimationFrame(animRing);}
animRing();
document.querySelectorAll('a,button,.skill-card,.project-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.transform='scale(1.6)';ring.style.borderColor='var(--c5)';});
  el.addEventListener('mouseleave',()=>{ring.style.transform='scale(1)';ring.style.borderColor='var(--c4)';});
});

// Scroll fade-in
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.12});
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));

// ---- Count-up animation for hero stats ----
function animateCountUp(el, target, suffix, duration=1200){
  if (!el) return;
  const start = performance.now();
  function step(ts){
    const progress = Math.min((ts-start)/duration, 1);
    const eased = 1 - Math.pow(1-progress, 3);
    el.textContent = Math.floor(eased*target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

// Animate the two static hero stats once on load (they're above the fold)
window.addEventListener('load', () => {
  animateCountUp(document.getElementById('hero-tech-count'), 8, '+');
  animateCountUp(document.getElementById('hero-passion-count'), 100, '%');
});

// ---- Active nav-link highlight on scroll ----
const navLinks = document.querySelectorAll('.nav-links a');
const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      navLinks.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(sec => navObs.observe(sec));

// ---- Scroll-to-top button ----
const toTopBtn = document.createElement('button');
toTopBtn.id = 'to-top-btn';
toTopBtn.setAttribute('aria-label', 'Scroll to top');
toTopBtn.textContent = '↑';
document.body.appendChild(toTopBtn);
window.addEventListener('scroll', () => {
  toTopBtn.classList.toggle('visible', window.scrollY > 600);
});
toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
toTopBtn.addEventListener('mouseenter', () => { ring.style.transform = 'scale(1.6)'; ring.style.borderColor = 'var(--c5)'; });
toTopBtn.addEventListener('mouseleave', () => { ring.style.transform = 'scale(1)'; ring.style.borderColor = 'var(--c4)'; });

// ---- Live GitHub repos ----
const GH_USER = 'Riteshjha-dev';

const langMeta = {
  JavaScript: {emoji:'⚡', tag:'tag-yellow', glow:'rgba(247,223,30,0.10)'},
  TypeScript: {emoji:'🔷', tag:'tag-blue', glow:'rgba(77,150,255,0.10)'},
  Python:     {emoji:'🐍', tag:'tag-green', glow:'rgba(107,203,119,0.10)'},
  Java:       {emoji:'☕', tag:'tag-orange', glow:'rgba(255,159,67,0.10)'},
  HTML:       {emoji:'🌐', tag:'tag-red', glow:'rgba(255,107,107,0.10)'},
  CSS:        {emoji:'🎨', tag:'tag-purple', glow:'rgba(199,125,255,0.10)'},
  PHP:        {emoji:'🐘', tag:'tag-blue', glow:'rgba(77,150,255,0.10)'},
  'C++':      {emoji:'⚙️', tag:'tag-purple', glow:'rgba(199,125,255,0.10)'},
  C:          {emoji:'⚙️', tag:'tag-blue', glow:'rgba(77,150,255,0.10)'},
  Shell:      {emoji:'🐚', tag:'tag-green', glow:'rgba(107,203,119,0.10)'},
  Vue:        {emoji:'🖖', tag:'tag-green', glow:'rgba(107,203,119,0.10)'},
  default:    {emoji:'📦', tag:'tag-blue', glow:'rgba(77,150,255,0.10)'}
};

function humanizeName(name){
  return name.replace(/-+$/,'').replace(/[-_]+/g,' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Curated presentation for repos I know about — falls back to auto-generated
// name/description/emoji for anything new that gets pushed later.
const repoOverrides = {
  'Portfolio': {
    title: 'Personal Portfolio Website',
    desc: 'This site — a fully custom, animated portfolio built from scratch to showcase projects and make it easy to reach out.',
    emoji: '🪪', tag: 'tag-blue', glow: 'rgba(77,150,255,0.10)'
  },
  'Spotify-Clone': {
    title: 'Spotify UI Clone',
    desc: 'A frontend-only recreation of the Spotify player — playlist view, controls, and search UI, built purely for pixel-level design practice.',
    emoji: '🎵', tag: 'tag-green', glow: 'rgba(107,203,119,0.10)'
  },
  'RazorPay-Clone': {
    title: 'Razorpay Landing Page Clone',
    desc: "A pixel-perfect recreation of Razorpay's marketing landing page — practicing advanced layout, spacing, and responsive CSS techniques.",
    emoji: '💳', tag: 'tag-blue', glow: 'rgba(77,150,255,0.10)'
  },
  'Dijkstra-Algorithm': {
    title: "Dijkstra's Algorithm",
    desc: "An implementation of Dijkstra's shortest-path algorithm — core graph theory from the DSA side of my B.Tech coursework.",
    emoji: '🧠', tag: 'tag-orange', glow: 'rgba(255,159,67,0.10)'
  },
  'Polygon-Evolution': {
    title: 'Polygon Evolution Simulator',
    desc: 'A canvas-based generative animation where polygons evolve over time, driven by simple physics rules and layered sound effects.',
    emoji: '🕸️', tag: 'tag-purple', glow: 'rgba(199,125,255,0.10)'
  },
  'Simon-Says-Game': {
    title: 'Simon Says Memory Game',
    desc: 'A browser-based Simon Says game — repeat the growing color-and-sound sequence. Built with vanilla HTML, CSS, and JavaScript.',
    emoji: '🕹️', tag: 'tag-purple', glow: 'rgba(199,125,255,0.10)'
  },
  'To-Do-List-': {
    title: 'To-Do List App',
    desc: 'A clean, no-frills to-do list for the browser — add, complete, and clear tasks, focused on getting the DOM fundamentals right.',
    emoji: '✅', tag: 'tag-green', glow: 'rgba(107,203,119,0.10)'
  }
};

function renderRepoCard(repo){
  const override = repoOverrides[repo.name];
  const meta = override
    ? { emoji: override.emoji, tag: override.tag, glow: override.glow }
    : (langMeta[repo.language] || langMeta.default);
  const title = override ? override.title : humanizeName(repo.name);
  const desc = override
    ? override.desc
    : (repo.description ? repo.description : 'No description added yet — check the code for details.');
  const topics = (repo.topics && repo.topics.length) ? repo.topics.slice(0,4) : [repo.language || 'Code'];
  const pills = topics.map(t => `<span class="pill">${t}</span>`).join('');
  return `
    <div class="project-card" style="--glow:${meta.glow};">
      <div class="card-header">
        <span class="card-emoji">${meta.emoji}</span>
        <span class="card-tag ${meta.tag}">${repo.language || 'Project'}</span>
        <div class="card-title">${title}</div>
      </div>
      <p class="card-desc">${desc}</p>
      <div class="card-footer">${pills}</div>
      <div class="card-actions">
        <a href="${repo.html_url}" target="_blank" class="card-btn card-btn-secondary">⬡ Code</a>
      </div>
    </div>`;
}

async function loadGithub(){
  const grid = document.getElementById('projects-grid');
  try {
    const [reposRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=9`),
      fetch(`https://api.github.com/users/${GH_USER}`)
    ]);
    if (!reposRes.ok) throw new Error('repos fetch failed');
    const repos = await reposRes.json();
    const visible = (Array.isArray(repos) ? repos : []).filter(r => !r.fork);
    const toShow = visible.length ? visible : (Array.isArray(repos) ? repos : []);

    if (toShow.length === 0){
      grid.innerHTML = '<div class="repo-loading-card">No public repositories found yet — visit the GitHub profile directly.</div>';
    } else {
      grid.innerHTML = toShow.slice(0,9).map(renderRepoCard).join('');
      grid.querySelectorAll('.project-card').forEach(el => obs.observe(el));
      grid.classList.add('visible');
    }

    if (userRes.ok){
      const user = await userRes.json();
      const repoCount = user.public_repos ?? toShow.length;
      const repoCountEl = document.getElementById('gh-repo-count');
      const heroCountEl = document.getElementById('hero-repo-count');
      if (repoCountEl) repoCountEl.textContent = repoCount;
      if (heroCountEl) animateCountUp(heroCountEl, repoCount, '+');
      const locEl = document.getElementById('gh-location');
      if (locEl && user.location) locEl.textContent = user.location;
    }
  } catch (err) {
    grid.innerHTML = `<div class="repo-loading-card">Couldn't load live repos right now — <a href="https://github.com/${GH_USER}" target="_blank" style="color:var(--c4);">view the GitHub profile directly →</a></div>`;
  }
}

loadGithub();
