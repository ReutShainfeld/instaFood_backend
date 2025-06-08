// const sgMail = require('@sendgrid/mail');
// require('dotenv').config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendEmail = async (to, subject, htmlContent) => {
//   const msg = {
//     to,
//     from: process.env.EMAIL_SENDER_ADDRESS,
//     subject,
//     html: htmlContent,
//   };

//   await sgMail.send(msg);
// };

// module.exports = sendEmail;
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, htmlContent) => {
  console.log('📨 Preparing to send email...');
  console.log('📤 From:', process.env.EMAIL_SENDER_ADDRESS);
  console.log('📬 To:', to);
  console.log('🧪 Subject:', subject);
  console.log('🧪 Using API Key prefix:', process.env.SENDGRID_API_KEY?.slice(0, 10)); 

  const msg = {
    to,
    from: process.env.EMAIL_SENDER_ADDRESS,
    subject,
    html: htmlContent,
  };

  await sgMail.send(msg);
  console.log('✅ Email sent successfully!');
};

module.exports = sendEmail;
