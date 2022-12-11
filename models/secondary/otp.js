const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getMillisecond } = require('../../utils/getExpiryDate')

// console.log(`createdAt ${createdAt} and expiryAt ${expiryAt}`);

const otpSchema = new Schema({
  value: String,
  email: String,
  expiresAt: {
    type: String,
    default: () => {
      const expiryAt = Date.now() + 60000;
      return expiryAt.toString()
    }
  }
}, { timestamps: true });

// otpSchema.set({ expiresAt: getMillisecond(createdAt) + 3000 });

module.exports = mongoose.model('Otp', otpSchema);