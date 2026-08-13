document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-links a, .button-primary, .button-secondary');

  links.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.add('is-animated');
    });
  });

  // Auto-set active nav link based on current page
  const navLinks = document.querySelectorAll('.nav-links a');
  if (navLinks.length) {
    const path = window.location.pathname || '';
    let page = path.substring(path.lastIndexOf('/') + 1);
    if (!page) page = 'index.html';

    navLinks.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('http') || href.startsWith('mailto')) return;

      if (href.startsWith('#')) {
        // anchor links should be active on the index/home page
        if (page === 'index.html') a.classList.add('active');
        else a.classList.remove('active');
        return;
      }

      const target = href.split(/[?#]/)[0].split('/').pop();
      if (target && target === page) a.classList.add('active');
      else a.classList.remove('active');
    });

    // Ensure only one active link remains (prefer exact filename match)
    const activeLinks = document.querySelectorAll('.nav-links a.active');
    if (activeLinks.length > 1) {
      let preferred = Array.from(activeLinks).find((el) => {
        const h = el.getAttribute('href') || '';
        return !h.startsWith('#') && (h.split(/[?#]/)[0].split('/').pop() === page);
      });
      if (!preferred) preferred = activeLinks[0];
      activeLinks.forEach((el) => { if (el !== preferred) el.classList.remove('active'); });
    }

    // Update active state on click (helps single-page anchors)
    navLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href') || '';
        if (href.startsWith('http') || href.startsWith('mailto')) return;
        document.querySelectorAll('.nav-links a.active').forEach((el) => el.classList.remove('active'));
        a.classList.add('active');
      });
    });
  }
});
