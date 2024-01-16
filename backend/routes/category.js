const router = require('express').Router();
const {
  createCategory,
  getSingleCategory,
  deleteCategory,
  updateCategory,
  listCategories,
} = require('../controllers/category');

router.get('/categories', listCategories);
router.get('/:categoryId', getSingleCategory);
router.post('/create', createCategory);
router.put('/:categoryId', updateCategory);
router.delete('/:categoryId', deleteCategory);

module.exports = router;

// router.get("/:categoryId")
// router.post("/create/:userId")
// router.put("/:categoryId/:userId")
// router.delete("/:categoryId/:userId")
