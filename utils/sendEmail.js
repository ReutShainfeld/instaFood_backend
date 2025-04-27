const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, htmlContent) => {
  const msg = {
    to,
    from: process.env.EMAIL_SENDER_ADDRESS,
    subject,
    html: htmlContent,
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;
