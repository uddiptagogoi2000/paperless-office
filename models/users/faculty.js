const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facultySchema = new Schema({
  isHod: {
    type: Boolean,
    rquired: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  courses: [String],
})

module.exports = mongoose.model('Faculty', facultySchema);