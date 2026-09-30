const axios = require('axios');

async function sendMatchEmail(toEmail, itemName, confidence) {
  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'Lost & Found Portal', email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: toEmail }],
        subject: `Possible match found for your lost item: ${itemName}`,
        htmlContent: `
          <h2>Good news!</h2>
          <p>We found a possible match for your lost item <b>${itemName}</b>.</p>
          <p>Match confidence: <b>${confidence}</b></p>
          <p>Log in to your account to review and confirm the match.</p>
        `,
      },
      { headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' } }
    );
    console.log(`Email sent to ${toEmail}`);
  } catch (err) {
    console.error('Email send error:', err.response?.data || err.message);
  }
}

module.exports = { sendMatchEmail };