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

    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      const endpoint = contactForm.dataset.endpoint || '';
      const msgEl = document.getElementById('formMessage');

      function showFieldError(field, text) {
        let err = field.parentElement.querySelector('.field-error');
        if (!err) {
          err = document.createElement('div');
          err.className = 'field-error';
          field.parentElement.appendChild(err);
        }
        err.textContent = text;
      }

      function clearFieldError(field) {
        const err = field.parentElement.querySelector('.field-error');
        if (err) err.remove();
      }

      function validateEmail(email) {
        return /^[\w-.+]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
      }

      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (msgEl) { msgEl.textContent = ''; msgEl.className = 'form-message'; }

        const name = contactForm.name;
        const email = contactForm.email;
        const message = contactForm.message;

        let valid = true;
        [name, email, message].forEach((f) => clearFieldError(f));

        if (!name.value.trim()) { showFieldError(name, 'Моля въведете име.'); valid = false; }
        if (!email.value.trim() || !validateEmail(email.value.trim())) { showFieldError(email, 'Моля въведете валиден имейл.'); valid = false; }
        if (!message.value.trim() || message.value.trim().length < 10) { showFieldError(message, 'Съобщението трябва да е поне 10 символа.'); valid = false; }

        if (!valid) return;

        // If endpoint is still placeholder, instruct user to replace it
        if (endpoint.includes('your-form-id') || endpoint.includes('{')) {
          if (msgEl) {
            msgEl.classList.add('error');
            msgEl.textContent = 'Формата е валидна, но не е конфигуриран ендпойнт. Заменете data-endpoint в формата с вашия Formspree URL.';
          }
          return;
        }

        // submit via fetch as JSON
        try {
          if (msgEl) { msgEl.textContent = 'Изпращане...'; }
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name: name.value.trim(), email: email.value.trim(), message: message.value.trim() })
          });

          if (res.ok) {
            if (msgEl) { msgEl.classList.add('success'); msgEl.textContent = 'Благодарим ви — съобщението е изпратено.'; }
            contactForm.reset();
          } else {
            let text = 'Възникна грешка при изпращане. Моля опитайте по-късно.';
            try { const data = await res.json(); if (data && data.error) text = data.error; } catch (_) {}
            if (msgEl) { msgEl.classList.add('error'); msgEl.textContent = text; }
          }
        } catch (err) {
          if (msgEl) { msgEl.classList.add('error'); msgEl.textContent = 'Неуспешно свързване със сървъра.'; }
          console.error('Contact form submit error', err);
        }
      });
    }
});
