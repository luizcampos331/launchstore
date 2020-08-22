const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  //utilize as informações do seu ervidor de e-mail
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c1f06dace12d50",
    pass: "c64b02d247eae7"
  }
});