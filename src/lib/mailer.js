const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c9d274f14580e7",
    pass: "5dbe083e8958d2"
  }
});