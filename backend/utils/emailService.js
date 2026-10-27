// backend/utils/emailService.js
// Send emails using Nodemailer

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.MAIL_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

/**
 * Send a notification email.
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from:    `"VerifyCred" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  });
}

function verifiedCertEmail(studentName, certName) {
  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
      <h2 style="color:#2563eb;">✓ Certificate Verified</h2>
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>Your certificate <strong>${certName}</strong> has been verified by your college on VerifyCred.</p>
      <p>It is now publicly visible on your portfolio with a QR code.</p>
      <a href="https://verifycred.com/dashboard" style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:1rem;">View Dashboard</a>
      <p style="color:#6b7280;font-size:.85rem;margin-top:2rem;">– VerifyCred Team</p>
    </div>`;
}

module.exports = { sendEmail, verifiedCertEmail };
