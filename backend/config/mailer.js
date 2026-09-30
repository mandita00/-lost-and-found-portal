const axios = require('axios');

function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendMatchEmail(toEmail, subject, htmlContent) {
  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'Lost & Found Portal', email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: toEmail }],
        subject,
        htmlContent,
      },
      { headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' } }
    );
    console.log(`Email sent to ${toEmail}`);
  } catch (err) {
    console.error('Email send error:', err.response?.data || err.message);
  }
}

module.exports = { sendMatchEmail, escapeHtml };