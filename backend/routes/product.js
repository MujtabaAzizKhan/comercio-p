const {
  createProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  findProduct,
  findProductDistributorHome,
  listByCategory,
  listByCategory2,
  setPublished,
  isBarcodeUnique,
  findByBrand,
  // productPicture,
} = require('../controllers/product');
const router = require('express').Router();

router.get('/:productId', getSingleProduct);

router.post('/create/:producer', createProduct);
router.put('/:userId/:productId', updateProduct);
router.delete('/:userId/:productId', deleteProduct);
router.post('/findProduct', findProduct);
router.post('/findProductDistributorHome', findProductDistributorHome);

router.get('/listByCat/ispublished/:categoryId/:userId', listByCategory);
router.get('/listByCat/:categoryId/:userId', listByCategory2);

router.get('/setPublished/:productId/', setPublished);
router.post('/isBarcodeUnique', isBarcodeUnique);

router.post('/getByBrand/:userId', findByBrand);

// router.put('/productPicture', productPicture);

module.exports = router;

// router.get("/:productId")
// router.post("/create/:userId")
// router.put("/:productId/:userId")
// router.delete("/:productId/:userId")
