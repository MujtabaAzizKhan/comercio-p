const router = require('express').Router();
const {
  checkPartnerConnection,
  checkAcceptedPartner,
  addPartner,
  pendingPartners,
  acceptPartner,
  rejectPartner,
  withdrawRequest,
  displayPartners,
  pendingConnections,
  acceptConnection,
  rejectConnection,
} = require('../controllers/partner');

// These last two are post on purpose as they send user's own ID to exclude his own profile from coming up in the search
router.post('/checkPartnerConnection', checkPartnerConnection);
router.post('/checkAcceptedPartner', checkAcceptedPartner);

router.post('/addPartner', addPartner);
router.post('/pendingPartners', pendingPartners);
router.post('/acceptPartner', acceptPartner);
router.post('/rejectPartner', rejectPartner);
router.post('/withdrawRequest', withdrawRequest);
router.post('/displayPartners', displayPartners);
router.post('/pendingConnections', pendingConnections);
router.post('/acceptConnection', acceptConnection);
router.post('/rejectConnection', rejectConnection);

module.exports = router;
