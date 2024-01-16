const router = require('express').Router();

const {
  getAllProducerReviews,
  getSingleProducerReview,
  createProducerReview,
  updateProducerReview,
  deleteProducerReview,
} = require('../controllers/producerReview');

// get all reviews of a product
router.get('/allProducerReviews/:producerId', getAllProducerReviews);
router.get('/:distributorId/:producerId', getSingleProducerReview);
router.post('/create', createProducerReview);
router.put('/:userId/:reviewId', updateProducerReview);
router.delete('/:userId/:reviewId', deleteProducerReview);

module.exports = router;
