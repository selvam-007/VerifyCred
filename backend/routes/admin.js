// backend/routes/admin.js

const express  = require('express');
const router   = express.Router();
const db       = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const adminOnly = [protect, roleMiddleware('admin')];

// GET /api/admin/stats
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const [[{ students }]]  = await db.execute('SELECT COUNT(*) AS students FROM students');
    const [[{ colleges }]]  = await db.execute('SELECT COUNT(*) AS colleges FROM colleges WHERE is_approved = 1');
    const [[{ companies }]] = await db.execute('SELECT COUNT(*) AS companies FROM companies');
    const [[{ total }]]     = await db.execute('SELECT COUNT(*) AS total FROM certificates');
    const [[{ verified }]]  = await db.execute(`SELECT COUNT(*) AS verified FROM certificates WHERE verification_status = 'verified'`);
    const [[{ fake }]]      = await db.execute(`SELECT COUNT(*) AS fake FROM certificates WHERE ai_check_result = 'fake'`);
    res.json({ success: true, stats: { students, colleges, companies, total, verified, fake } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/colleges/pending
router.get('/colleges/pending', ...adminOnly, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM colleges WHERE is_approved = 0 ORDER BY created_at DESC');
    res.json({ success: true, colleges: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/colleges/:id/approve
router.put('/colleges/:id/approve', ...adminOnly, async (req, res) => {
  try {
    await db.execute('UPDATE colleges SET is_approved = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'College approved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', ...adminOnly, async (req, res) => {
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/ai-flags  – certificates flagged by AI
router.get('/ai-flags', ...adminOnly, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.*, s.first_name, s.last_name, s.roll_number FROM certificates c
       JOIN students s ON c.student_id = s.id
       WHERE c.ai_check_result IN ('suspicious','fake')
       ORDER BY c.ai_check_score DESC`
    );
    res.json({ success: true, flagged: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
