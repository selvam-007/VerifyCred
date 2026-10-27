// VerifyCred - register.js

document.addEventListener('DOMContentLoaded', function () {

  const regRoleTabs = document.querySelectorAll('#regRoleTabs .role-tab');
  let selectedRole = 'student';

  const studentFields = document.getElementById('studentFields');
  const facultyFields = document.getElementById('facultyFields');
  const companyFields = document.getElementById('companyFields');

  function showFields(role) {
    studentFields.classList.add('hidden');
    facultyFields.classList.add('hidden');
    companyFields.classList.add('hidden');
    if (role === 'student')  studentFields.classList.remove('hidden');
    if (role === 'faculty')  facultyFields.classList.remove('hidden');
    if (role === 'company')  companyFields.classList.remove('hidden');
  }

  regRoleTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      regRoleTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      selectedRole = this.dataset.role;
      showFields(selectedRole);
    });
  });

  // Registration form
  document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const email     = document.getElementById('regEmail').value.trim();
    const password  = document.getElementById('regPassword').value;
    const confirm   = document.getElementById('confirmPassword').value;
    const terms     = document.getElementById('agreeTerms').checked;

    const alertEl = document.getElementById('registerAlert');

    function showAlert(type, msg) {
      alertEl.className = 'alert alert-' + type;
      alertEl.textContent = msg;
      alertEl.classList.remove('hidden');
    }

    if (!firstName || !lastName || !email || !password) {
      showAlert('danger', 'Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      showAlert('danger', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      showAlert('danger', 'Passwords do not match.');
      return;
    }
    if (!terms) {
      showAlert('danger', 'Please agree to the Terms of Service.');
      return;
    }

    showAlert('success', '✓ Account created! Redirecting to dashboard...');
    setTimeout(function () {
      window.location.href = selectedRole === 'student' ? 'dashboard.html'
        : selectedRole === 'faculty' ? 'faculty.html'
        : 'company.html';
    }, 1000);
  });

});
