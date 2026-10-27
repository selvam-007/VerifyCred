// backend/routes/company.js

const express  = require('express');
const router   = express.Router();
const db       = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET /api/company/search?q=&dept=&year=
router.get('/search', protect, roleMiddleware('company', 'admin'), async (req, res) => {
  try {
    const { q = '', dept = '', year = '' } = req.query;
    let sql = `SELECT s.id, s.first_name, s.last_name, s.roll_number, s.department, s.year,
                      s.portfolio_slug, s.profile_views, col.name AS college_name,
                      (SELECT COUNT(*) FROM certificates c WHERE c.student_id = s.id AND c.verification_status = 'verified') AS verified_certs
               FROM students s
               LEFT JOIN colleges col ON s.college_id = col.id
               WHERE 1=1`;
    const params = [];
    if (q)    { sql += ' AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.roll_number LIKE ?)'; params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
    if (dept) { sql += ' AND s.department LIKE ?'; params.push(`%${dept}%`); }
    if (year) { sql += ' AND s.year = ?'; params.push(year); }
    sql += ' ORDER BY verified_certs DESC LIMIT 50';
    const [rows] = await db.execute(sql, params);
    res.json({ success: true, candidates: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/company/candidate/:portfolioSlug
router.get('/candidate/:portfolioSlug', protect, roleMiddleware('company', 'admin'), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT s.*, col.name AS college_name, u.email FROM students s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN colleges col ON s.college_id = col.id
       WHERE s.portfolio_slug = ?`,
      [req.params.portfolioSlug]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Candidate not found.' });
    const s = rows[0];

    const [certs]    = await db.execute(`SELECT * FROM certificates WHERE student_id = ? AND verification_status = 'verified' AND is_public = 1`, [s.id]);
    const [projects] = await db.execute('SELECT * FROM projects WHERE student_id = ?', [s.id]);
    const [skills]   = await db.execute('SELECT * FROM skills WHERE student_id = ?', [s.id]);

    // Increment view
    await db.execute('UPDATE students SET profile_views = profile_views + 1 WHERE id = ?', [s.id]);

    res.json({ success: true, student: s, certificates: certs, projects, skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
