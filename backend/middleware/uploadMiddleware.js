// backend/middleware/uploadMiddleware.js
// Multer config for file uploads

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const subfolder = file.fieldname === 'profileImage' ? 'profile-images' : 'certificates';
    const dir = path.join(UPLOAD_DIR, subfolder);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext  = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG and PNG files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

module.exports = upload;
