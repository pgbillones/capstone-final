const nodemailer = require("nodemailer");
const credentials = require('./emailCredentials');
// this function is to send email 
async function sendEmail(toAddress, subject, message) {
  // we are cofiguring gmail smtp server. 
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: credentials.username, 
      pass: credentials.password, 
    },
  });
  // this will send them email 
  let info = await transporter.sendMail({
    from: credentials.username, 
    to: toAddress, 
    subject: subject, 
    text: message, 
    html: message, 
  });

}

module.exports = sendEmail;