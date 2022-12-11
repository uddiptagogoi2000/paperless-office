let nodemailer = require('nodemailer');

module.exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devdemo68@gmail.com',
    pass: 'kbolmeogiyxmkycv'
  },
});
