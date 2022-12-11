const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationRecordSchema = new Schema({
  applicationId: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  stage: { // current stage/receiver
    type: Number,
    min: 1,
    max: 5,
    default: 1
  }
})

module.exports = mongoose.model('ApplicationRecord', applicationRecordSchema);