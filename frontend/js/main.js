// VerifyCred - main.js
// Shared JS used across all pages

document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile Nav Toggle ----
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // ---- User Dropdown ----
  const userMenu     = document.getElementById('userMenu');
  const userDropdown = document.getElementById('userDropdown');
  if (userMenu && userDropdown) {
    userMenu.addEventListener('click', function (e) {
      userDropdown.classList.toggle('hidden');
      e.stopPropagation();
    });
    document.addEventListener('click', function () {
      if (userDropdown) userDropdown.classList.add('hidden');
    });
  }

  // ---- Contact Form ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showAlert('contactAlert', 'success', '✓ Message sent! We will get back to you within 24 hours.');
      contactForm.reset();
    });
  }

  // ---- Active nav link highlight ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

});

// ---- Utility: Show Alert ----
function showAlert(containerId, type, message) {
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.querySelector('.main-content') && document.querySelector('.main-content').prepend(container);
  }
  container.className = 'alert alert-' + type;
  container.textContent = message;
  container.classList.remove('hidden');
  setTimeout(() => { container.classList.add('hidden'); }, 4000);
}
