const {
  getCart,
  createCart,
  updateCart,
  deleteCart,
} = require('../controllers/cart');

const router = require('express').Router();

router.get('/:userId', getCart);
router.post('/create/:user', createCart);
router.put('/update/:userId', updateCart);
router.delete('/delete/:userId', deleteCart);

module.exports = router;
