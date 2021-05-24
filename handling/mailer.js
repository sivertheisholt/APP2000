const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const logger = require('../logging/logger');
const ValidationHandler = require('../handling/ValidationHandler');

/**
 * lager et gjenbrukbart transportørobjekt ved hjelp av standard SMTP-transport
 * @author Ørjan Dybevik - 233530
 */
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

/**
 * Sjekker at transporteren er klar til bruk og funker.
 * @author Ørjan Dybevik - 233530
 */
transporter.verify(function(err, success) {
  if (err) {
    logger.log({level: 'error', message: `Could not initialize email transporter! ${err}`});
  } else {
      logger.log({level: 'debug', message: 'Email transporter is ready and functional'});
  }
});

/**
 * Lagrer mail funksjonen i en variabel slik den kan brukes flere steder
 * @param {Til, Fra, Emne, Text} mailOptions 
 * @author Ørjan Dybevik - 233530
 */
let sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions,(err, info) => {
    if(err){
      logger.log({level: 'error', message: `Could not send email! Error: ${err}`});
      return new ValidationHandler(false, 'Could not send response mail');
    } else {
      logger.log({level: 'debug', message: `Email sent: ${info.response}`});
      return new ValidationHandler(true, info.response);
    }
  })
}

module.exports = sendMail;