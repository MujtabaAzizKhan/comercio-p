const mongoose = require('mongoose');

const sellingHistoryReceiptSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    sellingHistory: [
      {
        buyer: {
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
      },
    ],
  },
  {timestamps: true},
);

module.exports = mongoose.model(
  'sellingHistoryReceipt',
  sellingHistoryReceiptSchema,
);
