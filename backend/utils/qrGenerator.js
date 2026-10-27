// backend/utils/qrGenerator.js
// Generate QR code as Data URL

const QRCode = require('qrcode');

/**
 * Generate a QR code Data URL for the given certificate UID.
 * @param {string} uid  - Certificate UID (e.g. VC-2024-AWS-00123)
 * @returns {Promise<string>} base64 Data URL
 */
async function generateQR(uid) {
  const url = `https://verifycred.com/verify/${uid}`;
  const dataUrl = await QRCode.toDataURL(url, {
    width:     250,
    margin:    2,
    color:     { dark: '#1f2937', light: '#ffffff' }
  });
  return dataUrl;
}

module.exports = { generateQR };
