const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    history: [
      {
        orderNumber: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        products: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Product',
              required: true,
            },
            quantity: {
              type: String,
              required: true,
            },
            price: {
              type: String,
              required: true,
            },
          },
        ],
        totalPrice: {
          type: String,
          required: true,
          default: 0,
        },
      },
    ],
  },
  {timestamps: true},
);

module.exports = mongoose.model('history', historySchema);
