const {
  getSellingHistory,
  getSellingHistoryByOrderNumber,
  createSellingHistory,
  toggleDelivered,
  processInvoice,
  getInvoiceBySeller,
} = require('../controllers/sellingHistory');

const router = require('express').Router();

router.get('/:seller', getSellingHistory);
router.get('/singleOrder/:orderNumber', getSellingHistoryByOrderNumber);
router.get('/getInvoice/:seller', getInvoiceBySeller);
router.post('/processInvoice/:seller', processInvoice);
router.post('/create/:seller', createSellingHistory);
router.put('/toggleDelivered/:orderNumber', toggleDelivered);

module.exports = router;
