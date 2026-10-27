// backend/routes/certificate.js

const express  = require('express');
const router   = express.Router();
const db       = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const upload   = require('../middleware/uploadMiddleware');
const { v4: uuidv4 } = require('uuid');
const QRCode   = require('qrcode');

// GET /api/certificate/verify/:uid  (public)
router.get('/verify/:uid', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.*, s.first_name, s.last_name, s.roll_number, col.name AS college_name
       FROM certificates c
       JOIN students s   ON c.student_id = s.id
       LEFT JOIN colleges col ON s.college_id = col.id
       WHERE c.certificate_uid = ? AND c.verification_status = 'verified'`,
      [req.params.uid]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Certificate not found or not verified.' });
    }
    // Increment scan count
    await db.execute('UPDATE qr_codes SET scan_count = scan_count + 1 WHERE certificate_id = ?', [rows[0].id]);
    res.json({ success: true, certificate: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/certificate/my  (student)
router.get('/my', protect, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM certificates WHERE student_id = (SELECT id FROM students WHERE user_id = ?) ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, certificates: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/certificate/upload  (student)
router.post('/upload', protect, upload.single('certificate'), async (req, res) => {
  try {
    const { certName, issuedBy, organization, category, issueDate, expiryDate, skills, description } = req.body;
    const fileUrl = req.file ? '/uploads/certificates/' + req.file.filename : null;
    const uid     = 'VC-' + new Date().getFullYear() + '-' + uuidv4().slice(0, 8).toUpperCase();

    const [student] = await db.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    if (!student.length) return res.status(404).json({ success: false, message: 'Student not found.' });

    const [result] = await db.execute(
      `INSERT INTO certificates (student_id, certificate_name, certificate_uid, issued_by, organization,
        category, issue_date, expiry_date, skills, description, file_url, verification_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [student[0].id, certName, uid, issuedBy, organization || issuedBy, category,
       issueDate || null, expiryDate || null, skills || null, description || null, fileUrl]
    );

    // Generate QR code
    const qrData = `https://verifycred.com/verify/${uid}`;
    const qrUrl  = await QRCode.toDataURL(qrData);
    await db.execute('INSERT INTO qr_codes (certificate_id, qr_data, qr_image_url) VALUES (?, ?, ?)',
      [result.insertId, qrData, qrUrl]);
    await db.execute('UPDATE certificates SET qr_code_url = ? WHERE id = ?', [qrUrl, result.insertId]);

    res.status(201).json({ success: true, message: 'Certificate uploaded. Pending verification.', uid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/certificate/:id/verify  (faculty)
router.put('/:id/verify', protect, async (req, res) => {
  try {
    if (!['faculty', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only faculty can verify certificates.' });
    }
    const [fac] = await db.execute('SELECT id FROM faculty WHERE user_id = ?', [req.user.id]);
    const facId = fac.length ? fac[0].id : null;

    await db.execute(
      `UPDATE certificates SET verification_status = 'verified', verified_by = ?, verified_at = NOW() WHERE id = ?`,
      [facId, req.params.id]
    );
    res.json({ success: true, message: 'Certificate verified.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/certificate/:id/reject  (faculty)
router.put('/:id/reject', protect, async (req, res) => {
  try {
    const { reason } = req.body;
    await db.execute(
      `UPDATE certificates SET verification_status = 'rejected', rejected_reason = ? WHERE id = ?`,
      [reason || 'Rejected by faculty', req.params.id]
    );
    res.json({ success: true, message: 'Certificate rejected.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
