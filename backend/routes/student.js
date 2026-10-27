// backend/routes/student.js

const express  = require('express');
const router   = express.Router();
const db       = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// GET /api/student/profile  – own profile
router.get('/profile', protect, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT s.*, u.email, col.name AS college_name
       FROM students s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN colleges col ON s.college_id = col.id
       WHERE s.user_id = ?`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Profile not found.' });
    res.json({ success: true, student: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/student/portfolio/:slug  – public portfolio
router.get('/portfolio/:slug', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT s.*, col.name AS college_name FROM students s LEFT JOIN colleges col ON s.college_id = col.id WHERE s.portfolio_slug = ?',
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Portfolio not found.' });
    const student = rows[0];

    // Increment view count
    await db.execute('UPDATE students SET profile_views = profile_views + 1 WHERE id = ?', [student.id]);

    // Get verified certificates
    const [certs] = await db.execute(
      `SELECT * FROM certificates WHERE student_id = ? AND is_public = 1 ORDER BY created_at DESC`,
      [student.id]
    );
    const [projects]  = await db.execute('SELECT * FROM projects WHERE student_id = ?', [student.id]);
    const [skills]    = await db.execute('SELECT * FROM skills WHERE student_id = ?', [student.id]);

    res.json({ success: true, student, certificates: certs, projects, skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/student/profile  – update own profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { bio, githubUrl, linkedinUrl } = req.body;
    await db.execute(
      'UPDATE students SET bio = ?, github_url = ?, linkedin_url = ? WHERE user_id = ?',
      [bio, githubUrl, linkedinUrl, req.user.id]
    );
    res.json({ success: true, message: 'Profile updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/student/dashboard  – stats
router.get('/dashboard', protect, async (req, res) => {
  try {
    const [studentRow] = await db.execute('SELECT id, profile_views FROM students WHERE user_id = ?', [req.user.id]);
    if (!studentRow.length) return res.status(404).json({ success: false, message: 'Student not found.' });
    const sid = studentRow[0].id;

    const [[{ total }]]    = await db.execute('SELECT COUNT(*) AS total FROM certificates WHERE student_id = ?', [sid]);
    const [[{ verified }]] = await db.execute(`SELECT COUNT(*) AS verified FROM certificates WHERE student_id = ? AND verification_status = 'verified'`, [sid]);
    const [[{ pending }]]  = await db.execute(`SELECT COUNT(*) AS pending FROM certificates WHERE student_id = ? AND verification_status = 'pending'`, [sid]);
    const [[{ projects }]] = await db.execute('SELECT COUNT(*) AS projects FROM projects WHERE student_id = ?', [sid]);

    res.json({
      success: true,
      stats: {
        total, verified, pending, projects,
        profileViews: studentRow[0].profile_views
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
