const sendMatchEmail = async (to, subject, htmlContent) => {
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
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  return res.json();
};

module.exports = { sendMatchEmail };