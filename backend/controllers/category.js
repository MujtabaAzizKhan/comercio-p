const Categories = require('../model/category');
const {sendError} = require('../utils/helper');
const {isValidObjectId} = require('mongoose');

exports.createCategory = async (req, res) => {
  try {
    const {name} = req.body;
    const categories = await Categories.findOne({name});
    if (categories) return sendError(res, 'This category already exists!');

    const newCategory = new Categories({
      name,
    });

    await newCategory.save();

    res.json({
      success: true,
      categories: {
        name: newCategory.name,
        id: newCategory._id,
      },
    });
  } catch (error) {
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.getSingleCategory = async (req, res) => {
  let data = await Categories.findById(req.params.categoryId);
  if (!data) return sendError(res, 'Category not found');
  res.status(200).json(data);
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Find the category by ID and delete it
    const deletedCategory = await Categories.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({error: 'Category not found'});
    }

    return res.json({message: 'Category deleted successfully'});
  } catch (error) {
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.updateCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const update = req.body;

  const updatedCategory = await Categories.findByIdAndUpdate(
    categoryId,
    update,
  );

  if (!isValidObjectId(categoryId))
    return sendError(res, 'Invalid Category id');

  await updatedCategory.save();

  res.json({
    success: true,
    categories: {
      name: updatedCategory.name,
      id: updatedCategory._id,
    },
  });

  // res.json(updatedCategory);
};

exports.listCategories = async (req, res) => {
  try {
    const categories = await Categories.find();

    if (categories.length === 0) {
      return res.status(404).json({message: 'No categories are present'});
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};
