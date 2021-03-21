const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const logger = require('../logging/logger');

let transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: false,
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
}));

let sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions,(err, info) => {
    if(err){
      logger.log({level: 'error', message: `Could not send email! Error: ${err}`});
      return console.log(err);
    } else {
      logger.log({level: 'debug', message: `Email sent: ${info.response}`});
    }
  })
}

module.exports = sendMail;