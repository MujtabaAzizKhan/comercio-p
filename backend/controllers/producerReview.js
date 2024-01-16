const producerReview = require('../model/producerReview');
const Product = require('../model/product');
const User = require('../model/user');
const {sendError} = require('../utils/helper');
const mongoose = require('mongoose');

exports.createProducerReview = async (req, res) => {
  try {
    const {review, rating, distributor, producer} = req.body;

    if (!mongoose.Types.ObjectId.isValid(distributor)) {
      return res.status(400).json({error: 'Invalid distributor ID'});
    }

    if (!mongoose.Types.ObjectId.isValid(producer)) {
      return res.status(400).json({error: 'Invalid producer ID'});
    }

    // Check if the user has already posted a review for this producer
    const existingReview = await producerReview.findOne({
      producer,
      distributor,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({error: 'You have already posted a review for this producer'});
    }

    const findUser = await User.findOne({_id: producer, isProducer: true});
    if (!findUser) return sendError(res, 'Producer not found');

    const isDistributor = await User.findById(distributor);
    if (isDistributor.isProducer == true)
      return sendError(res, 'Not Authorized to post a review');

    const newReview = new producerReview({
      review,
      rating,
      producer,
      distributor,
    });

    await newReview.save();

    res.json(newReview);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.deleteProducerReview = async (req, res) => {
  try {
    const {userId, reviewId} = req.params;

    // Validate that reviewId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({error: 'Invalid review ID'});
    }

    const review = await producerReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({error: 'Review not found'});
    }

    if (review.distributor.toString() !== userId) {
      return res.status(403).json({
        error: `Unauthorized: User ${userId} is not authorized to delete review ${review._id}`,
      });
    }

    const deletedReview = await producerReview.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({error: 'Review not found'});
    }

    return res.json({message: 'Review deleted successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.updateProducerReview = async (req, res) => {
  try {
    const {userId, reviewId} = req.params;
    const update = req.body;

    // Validate that reviewId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({error: 'Invalid review ID'});
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid user ID'});
    }

    const existingReview = await producerReview.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({error: 'Review not found'});
    }

    if (existingReview.distributor.toString() !== userId) {
      return res.status(403).json({
        error: `Unauthorized: User ${userId} is not authorized to delete review ${existingReview._id}`,
      });
    }

    const updatedProductReview = await producerReview.findByIdAndUpdate(
      reviewId,
      update,
      {new: true},
    );

    await updatedProductReview.save();

    return res.json({success: true, updatedProductReview});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.getSingleProducerReview = async (req, res) => {
  try {
    const {distributorId, producerId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(distributorId)) {
      return res.status(400).json({error: 'Invalid distributor ID'});
    }

    if (!mongoose.Types.ObjectId.isValid(producerId)) {
      return res.status(400).json({error: 'Invalid producer ID'});
    }

    const findDistributor = await User.findById(distributorId);
    if (!findDistributor) return sendError(res, 'Distributor not found');

    const findProducer = await User.findById(producerId);
    if (!findProducer) return sendError(res, 'Producer not found');

    const review = await producerReview.findOne({
      distributor: distributorId,
      producer: producerId,
    });
    if (!review) {
      return res.status(404).json({error: 'Review not found'});
    }

    return res.json(review);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.getAllProducerReviews = async (req, res) => {
  try {
    const {producerId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(producerId)) {
      return res.status(400).json({error: 'Invalid producer ID'});
    }

    const user = await User.findById(producerId);
    if (!user) return sendError(res, 'Producer not found');

    const reviews = await producerReview.find({producer: producerId});
    if (!reviews) {
      return res.status(404).json({error: 'Reviews not found'});
    }

    return res.json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};
