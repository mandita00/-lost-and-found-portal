const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMatchEmail(toEmail, itemName, confidence) {
  try {
    await resend.emails.send({
      from: 'Lost & Found Portal <onboarding@resend.dev>',
      to: toEmail,
      subject: `Possible match found for your lost item: ${itemName}`,
      html: `
        <h2>Good news!</h2>
        <p>We found a possible match for your lost item <b>${itemName}</b>.</p>
        <p>Match confidence: <b>${confidence}</b></p>
        <p>Log in to your account to review and confirm the match.</p>
      `,
    });
    console.log(`Email sent to ${toEmail}`);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

module.exports = { sendMatchEmail };