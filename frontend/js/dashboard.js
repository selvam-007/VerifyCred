// VerifyCred - dashboard.js

document.addEventListener('DOMContentLoaded', function () {

  // User menu dropdown
  const userMenu     = document.getElementById('userMenu');
  const userDropdown = document.getElementById('userDropdown');
  if (userMenu && userDropdown) {
    userMenu.addEventListener('click', function (e) {
      userDropdown.classList.toggle('hidden');
      e.stopPropagation();
    });
    document.addEventListener('click', function () {
      userDropdown.classList.add('hidden');
    });
  }

  // Generate Resume button
  const generateResumeBtn = document.getElementById('generateResumeBtn');
  if (generateResumeBtn) {
    generateResumeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = this;
      const original = btn.innerHTML;
      btn.innerHTML = '<span>⏳</span> Generating...';
      btn.style.pointerEvents = 'none';
      setTimeout(function () {
        btn.innerHTML = '<span>✓</span> Resume Ready!';
        btn.classList.add('btn-success');  // visual feedback
        setTimeout(function () {
          btn.innerHTML = original;
          btn.style.pointerEvents = '';
        }, 2000);
      }, 1500);
    });
  }

  // Animate stat counters
  document.querySelectorAll('.stat-value').forEach(function (el) {
    const target = parseInt(el.textContent.replace(/,/g, ''), 10);
    if (isNaN(target)) return;
    let current = 0;
    const step  = Math.ceil(target / 40);
    const timer = setInterval(function () {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString();
    }, 30);
  });

});
