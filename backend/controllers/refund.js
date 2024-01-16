const User = require('../model/user');
const Refund = require('../model/refund');
const mongoose = require('mongoose');

exports.returnRequest = async (req, res) => {
  try {
    // Create a new refund instance with data from the request body
    const newRefund = new Refund({
      customerId: req.body.customerId,
      orderNumber: req.body.orderNumber,
      producer: req.body.producer,
      product: req.body.product,
      quantity: req.body.quantity,
      reason: req.body.reason,
      isAccepted: false, // Set isAccepted to false by default
    });

    // console.log(newRefund);

    // Save the refund data to the database
    await newRefund.save();

    res.status(201).json({message: 'Refund submitted successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.getRequests = async (req, res) => {
  try {
    const brandName = req.params.brandName;
    // console.log(brandName);

    // Use a case-insensitive regular expression for matching the producer's brand name
    const regex = new RegExp(brandName, 'i');

    // Find all refund and return requests with the given producer's brand name (case-insensitive)
    const requests = await Refund.find({producer: {$regex: regex}});

    // Fetch customer names concurrently for all requests
    const requestsWithNames = await Promise.all(
      requests.map(async request => {
        const customer = await User.findById(request.customerId);
        const customerName = customer ? customer.name : 'N/A';
        return {...request.toObject(), customerName};
      }),
    );

    res.status(200).json({requests: requestsWithNames});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
