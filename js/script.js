// -----------------------------------------------------------
  // EDIT: GITHUB — set your username to auto-load real repos.
  // Leave blank ("") to keep the placeholder project cards above.
  // -----------------------------------------------------------
const GITHUB_USERNAME = "shunlauk";
const GITHUB_REPO_COUNT = 6;

  // -----------------------------------------------------------
  // EDIT: HIDE REPOS — add repo names (exactly as on GitHub) here
  // to exclude them from the Projects section. Not case-sensitive.
  // -----------------------------------------------------------
const EXCLUDED_REPOS = ["Website"];

const STAR_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3 6.5 7 .9-5 5 1.2 7-6.2-3.5-6.2 3.5 1.2-7-5-5 7-.9L12 2z"/></svg>';

function escapeHtml(value){
    const div = document.createElement('div');
    div.textContent = value ?? '';
    return div.innerHTML;
}

function projectCardHTML(repo){
    const name = escapeHtml(repo.name);
    const desc = repo.desc ? escapeHtml(repo.desc) : 'No description provided.';
    const lang = escapeHtml(repo.lang || '-');
    return (
      '<article class="card project-card reveal is-visible" data-lang="' + escapeHtml(repo.lang || '') + '">' +
        '<div class="project-top">' +
          '<h3><a href="' + repo.url + '" target="_blank" rel="noopener">' + name + '</a></h3>' +
          '<span class="project-stars">' + STAR_ICON + repo.stars + '</span>' +
        '</div>' +
        '<p>' + desc + '</p>' +
        '<div class="project-meta"><span class="lang-dot"></span>' + lang + '</div>' +
      '</article>'
    );
  }

  function renderProjectFilters(repos){
    const box = document.getElementById('projectFilters');
    const grid = document.getElementById('projectGrid');
    if (!box || !grid) return;

    const langs = [...new Set(repos.map(r => r.language).filter(Boolean))].sort();
    if (langs.length < 2) return; // nothing meaningful to filter

    const makeChip = (label, value, active) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-chip' + (active ? ' is-active' : '');
      btn.textContent = label;
      btn.dataset.filter = value;
      return btn;
    };

    box.appendChild(makeChip('All', 'all', true));
    langs.forEach(l => box.appendChild(makeChip(l, l, false)));

    box.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;
      box.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      grid.querySelectorAll('.project-card').forEach(card => {
        const show = filter === 'all' || card.dataset.lang === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  }

  async function loadGithubProjects(username){
    const grid = document.getElementById('projectGrid');
    if (!grid) return;
    
    try {
      const res = await fetch('https://api.github.com/users/' + encodeURIComponent(username) + '/repos?sort=updated&per_page=' + GITHUB_REPO_COUNT);
      if(!res.ok) throw new Error('GitHub request failed: ' + res.status);
      const data = await res.json();
      const repos = data
        .filter(r => !r.fork)
        .filter(r => !EXCLUDED_REPOS.some(name => name.toLowerCase() === r.name.toLowerCase()))
        .slice(0, GITHUB_REPO_COUNT);
      if(!repos.length) return;
      grid.innerHTML = repos.map(r => projectCardHTML({
        name: r.name,
        desc: r.description,
        lang: r.language,
        stars: r.stargazers_count,
        url: r.html_url
      })).join('');
      renderProjectFilters(repos);
    } catch(err){
      console.warn('Could not load GitHub repos — showing placeholder projects instead.', err);
    }
  }


function initGithub(){
    if (!GITHUB_USERNAME) return;
    
    const githubUrl = 'https://github.com/' + GITHUB_USERNAME;
    ['githubProfileLink', 'socialGithub', 'footerGithub'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = githubUrl;
    });
    
    loadGithubProjects(GITHUB_USERNAME);
}

function initNavScrollEffect() {
  const nav = document.getElementById('siteNav');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

}

function initMobileNavToggle() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
}

function initBackToTop() {
  const toTop = document.getElementById('toTop');
  if (!toTop) return;
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// -----------------------------------------------------------
// EDIT: TYPED LINES — the hero subtitle types out each line below,
// pausing, deleting, then moving to the next. Keep them short.
// -----------------------------------------------------------
const TYPED_LINES = [
  'Python developer focused on automation, Linux tooling, and clean command-line software.',
  'Building reliable CLI tools that quietly do their job.',
  'Linux, automation, and a growing cybersecurity toolkit.'
];

function initTypingTagline() {
  const el = document.getElementById('typedText');
  if (!el) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = TYPED_LINES[lineIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % TYPED_LINES.length;
      }
    }
    setTimeout(tick, deleting ? 28 : 42);
  }

  el.textContent = '';
  setTimeout(tick, 500);
}

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

const THEME_KEY = 'shunlauk-theme';

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.setAttribute('aria-pressed', String(isLight));
    btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isLight ? '#ffffff' : '#060606');
}

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  applyTheme(saved === 'light' ? 'light' : 'dark');

  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFooterYear();
  initGithub();
  initNavScrollEffect();
  initMobileNavToggle();
  initScrollReveal();
  initBackToTop();
  initTypingTagline();
  initScrollProgress();
  initThemeToggle();
});
