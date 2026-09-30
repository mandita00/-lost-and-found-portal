// Sends email through Brevo's HTTPS API (port 443), so it works on Render's free
// tier, which blocks outbound SMTP ports 25, 465 and 587.
// Requires Node 18+ (built-in fetch and AbortSignal.timeout).

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

const sendMatchEmail = async (to, subject, htmlContent) => {
  if (!process.env.BREVO_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error('BREVO_API_KEY or EMAIL_FROM is not set');
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'FindWise', email: process.env.EMAIL_FROM },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
    signal: AbortSignal.timeout(10000), // don't hang the matching job
  });

  if (!res.ok) {
    throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  console.log('Email sent via Brevo:', data.messageId);
  return data;
};

module.exports = { sendMatchEmail, escapeHtml };