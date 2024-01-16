const router = require("express").Router();
const {
  payment,

} = require("../controllers/payment.js");

// const { isResetTokenValid } = require("../middleware/user");
// const { validate, validateUser } = require("../middleware/validator");

router.post("/",  payment);


module.exports = router;
