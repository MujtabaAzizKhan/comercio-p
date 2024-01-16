const mongoose = require('mongoose');

const sellingHistorySchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    sellingHistory: [
      {
        buyer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        orderNumber: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isDelivered: {
          type: Boolean,
          default: false,
          required: false,
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

module.exports = mongoose.model('sellingHistory', sellingHistorySchema);
