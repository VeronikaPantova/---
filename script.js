document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-links a, .button-primary, .button-secondary');

  links.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.add('is-animated');
    });
  });
});
