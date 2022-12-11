const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.model('Admin', new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}))