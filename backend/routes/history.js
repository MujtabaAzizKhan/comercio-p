const {
  getHistory,
  createHistory,
  updateHistory,
  deleteHistory,
  getHistoryByOrderNumber,
  processInvoice,
  getInvoiceByBuyer,
} = require('../controllers/history');

const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const router = require('express').Router();

router.get('/:userId', getHistory);
router.get('/singleOrder/:orderNumber', getHistoryByOrderNumber);
router.get('/getInvoice/:buyer', getInvoiceByBuyer);
router.post('/create/:user', createHistory);
router.post('/processInvoice/:buyer', upload.single('file'), processInvoice);
router.put('/update/:userId', updateHistory);
router.delete('/delete/:userId', deleteHistory);

module.exports = router;
