const mongoose = require('mongoose');

const producerReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    distributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('ProducerReview', producerReviewSchema);
