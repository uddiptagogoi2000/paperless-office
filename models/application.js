const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ApplicationSchema = new Schema({
  type: {
    type: Schema.Types.ObjectId,
    ref: 'ApplicationType'
  },
  status: [
    {
      statusType:
      {
        type: String,
        enum: ['approved', 'declined', 'forwarded'],
      },
      author: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }]
    }
  ],
  statusModifiers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  // status: {
  //   type: String,
  //   enum: ['in-progress', 'approved', 'declined', 'forwared'],
  //   default: 'in-progress'
  // },
  subject: {
    type: String,
    uppercase: true
  },
  description: String,
  createdAt: {
    type: Date,
    // immutable: true,
    default: () => Date.now() // if there is no date
  },
  updatedAt: {
    type: Date,
    default: () => Date.now() // if there is no date
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  forwards: [
    {
      forwardedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
      forwardedTo: [
        {
          type: Schema.Types.ObjectId, ref: 'User', default: null
        }
      ]
    }
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
});

ApplicationSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Application', ApplicationSchema)