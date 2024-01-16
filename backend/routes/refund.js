const {returnRequest, getRequests} = require('../controllers/refund');
const router = require('express').Router();

router.post('/returnRequest', returnRequest);
router.get('/getRequests/:brandName', getRequests);

module.exports = router;
