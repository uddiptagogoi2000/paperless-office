const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationTypeSchema = new Schema({
  applicationType: String,
  sendTo: { // first receiver
    type: Number,
    min: 1,
    max: 5,
  },
  endAt: { // end of the path/flow
    type: Number,
    min: 1,
    max: 5,
  }
})

module.exports = mongoose.model('ApplicationType', applicationTypeSchema)