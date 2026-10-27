// VerifyCred - profile.js

document.addEventListener('DOMContentLoaded', function () {

  // User menu
  const userMenu     = document.getElementById('userMenu');
  const userDropdown = document.getElementById('userDropdown');
  if (userMenu && userDropdown) {
    userMenu.addEventListener('click', function (e) { userDropdown.classList.toggle('hidden'); e.stopPropagation(); });
    document.addEventListener('click', function () { userDropdown.classList.add('hidden'); });
  }

  // Profile tabs
  const ptabs    = document.querySelectorAll('.ptab');
  const pcontents = document.querySelectorAll('.ptab-content');

  ptabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      ptabs.forEach(t => t.classList.remove('active'));
      pcontents.forEach(c => c.classList.add('hidden'));
      this.classList.add('active');
      const target = document.getElementById('tab-' + this.dataset.tab);
      if (target) target.classList.remove('hidden');
    });
  });

  // Copy portfolio link
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const copyAlert   = document.getElementById('copyAlert');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function () {
      navigator.clipboard.writeText('https://verifycred.com/tharun').then(function () {
        copyAlert.classList.remove('hidden');
        setTimeout(() => { copyAlert.classList.add('hidden'); }, 3000);
      }).catch(function () {
        // fallback
        const el = document.createElement('input');
        el.value = 'https://verifycred.com/tharun';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        copyAlert.classList.remove('hidden');
        setTimeout(() => { copyAlert.classList.add('hidden'); }, 3000);
      });
    });
  }

  // Edit profile button — scroll to about tab
  const editProfileBtn = document.getElementById('editProfileBtn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function () {
      const aboutTab = document.querySelector('.ptab[data-tab="about"]');
      if (aboutTab) aboutTab.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
