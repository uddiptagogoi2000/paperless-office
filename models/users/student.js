const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentoredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  course: String,
  dept: String,
})

module.exports = mongoose.model('Student', studentSchema);