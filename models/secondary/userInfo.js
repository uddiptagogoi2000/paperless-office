const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// for already saved information about the user
const userInfoSchema = new Schema({
  mail: String,
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
  },
})

module.exports = mongoose.model('UserInfo', userInfoSchema);