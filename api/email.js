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
  console.log(`SENDING EMAIL at ${Date.now()}`)
  const mailOptions = {
    from: gmailAccount,
    to: `${req.body.targetEmail}`,
    subject: 'I just raided my fridge!',
    text: `
      Check out this recipe that I found on the Fridge Raider App!\n
      ${req.body.recipeURL}`,
    html: `
    <h3>Hey ${req.body.recipientName}!</h3>
    <p>Check out this recipe for <a href=${req.body.recipeURL}>${req.body.emailRecipeName}</a> that I found on the Fridge Raider App!</p>
      <a href=${req.body.recipeURL}><img src=${req.body.emailImg} alt="Picture of ${req.body.recipeName}" style="width:240px;height:240px;"></a>
      <br>
      <p>Happy Raiding!</p>
      ${req.body.emailFromName}
    `
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      console.log('Email sent: ' + info.response);
      transporter.close();
      res.sendStatus(200);
    }
  });
});

module.exports = router;
