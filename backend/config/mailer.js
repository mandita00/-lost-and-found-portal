const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMatchEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Lost & Found Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Nodemailer error:', error);
    throw error;
  }
};

// Must be exported inside an object:
module.exports = { sendMatchEmail };