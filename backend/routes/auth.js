// backend/routes/auth.js

const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, rollNumber, collegeId, department, year } = req.body;

    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashed, role || 'student']
    );
    const userId = result.insertId;

    if (!role || role === 'student') {
      await db.execute(
        'INSERT INTO students (user_id, first_name, last_name, roll_number, college_id, department, year, portfolio_slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, firstName, lastName, rollNumber || null, collegeId || null, department || null, year || null, rollNumber || `student-${userId}`]
      );
    }

    const token = generateToken({ id: userId, email, role: role || 'student' });
    res.status(201).json({ success: true, token, message: 'Registration successful.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ success: true, token, role: user.role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
