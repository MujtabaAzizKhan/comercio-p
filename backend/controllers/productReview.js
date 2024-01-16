const productReview = require('../model/productReview');
const Product = require('../model/product');
const User = require('../model/user');
const {sendError} = require('../utils/helper');
const mongoose = require('mongoose');

exports.createProductReview = async (req, res) => {
  try {
    const {review, rating, user, product} = req.body;

    // Check if the user has already posted a review for this product
    const existingReview = await productReview.findOne({user, product});
    if (existingReview) {
      return res
        .status(400)
        .json({error: 'You have already posted a review for this product'});
    }

    const findProduct = await Product.findById(product);
    if (!findProduct) return sendError(res, 'Product not found');

    const findUser = await User.findById(user);
    if (!findUser) return sendError(res, 'User not found');

    const newReview = new productReview({
      review,
      rating,
      product,
      user,
    });

    await newReview.save();

    res.json(newReview);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.deleteProductReview = async (req, res) => {
  try {
    const {userId, reviewId} = req.params;

    // Validate that reviewId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({error: 'Invalid review ID'});
    }

    const review = await productReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({error: 'Review not found'});
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({
        error: `Unauthorized: User ${userId} is not authorized to delete review ${review._id}`,
      });
    }

    const deletedReview = await productReview.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({error: 'Review not found'});
    }

    return res.json({message: 'Review deleted successfully'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.updateProductReview = async (req, res) => {
  try {
    const {userId, reviewId} = req.params;
    const update = req.body;

    // Validate that reviewId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({error: 'Invalid review ID'});
    }

    const review = await productReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({error: 'Review not found'});
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({
        error: `Unauthorized: User ${userId} is not authorized to modify review ${review._id}`,
      });
    }

    const updatedProductReview = await productReview.findByIdAndUpdate(
      reviewId,
      update,
      {new: true},
    );

    if (!updatedProductReview) {
      return res.status(404).json({error: 'Review not found'});
    }

    await updatedProductReview.save();

    res.json({
      success: true,
      review: {
        review: updatedProductReview.review,
        rating: updatedProductReview.rating,
        id: updatedProductReview._id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.getSingleProductReview = async (req, res) => {
  try {
    const {userId, productId} = req.params;

    // Validate that userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid user ID'});
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({error: 'Invalid product ID'});
    }

    const data = await productReview.findOne({
      user: userId,
      product: productId,
    });

    // if (!data) {
    //   return res.status(404).json({error: 'Review not found'});
    // }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.getAllProductReviews = async (req, res) => {
  try {
    const {productId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({error: 'Invalid product ID'});
    }

    const data = await productReview
      .find({product: productId})
      .populate('user', 'name')
      .exec();

    // if (!data || data.length === 0) {
    //   return res.status(404).json({error: 'Reviews not found'});
    // }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};
