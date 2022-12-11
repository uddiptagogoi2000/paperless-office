const otpgenerator = require('otp-generator');

module.exports.generateOTP = () => {
  const otp = otpgenerator.generate(6, {
    upperCaseAlphabets: false, specialChars: false
  });
  return otp;
} 