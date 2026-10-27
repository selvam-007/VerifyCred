// VerifyCred Backend – server.js
// Node.js + Express entry point

const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---- Routes ----
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/student',      require('./routes/student'));
app.use('/api/certificate',  require('./routes/certificate'));
app.use('/api/verification', require('./routes/verification'));
app.use('/api/company',      require('./routes/company'));
app.use('/api/admin',        require('./routes/admin'));

// ---- Health Check ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VerifyCred API is running', version: '1.0.0' });
});

// ---- Global Error Handler ----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`VerifyCred server running on http://localhost:${PORT}`);
});

module.exports = app;
