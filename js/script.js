// -----------------------------------------------------------
  // EDIT: GITHUB — set your username to auto-load real repos.
  // Leave blank ("") to keep the placeholder project cards above.
  // -----------------------------------------------------------
  const GITHUB_USERNAME = "Shunlauk";
  const GITHUB_REPO_COUNT = 6;

  // -----------------------------------------------------------
  // EDIT: HIDE REPOS — add repo names (exactly as on GitHub) here
  // to exclude them from the Projects section. Not case-sensitive.
  // -----------------------------------------------------------
  const EXCLUDED_REPOS = ["Website"];

  const starIcon = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3 6.5 7 .9-5 5 1.2 7-6.2-3.5-6.2 3.5 1.2-7-5-5 7-.9L12 2z"/></svg>';

  function projectCardHTML(repo){
    const desc = repo.desc ? repo.desc.replace(/</g,'&lt;') : 'No description provided.';
    return (
      '<article class="card project-card reveal is-visible">' +
        '<div class="project-top">' +
          '<h3><a href="' + repo.url + '" target="_blank" rel="noopener">' + repo.name + '</a></h3>' +
          '<span class="project-stars">' + starIcon + repo.stars + '</span>' +
        '</div>' +
        '<p>' + desc + '</p>' +
        '<div class="project-meta"><span class="lang-dot"></span>' + (repo.lang || '—') + '</div>' +
      '</article>'
    );
  }

  async function loadGithubProjects(username){
    const grid = document.getElementById('projectGrid');
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

  document.addEventListener('DOMContentLoaded', () => {
    // footer year
    document.getElementById('year').textContent = new Date().getFullYear();

    // github wiring
    if (GITHUB_USERNAME) {
      const githubUrl = 'https://github.com/' + GITHUB_USERNAME;
      ['githubProfileLink', 'socialGithub', 'footerGithub'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.href = githubUrl;
      });
      loadGithubProjects(GITHUB_USERNAME);
    }

    // nav background on scroll
    const nav = document.getElementById('siteNav');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
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

    // reveal on scroll
    const revealEls = document.querySelectorAll('.reveal');
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

    // back to top
    document.getElementById('toTop').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
