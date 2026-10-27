// VerifyCred - upload.js

document.addEventListener('DOMContentLoaded', function () {

  const uploadZone  = document.getElementById('uploadZone');
  const fileInput   = document.getElementById('fileInput');
  const browseBtn   = document.getElementById('browseBtn');
  const filePreview = document.getElementById('filePreview');
  const removeFile  = document.getElementById('removeFile');
  const aiAnalysis  = document.getElementById('aiAnalysis');
  const aiResult    = document.getElementById('aiResult');
  const uploadForm  = document.getElementById('uploadForm');
  const uploadSuccess = document.getElementById('uploadSuccess');

  // User dropdown
  const userMenu = document.getElementById('userMenu');
  const userDropdown = document.getElementById('userDropdown');
  if (userMenu && userDropdown) {
    userMenu.addEventListener('click', function (e) { userDropdown.classList.toggle('hidden'); e.stopPropagation(); });
    document.addEventListener('click', function () { userDropdown.classList.add('hidden'); });
  }

  // Browse button
  browseBtn.addEventListener('click', function () { fileInput.click(); });

  // File selected via input
  fileInput.addEventListener('change', function () {
    if (this.files && this.files[0]) handleFile(this.files[0]);
  });

  // Drag and drop
  uploadZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });
  uploadZone.addEventListener('dragleave', function () {
    uploadZone.classList.remove('drag-over');
  });
  uploadZone.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  // Remove file
  removeFile.addEventListener('click', function () {
    fileInput.value = '';
    filePreview.classList.add('hidden');
    aiAnalysis.classList.add('hidden');
    aiResult.classList.add('hidden');
  });

  function handleFile(file) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, and PNG files are supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10 MB limit.');
      return;
    }
    document.getElementById('fileName').textContent  = file.name;
    document.getElementById('fileSize').textContent  = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    filePreview.classList.remove('hidden');
    // Auto-fill cert name from file name
    const certNameInput = document.getElementById('certName');
    if (!certNameInput.value) {
      certNameInput.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    }
    // Trigger AI analysis
    runAIAnalysis();
  }

  function runAIAnalysis() {
    aiAnalysis.classList.remove('hidden');
    aiResult.classList.add('hidden');
    setTimeout(function () {
      aiResult.classList.remove('hidden');
    }, 2000);
  }

  // Form submission
  uploadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const certName = document.getElementById('certName').value.trim();
    const category = document.getElementById('certCategory').value;
    const issuedBy = document.getElementById('issuedBy').value.trim();
    const issueDate = document.getElementById('issueDate').value;

    if (!certName || !category || !issuedBy || !issueDate) {
      alert('Please fill in all required fields.');
      return;
    }
    uploadSuccess.classList.remove('hidden');
    uploadForm.reset();
    filePreview.classList.add('hidden');
    aiAnalysis.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function () { uploadSuccess.classList.add('hidden'); }, 5000);
  });

});
