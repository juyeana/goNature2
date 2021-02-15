const nodemailer = require('nodemailer');
// const keys = require('../config/keys');

const sendEmail = async options => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    // service:'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //define email options

  const mailOptions = {
    from: 'Juyean Lee <admin@jlee.app>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // send email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
