const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { gmailAccount, gmailPassword } = require('../config'); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: gmailAccount,
    pass: gmailPassword
  }
});

router.post('/send', (req, res, next) => {

  const mailOptions = {
    from: gmailAccount,
    to: `${req.body.targetEmail}`,
    subject: `${req.body.emailSubject}`,
    text: `${req.body.emailText}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
})

module.exports = router;