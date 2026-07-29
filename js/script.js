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
    const desc = repo.desc ? escapeHtml(repo.descs) : 'No description provided.';
    const lang = escapeHtml(repo.lang || '-');
    return (
      '<article class="card project-card reveal is-visible">' +
        '<div class="project-top">' +
          '<h3><a href="' + repo.url + '" target="_blank" rel="noopener">' + name + '</a></h3>' +
          '<span class="project-stars">' + STAR_ICON + repo.stars + '</span>' +
        '</div>' +
        '<p>' + desc + '</p>' +
        '<div class="project-meta"><span class="lang-dot"></span>' + lang + '</div>' +
      '</article>'
    );
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

document.addEventListener('DOMContentLoaded', () => {
  initFooterYear();
  initGithub();
  initNavScrollEffect();
  initMobileNavToggle();
  initScrollReveal();
  initBackToTop();
});
