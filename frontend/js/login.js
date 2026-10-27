// VerifyCred - login.js

document.addEventListener('DOMContentLoaded', function () {

  // Role tab switching
  const roleTabs  = document.querySelectorAll('#roleTabs .role-tab');
  let selectedRole = 'student';

  roleTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      roleTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      selectedRole = this.dataset.role;
    });
  });

  // Role from URL param
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get('role');
  if (roleParam) {
    roleTabs.forEach(t => {
      if (t.dataset.role === roleParam) {
        roleTabs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        selectedRole = roleParam;
      }
    });
  }

  // Login form submission
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showLoginAlert('danger', 'Please fill in all fields.');
      return;
    }

    // Demo credentials per role
    const demoRoutes = {
      student: 'dashboard.html',
      faculty: 'faculty.html',
      company: 'company.html',
      admin:   'admin.html'
    };

    // Simulate login (any non-empty creds work in demo)
    showLoginAlert('success', '✓ Logging you in...');
    setTimeout(function () {
      window.location.href = demoRoutes[selectedRole] || 'dashboard.html';
    }, 800);
  });

  // Google login demo
  document.getElementById('googleLoginBtn').addEventListener('click', function () {
    showLoginAlert('info', '🔑 Google OAuth would redirect here. (Demo mode)');
  });

  function showLoginAlert(type, msg) {
    const el = document.getElementById('loginAlert');
    el.className = 'alert alert-' + type;
    el.textContent = msg;
    el.classList.remove('hidden');
  }

});
