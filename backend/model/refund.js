const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    producer: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Refund', refundSchema);
