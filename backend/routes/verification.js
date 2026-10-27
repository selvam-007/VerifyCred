// backend/routes/verification.js

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET /api/verification/:uid  – public endpoint for QR scan
router.get('/:uid', async (req, res) => {
  try {
    const uid = req.params.uid.toUpperCase();
    const [rows] = await db.execute(
      `SELECT c.certificate_name, c.certificate_uid, c.issued_by, c.category,
              c.issue_date, c.expiry_date, c.verification_status, c.verified_at,
              c.digital_signature,
              s.first_name, s.last_name, s.roll_number, s.portfolio_slug,
              col.name AS college_name
       FROM certificates c
       JOIN students s    ON c.student_id = s.id
       LEFT JOIN colleges col ON s.college_id = col.id
       WHERE c.certificate_uid = ?`,
      [uid]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Certificate not found.', verified: false });
    }

    const cert = rows[0];
    const isVerified = cert.verification_status === 'verified';

    // Log the scan
    await db.execute(
      'INSERT INTO verification_logs (certificate_id, verified_by_ip) VALUES ((SELECT id FROM certificates WHERE certificate_uid = ?), ?)',
      [uid, req.ip]
    ).catch(() => {}); // Non-blocking

    res.json({
      success: true,
      verified: isVerified,
      status: cert.verification_status,
      certificate: isVerified ? cert : null,
      message: isVerified
        ? 'Certificate is authentic and verified.'
        : cert.verification_status === 'pending'
          ? 'Certificate is pending verification.'
          : 'Certificate has been rejected.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
