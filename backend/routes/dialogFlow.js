const {query} = require('../controllers/dialogFlow');
const bodyParser = require('body-parser');

const router = require('express').Router();

router.post('/query', query);

module.exports = router;
