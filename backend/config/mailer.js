const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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
    await resend.emails.send({
      from: 'FindWise <onboarding@resend.dev>',
      to: toEmail,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${toEmail}`);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

module.exports = { sendMatchEmail, escapeHtml };