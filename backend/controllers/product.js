const {isValidObjectId} = require('mongoose');
const Category = require('../model/category');
const Product = require('../model/product');
const User = require('../model/user');
const {sendError} = require('../utils/helper');
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      avatar,
      categories,
      brand,
      barcodeNumber,
      description,
      quantity,
      price,
    } = req.body;

    const {producer} = req.params;

    //validating the userId
    if (!mongoose.Types.ObjectId.isValid(producer)) {
      return res.status(400).json({error: 'Invalid producer ID'});
    }

    //finding the user
    const findUser = await User.findOne({_id: producer, isProducer: true});
    if (!findUser) return sendError(res, 'Producer not found');

    const product = await Product.findOne({name});
    if (product) return sendError(res, 'This product already exists!');

    const newProduct = new Product({
      name,
      avatar,
      categories,
      brand,
      description,
      barcodeNumber,
      quantity,
      price,
      createdBy: producer,
    });

    if (!isValidObjectId(categories))
      return sendError(res, 'Invalid Category id');

    await newProduct.save();

    res.json({success: true, newProduct});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    let data = await Product.findById(req.params.productId);

    if (!data) return sendError(res, 'Product not found');

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const {userId, productId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid user ID'});
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({error: 'Invalid product ID'});
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({error: 'Product not found'});
    }

    if (product.createdBy.toString() !== userId) {
      return res.status(403).json({
        error: `Unauthorized: User ${userId} is not authorized to delete product ${product._id}`,
      });
    }

    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({error: 'Product not found'});
    }

    return res.json({message: 'Product deleted successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {userId, productId} = req.params;
    const update = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid user ID'});
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({error: 'Invalid product ID'});
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({error: 'Product not found'});
    }

    if (product.createdBy.toString() !== userId) {
      return res.status(403).json({
        error: `Unauthorized: User ${userId} is not authorized to update product ${product._id}`,
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, update, {
      new: true,
    });

    // const existingProduct = await Product.findOne({name: update.name});
    // if (existingProduct) return sendError(res, 'This product already exists!');

    await updatedProduct.save();

    res.json({
      success: true,
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.findProduct = async (req, res) => {
  try {
    const {barcodeNumber} = req.body;
    // console.log(barcodeNumber);

    if (!barcodeNumber) {
      return res.status(400).json({error: 'Barcode number is required.'});
    }

    const product = await Product.findOne({barcodeNumber});

    // if (!product) {
    //   return res.status(404).json({error: 'Product not found.'});
    // }

    // If found, you can send the product details in the response
    res.status(200).json(product);
  } catch (error) {
    console.error('Error finding product:', error);
    res.status(500).json({error: 'Internal server error.'});
  }
};

exports.findProductDistributorHome = async (req, res) => {
  try {
    const {barcodeNumber, userId} = req.body;
    console.log(barcodeNumber);

    // if (!barcodeNumber) {
    //   return res.status(400).json({error: 'Barcode number is required.'});
    // }

    const product = await Product.findOne({barcodeNumber});

    if (product) {
      console.log('Yes is product');
      const user = await User.findById(userId);

      // console.log('user.connections:', user.connections);
      // console.log('product.createdBy:', product.createdBy);
      const createdByStringId = product.createdBy.toString();
      // console.log(createdByStringId);
      // Basically, product.createdBy returns an Object type value. We extract just the id from it for our purposes.

      const isConnected = user.connections.find(
        connection =>
          connection.connectionID === createdByStringId &&
          connection.status === 'accepted',
      );
      if (product.isPublished == true) {
        console.log('Yes is Published');
        if (isConnected) {
          console.log('Yes connected');
          res.status(200).json(product);
        }
      }
    }
  } catch (error) {
    console.error('Error finding product:', error);
    res.status(500).json({error: 'Internal server error.'});
  }
};

exports.listByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const userId = req.params.userId;
    // console.log(userId + 'DATABASE WALA');

    let data = await Product.find({
      categories: categoryId,
      createdBy: userId,
      isPublished: true,
    });

    // if (!data || data.length === 0) {
    //   return res.status(405).json({
    //     error: 'Products not found for the specified category and user',
    //   });
    // }
    // console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.listByCategory2 = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const userId = req.params.userId;
    // console.log(userId + 'DATABASE WALA');

    let data = await Product.find({
      categories: categoryId,
      createdBy: userId,
      // isPublished: true,
    });

    // if (!data || data.length === 0) {
    //   return res.status(405).json({
    //     error: 'Products not found for the specified category and user',
    //   });
    // }
    // console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.setPublished = async (req, res) => {
  const productId = req.params.productId;
  // const productPublished = req.params.productPublished;
  // console.log(productId);
  // console.log(productPublished);

  try {
    // Find the product by ID and toggle the isPublished property
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({error: 'Product not found'});
    }

    // Toggle the isPublished property
    product.isPublished = !product.isPublished;

    // Save the updated product
    await product.save();
    res.status(200).json({success: 'Product updated'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};


exports.isBarcodeUnique = async (req, res) => {
  try {
    const {barcodeNumber} = req.body;
    // console.log(barcodeNumber);

    const existingProduct = await Product.findOne({barcodeNumber});

    // If the product with the given barcode exists, return false; otherwise, return true
    return res.json({isUnique: !existingProduct});
  } catch (error) {
    console.error('Error checking barcode uniqueness:', error);
    return res.status(500).json({error: 'Internal server error'});
  }
};


exports.findByBrand = async (req, res) => {
  try {
    const userId = req.params.userId;
    const brands = req.body.brand;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid User ID'});
    }

    const findUser = await User.findById(userId);
    if (!findUser) return sendError(res, 'User not found');

    // Fetch the connections for the current user where the status is 'accepted'
    const connections = findUser.connections.filter(
      connection => connection.status === 'accepted',
    );

    // Extract the connectionsID from each connection
    const connectionsID = connections.map(
      connection => connection.connectionID,
    );

    let data = await Product.find({
      brand: {$in: brands},
      isPublished: true,
      createdBy: {$in: connectionsID}, // Add this line
    });

    if (!data || data.length === 0) {
      return res.status(405).json({
        error: 'Products not found for the specified brand',
      });
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};
