const router = require('express').Router();

const {
  getAllProductReviews,
  getSingleProductReview,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} = require('../controllers/productReview');

// get all reviews of a product
router.get('/allProductReviews/:productId', getAllProductReviews);
router.get('/:userId/:productId', getSingleProductReview);
router.post('/create', createProductReview);
router.put('/:userId/:reviewId', updateProductReview);
router.delete('/:userId/:reviewId', deleteProductReview);

module.exports = router;
