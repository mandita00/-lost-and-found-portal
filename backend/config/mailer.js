const nodemailer = require('nodemailer');

// 1. Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 2. Email sending function
async function sendMatchNotification(recipientEmail, itemDetails) {
  try {
    const mailOptions = {
      from: `"Lost & Found Portal" <${process.env.EMAIL_USER}>`,
      to: recipientEmail, // Dynamic user email address
      subject: 'Item Found Notification',
      html: `
        <h2>Good news!</h2>
        <p>A found item report matching your lost item <strong>${itemDetails.title}</strong> has been submitted.</p>
        <p>Log in to your account to view the details.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error);
    throw error;
  }
}

module.exports = { sendMatchNotification };