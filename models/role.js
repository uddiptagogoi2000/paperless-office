const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  userType: String,
  typeValue: {
    type: Number,
    min: 0,
    max: 5
  }
})

module.exports = mongoose.model('Role', roleSchema);