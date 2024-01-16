const mongoose = require('mongoose');

const buyingHistoryReceiptSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    buyingHistory: [
      {
        seller: {
          type: String,
        },
        createdAt: {
          type: String,
          default: Date.now,
        },
        products: [
          {
            product: {
              type: String,
            },
            quantity: {
              type: String,
            },
            price: {
              type: String,
            },
          },
        ],
        totalPrice: {
          type: String,
        },
        imageUrl: {
          type: String,
        },
      },
    ],
  },
  {timestamps: true},
);

module.exports = mongoose.model(
  'buyingHistoryReceipt',
  buyingHistoryReceiptSchema,
);
