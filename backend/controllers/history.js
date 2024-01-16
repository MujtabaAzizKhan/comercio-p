const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const mindee = require('mindee');
const client = new mindee.Client({apiKey: '7cf3f897d9ae78c9dc928b800aa8ca70'});

const User = require('../model/user');
const history = require('../model/history');
const {sendError} = require('../utils/helper');
const mongoose = require('mongoose');
const buyingHistoryReceipt = require('../model/buyingHistoryReceipt');

function getRandomChar() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

exports.createHistory = async (req, res) => {
  try {
    const {user} = req.params;
    let historyData = req.body.history;

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({error: 'Invalid User ID'});
    }

    const findUser = await User.findById(user);
    if (!findUser) return sendError(res, 'User not found');

    const orderNumber =
      getRandomChar() +
      getRandomChar() +
      getRandomChar() +
      Math.floor(1000 + Math.random() * 9000) +
      getRandomChar() +
      getRandomChar() +
      Date.now();

    // Convert product._id into ObjectId
    historyData = historyData.map(item => {
      if (typeof item.product === 'string') {
        item.product = mongoose.Types.ObjectId(item.product);
      }
      return item;
    });

    let findHistory = await history.findOne({user});
    if (findHistory) {
      findHistory = await history.findOneAndUpdate(
        {user},
        {
          $push: {
            history: {$each: historyData.map(item => ({...item, orderNumber}))},
          },
        },
        {new: true},
      );
    } else {
      findHistory = new history({
        user,
        history: historyData.map(item => ({...item, orderNumber})),
      });
      await findHistory.save();
    }

    res.json(findHistory);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: error.message});
  }
};
exports.getHistory = async (req, res) => {
  try {
    const {userId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid User ID'});
    }

    const findUser = await User.findById(userId);
    if (!findUser) return sendError(res, 'User not found');

    const findHistory = await history
      .find({user: userId})
      .populate('history.products.product')
      .exec();
    if (!findHistory) return sendError(res, 'History not found');

    res.json(findHistory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.getHistoryByOrderNumber = async (req, res) => {
  try {
    const {orderNumber} = req.params;

    const findHistory = await history
      .findOne({'history.orderNumber': orderNumber}, {'history.$': 1})
      .exec();

    if (!findHistory) return sendError(res, 'History not found');

    let populatedHistory;
    try {
      populatedHistory = await history.populate(findHistory, {
        path: 'history.products.product',
        model: 'Product', // replace 'Product' with your actual product model name
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: 'Error populating product data'});
    }

    res.json(populatedHistory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};
exports.updateHistory = async (req, res) => {
  try {
    const {userId} = req.params;
    const {products} = req.body;
    const {totalPrice} = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid User ID'});
    }

    const findUser = await User.findById(userId);
    if (!findUser) return sendError(res, 'User not found');

    const findHistory = await history.findOneAndUpdate(
      {user: userId},
      {
        $push: {
          history: {
            user: userId,
            products,
            totalPrice,
          },
        },
      },
      {new: true},
    );
    if (!findHistory) return sendError(res, 'History not found');

    res.json(findHistory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const {userId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid User ID'});
    }

    const findUser = await User.findById(userId);
    if (!findUser) return sendError(res, 'User not found');

    const findHistory = await history.findOneAndDelete({user: userId});
    if (!findHistory) return sendError(res, 'History not found');

    return res.json({message: 'History deleted successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

// exports.processInvoice = async (req, res) => {
//   upload.single('file')(req, res, async err => {
//     if (err) {
//       return res
//         .status(500)
//         .json({error: 'An error occurred while uploading the file'});
//     }
//     // console.log(req.body);
//     // Check if req.file is defined
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({error: 'No file was received in the request'});
//     }

//     try {
//       const {buyer} = req.params;
//       const {imageUrl} = req.body;
//       // Load the uploaded file
//       const inputSource = client.docFromPath(req.file.path);

//       // Parse the file
//       const apiResponse = await client.parse(
//         mindee.product.ReceiptV5,
//         inputSource,
//       );

//       // Extract the required fields from the API response
//       const items =
//         apiResponse.document.inference.pages[0].prediction.lineItems.map(
//           item => ({
//             product: item.description,
//             quantity: item.quantity,
//             price: item.totalAmount,
//           }),
//         );

//       const dateValue =
//         apiResponse.document.inference.pages[0].prediction.date.value;
//       const timeValue =
//         apiResponse.document.inference.pages[0].prediction.time.value;
//       const totalAmountValue =
//         apiResponse.document.inference.pages[0].prediction.totalAmount.value;

//       // Create a new sellingHistoryReceipt
//       const newBuyingHistory = {
//         seller: 'user',
//         createdAt: dateValue,
//         products: items,
//         totalPrice: totalAmountValue,
//         imageUrl,
//       };

//       // Find the sellingHistoryReceipt and update it
//       const historyReceipt = await buyingHistoryReceipt.findOneAndUpdate(
//         {buyer},
//         {$push: {buyingHistory: newBuyingHistory}},
//         {new: true, upsert: true},
//       );

//       // Send the result back to the client
//       res.json({items, dateValue, timeValue, totalAmountValue});
//     } catch (error) {
//       console.error(error);
//       console.error('Error details:', error);

//       // Send an error response back to the client
//       res
//         .status(500)
//         .json({error: 'An error occurred while processing the invoice'});
//     }
//   });
// };

exports.getInvoiceByBuyer = async (req, res) => {
  try {
    const {buyer} = req.params;
    if (!mongoose.Types.ObjectId.isValid(buyer)) {
      return res.status(400).json({error: 'Invalid buyer ID'});
    }

    const findUser = await User.findById(buyer);
    if (!findUser) return sendError(res, 'buyer not found');
    if (findUser.isProducer == true)
      return sendError(res, 'Unauthorized, only buyer can get selling history');

    const findBuyingHistory = await buyingHistoryReceipt.find({buyer});

    if (!findBuyingHistory) return sendError(res, 'Buying history not found');

    res.json(findBuyingHistory);
  } catch (error) {
    console.log(error);
    sendError(res, error);
  }
};

exports.processInvoice = async (req, res) => {
  // console.log(req.body);
  // Check if req.file is defined
  if (!req.file) {
    return res.status(400).json({error: 'No file was received in the request'});
  }

  try {
    const {buyer} = req.params;
    let {imageUrl} = req.body;
    imageUrl = JSON.parse(imageUrl);
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
    const newBuyingHistory = {
      seller: 'user',
      createdAt: dateValue,
      products: items,
      totalPrice: totalAmountValue,
      imageUrl,
    };

    // Find the sellingHistoryReceipt and update it
    const historyReceipt = await buyingHistoryReceipt.findOneAndUpdate(
      {buyer},
      {$push: {buyingHistory: newBuyingHistory}},
      {new: true, upsert: true},
    );

    // Send the result back to the client
    res.json({items, dateValue, timeValue, totalAmountValue});
  } catch (error) {
    console.error(error);
    console.error('Error details:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);

    // Send an error response back to the client
    res
      .status(500)
      .json({error: 'An error occurred while processing the invoice'});
  }
};
