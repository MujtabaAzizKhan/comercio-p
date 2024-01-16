const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const mindee = require('mindee');
const client = new mindee.Client({apiKey: ''});

const User = require('../model/user');
const sellingHistory = require('../model/sellingHistory');
const sellingHistoryReceipt = require('../model/sellingHistoryReceipt');
const {sendError} = require('../utils/helper');
const mongoose = require('mongoose');

exports.createSellingHistory = async (req, res) => {
  try {
    const {seller} = req.params;
    let sellingHistoryData = req.body.sellingHistory;

    if (!mongoose.Types.ObjectId.isValid(seller)) {
      return res.status(400).json({error: 'Invalid Seller ID'});
    }

    const findUser = await User.findById(seller);
    if (!findUser) return sendError(res, 'Seller not found');
    if (findUser.isProducer == false)
      return sendError(
        res,
        'Unauthorized, only seller can create selling history',
      );

    if (!sellingHistoryData) {
      return res.status(400).json({error: 'Selling history data is required'});
    }

    // Check if an order with the same buyer and orderNumber already exists
    for (let item of sellingHistoryData) {
      const existingOrder = await sellingHistory.findOne({
        'sellingHistory.buyer': item.buyer,
        'sellingHistory.orderNumber': item.orderNumber,
      });
      if (existingOrder) {
        return res.status(400).json({error: 'This order already exists'});
      }
    }

    // Convert product._id into ObjectId
    sellingHistoryData = sellingHistoryData.map(item => {
      if (typeof item.product === 'string') {
        item.product = mongoose.Types.ObjectId(item.product);
      }

      return item;
    });

    let findSellingHistory = await sellingHistory.findOne({seller});
    if (findSellingHistory) {
      findSellingHistory = await sellingHistory.findOneAndUpdate(
        {seller},
        {
          $push: {
            sellingHistory: {$each: sellingHistoryData},
          },
        },
        {new: true},
      );
    } else {
      findSellingHistory = new sellingHistory({
        seller,
        sellingHistory: sellingHistoryData,
      });
      await findSellingHistory.save();
    }

    res.json(findSellingHistory);
  } catch (error) {
    console.log(error);
    sendError(res, error);
  }
};

exports.getSellingHistory = async (req, res) => {
  try {
    const {seller} = req.params;
    if (!mongoose.Types.ObjectId.isValid(seller)) {
      return res.status(400).json({error: 'Invalid Seller ID'});
    }

    const findUser = await User.findById(seller);
    if (!findUser) return sendError(res, 'Seller not found');
    if (findUser.isProducer == false)
      return sendError(
        res,
        'Unauthorized, only seller can get selling history',
      );

    const findSellingHistory = await sellingHistory
      .find({seller})
      .populate('sellingHistory.products.product')
      .exec();
    if (!findSellingHistory) return sendError(res, 'Selling history not found');

    res.json(findSellingHistory);
  } catch (error) {
    console.log(error);
    sendError(res, error);
  }
};

exports.getSellingHistoryByOrderNumber = async (req, res) => {
  try {
    const {orderNumber} = req.params;

    const findSellingHistory = await sellingHistory
      .findOne(
        {'sellingHistory.orderNumber': orderNumber},
        {'sellingHistory.$': 1},
      )
      .exec();

    if (!findSellingHistory) return sendError(res, 'Selling history not found');

    let populatedHistory;
    try {
      populatedHistory = await sellingHistory.populate(findSellingHistory, {
        path: 'sellingHistory.products.product',
        model: 'Product',
      });
      populatedHistory = await sellingHistory.populate(populatedHistory, {
        path: 'sellingHistory.buyer',
        model: 'User',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: 'Internal server error'});
    }
    res.json(populatedHistory);
  } catch (error) {
    console.log(error);
    sendError(res, error);
  }
};

exports.toggleDelivered = async (req, res) => {
  try {
    const {orderNumber} = req.params;

    // Find the seller based on the orderNumber
    const seller = await sellingHistory.findOne({
      'sellingHistory.orderNumber': orderNumber,
    });

    // Find the order within the seller's sellingHistory
    const order = seller.sellingHistory.find(
      order => order.orderNumber === orderNumber,
    );

    // Toggle the isDelivered status
    order.isDelivered = !order.isDelivered;

    // Save the changes
    await seller.save();

    res.status(200).json({
      success: true,
      message: 'isDelivered status toggled successfully',
    });
  } catch (error) {
    console.error('Error toggling isDelivered status:', error);
    res.status(500).json({success: false, error: 'Internal Server Error'});
  }
};

exports.processInvoice = async (req, res) => {
  upload.single('file')(req, res, async err => {
    if (err) {
      return res
        .status(500)
        .json({error: 'An error occurred while uploading the file'});
    }

    try {
      const {seller} = req.params;
      // Load the uploaded file
      const inputSource = client.docFromPath(req.file.path);

      // Parse the file
      const apiResponse = await client.parse(
        mindee.product.ReceiptV5,
        inputSource,
      );

      // Extract the required fields from the API response
      const items =
        apiResponse.document.inference.pages[0].prediction.lineItems.map(
          item => ({
            product: item.description,
            quantity: item.quantity,
            price: item.totalAmount,
          }),
        );

      const dateValue =
        apiResponse.document.inference.pages[0].prediction.date.value;
      const timeValue =
        apiResponse.document.inference.pages[0].prediction.time.value;
      const totalAmountValue =
        apiResponse.document.inference.pages[0].prediction.totalAmount.value;

      // Create a new sellingHistoryReceipt
      const newSellingHistory = {
        buyer: 'user',
        createdAt: dateValue,
        products: items,
        totalPrice: totalAmountValue,
      };

      // Find the sellingHistoryReceipt and update it
      const historyReceipt = await sellingHistoryReceipt.findOneAndUpdate(
        {seller},
        {$push: {sellingHistory: newSellingHistory}},
        {new: true, upsert: true},
      );

      // Send the result back to the client
      res.json({items, dateValue, timeValue, totalAmountValue});
    } catch (error) {
      console.error(error);

      // Send an error response back to the client
      res
        .status(500)
        .json({error: 'An error occurred while processing the invoice'});
    }
  });
};

exports.getInvoiceBySeller = async (req, res) => {
  try {
    const {seller} = req.params;
    if (!mongoose.Types.ObjectId.isValid(seller)) {
      return res.status(400).json({error: 'Invalid Seller ID'});
    }

    const findUser = await User.findById(seller);
    if (!findUser) return sendError(res, 'Seller not found');
    if (findUser.isProducer == false)
      return sendError(
        res,
        'Unauthorized, only seller can get selling history',
      );

    const findSellingHistory = await sellingHistoryReceipt
      .find({seller})
      .populate('sellingHistory.products.product')
      .exec();
    if (!findSellingHistory) return sendError(res, 'Selling history not found');

    res.json(findSellingHistory);
  } catch (error) {
    console.log(error);
    sendError(res, error);
  }
};
