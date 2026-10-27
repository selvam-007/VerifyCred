// VerifyCred - verify.js

// Demo certificate database
const DEMO_CERTS = {
  'VC-2024-AWS-00123': {
    certName:    'AWS Cloud Practitioner',
    certId:      'VC-2024-AWS-00123',
    studentName: 'Tharun M',
    rollNo:      '24AIDS103',
    college:     'Anna University – AI & Data Science Dept.',
    issuedBy:    'Amazon Web Services',
    issueDate:   'June 2025',
    expiry:      'June 2027',
    category:    'Cloud Computing'
  },
  'VC-2024-SIH-00456': {
    certName:    'Smart India Hackathon 2024 – Winner',
    certId:      'VC-2024-SIH-00456',
    studentName: 'Tharun M',
    rollNo:      '24AIDS103',
    college:     'Anna University',
    issuedBy:    'Ministry of Education, Government of India',
    issueDate:   'December 2024',
    expiry:      'No Expiry',
    category:    'Hackathon'
  }
};

document.addEventListener('DOMContentLoaded', function () {

  // Nav hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () { navLinks.classList.toggle('open'); });
  }

  const verifyBtn        = document.getElementById('verifyBtn');
  const certIdInput      = document.getElementById('certIdInput');
  const resultPanel      = document.getElementById('verifyResultPanel');
  const resultVerified   = document.getElementById('resultVerified');
  const resultNotFound   = document.getElementById('resultNotFound');
  const demoVerifyBtn    = document.getElementById('demoVerifyBtn');
  const tryAgainBtn      = document.getElementById('tryAgainBtn');

  function verifyCert(id) {
    const trimmed = id.trim().toUpperCase();
    // Show loading state
    resultPanel.classList.remove('hidden');
    resultVerified.classList.add('hidden');
    resultNotFound.classList.add('hidden');

    // Simulate API call delay
    setTimeout(function () {
      const cert = DEMO_CERTS[trimmed];
      if (cert) {
        document.getElementById('vCertName').textContent    = cert.certName;
        document.getElementById('vCertId').textContent      = cert.certId;
        document.getElementById('vStudentName').textContent = cert.studentName;
        document.getElementById('vRollNo').textContent      = cert.rollNo;
        document.getElementById('vCollege').textContent     = cert.college;
        document.getElementById('vIssuedBy').textContent    = cert.issuedBy;
        document.getElementById('vIssueDate').textContent   = cert.issueDate;
        document.getElementById('vExpiry').textContent      = cert.expiry;
        document.getElementById('vCategory').textContent    = cert.category;
        resultVerified.classList.remove('hidden');
      } else {
        resultNotFound.classList.remove('hidden');
      }
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 800);
  }

  verifyBtn.addEventListener('click', function () {
    const id = certIdInput.value.trim();
    if (!id) { certIdInput.focus(); return; }
    verifyCert(id);
  });

  certIdInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') verifyBtn.click();
  });

  // Demo verify button
  demoVerifyBtn.addEventListener('click', function () {
    certIdInput.value = 'VC-2024-AWS-00123';
    verifyCert('VC-2024-AWS-00123');
  });

  // Try again
  if (tryAgainBtn) {
    tryAgainBtn.addEventListener('click', function () {
      resultPanel.classList.add('hidden');
      certIdInput.value = '';
      certIdInput.focus();
    });
  }

  // Print
  const printBtn = document.getElementById('printCertBtn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  // Share
  const shareBtn = document.getElementById('shareVerifyBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      const url = window.location.href.split('?')[0] + '?id=' + certIdInput.value;
      navigator.clipboard.writeText(url).then(function () {
        shareBtn.textContent = '✓ Link Copied!';
        setTimeout(() => { shareBtn.textContent = '🔗 Share Result'; }, 2000);
      });
    });
  }

  // Handle ?id= in URL
  const params = new URLSearchParams(window.location.search);
  const preId  = params.get('id');
  if (preId) {
    certIdInput.value = preId;
    verifyCert(preId);
  }

});
