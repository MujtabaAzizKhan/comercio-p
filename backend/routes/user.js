const router = require('express').Router();
const {
  createUser,
  signin,
  verifyEmail,
  forgotPassword,
  resetPassword,
  profile,
  profilePicture,
  updateIsProducer,
  distributors,
  producers,
  checkConnection,
  checkAcceptedConnection,
  addConnection,
  pendingConnections,
  acceptConnection,
  rejectConnection,
  getProductsByProducer,
} = require('../controllers/user');
const {isResetTokenValid} = require('../middleware/user');
const {validate, validateUser} = require('../middleware/validator');

router.post('/create', validateUser, validate, createUser);
router.post('/signin', signin);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', isResetTokenValid, resetPassword);
router.put('/profile', profile);
router.put('/profilePicture', profilePicture); //Profile Pic
router.put('/:userId', updateIsProducer);

router.post('/distributors', distributors);
router.post('/producers', producers);
// These last two are post on purpose as they send user's own ID to exclude his own profile from coming up in the search
router.post('/checkConnection', checkConnection);
router.post('/checkAcceptedConnection', checkAcceptedConnection);

router.post('/addConnection', addConnection);
router.post('/pendingConnections', pendingConnections);
router.post('/acceptConnection', acceptConnection);
router.post('/rejectConnection', rejectConnection);
router.get('/products-by-producer', getProductsByProducer);

module.exports = router;
