const Product = require('../model/product');
const User = require('../model/user');
const Cart = require('../model/cart');
const {sendError} = require('../utils/helper');
const mongoose = require('mongoose');
const user = require('../model/user');

exports.createCart = async (req, res) => {
  try {
    const {user} = req.params;
    const {products} = req.body;

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({error: 'Invalid User ID'});
    }

    const findUser = await User.findById(user);
    if (!findUser) return sendError(res, 'User not found');

    const findCart = await Cart.findOne({user: user});
    if (findCart) return sendError(res, 'Cart already exists');

    if (findUser.isProducer == true)
      return sendError(res, 'Producer cannot create a cart');
    //This check for unique products in the cart to avoid duplicates and get the price of the products
    const productIds = products.map(product => product.product);
    const findProducts = await Product.find({_id: {$in: productIds}});

    const uniqueProducts = Array.from(
      new Set(products.map(product => product.product)),
    ).map(id => {
      const product = findProducts.find(
        product => product._id.toString() === id.toString(),
      );
      const quantity = products.find(
        product => product.product.toString() === id.toString(),
      ).quantity;
      return {
        product: product._id,
        quantity: quantity,
        price: product.price,
      };
    });

    const totalPrice = uniqueProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );

    const newCart = new Cart({
      user,
      products: uniqueProducts,
      totalPrice,
    });

    await newCart.save();

    res.json(newCart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.getCart = async (req, res) => {
  try {
    const {userId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid User ID'});
    }

    const findUser = await User.findById(userId);
    if (!findUser) return sendError(res, 'User not found');

    const findCart = await Cart.find({user: userId})
      .populate('products.product')
      .exec();
    if (!findCart) return sendError(res, 'Cart not found');

    res.json(findCart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

// exports.updateCart = async (req, res) => {
//   try {
//     const {userId} = req.params;
//     const {products} = req.body;

//     // Validate that cartId is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({error: 'Invalid user ID'});
//     }

//     const findUser = await User.findById(userId);
//     if (!findUser) return sendError(res, 'User not found');

//     const cart = await Cart.findOne({user: userId});
//     if (!cart) {
//       return res.status(404).json({error: 'Cart not found'});
//     }

//     //This check for unique products in the cart to avoid duplicates and get the price of the products
// const productIds = products.map(product => product.product);
// const findProducts = await Product.find({_id: {$in: productIds}});

// const uniqueProducts = Array.from(
//   new Set(products.map(product => product.product)),
// ).map(id => {
//   const product = findProducts.find(
//     product => product._id.toString() === id.toString(),
//   );
//   const quantity = products.find(
//     product => product.product.toString() === id.toString(),
//   ).quantity;
//   return {
//     product: product._id,
//     quantity: quantity,
//     price: product.price,
//   };
// });

//     const totalPrice = uniqueProducts.reduce(
//       (total, product) => total + product.price * product.quantity,
//       0,
//     );

//     const updatedCart = await Cart.findOneAndUpdate(
//       {user: userId},
//       {products: uniqueProducts, totalPrice},
//       {new: true},
//     );

//     await updatedCart.save();

//     res.json(updatedCart);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({error: 'Internal server error'});
//   }
// };

exports.updateCart = async (req, res) => {
  try {
    const {userId} = req.params;
    const {products} = req.body;

    // Validate that cartId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid user ID'});
    }

    const findUser = await User.findById(userId);
    if (!findUser) return sendError(res, 'User not found');

    const cart = await Cart.findOne({user: userId});
    if (!cart) {
      return res.status(404).json({error: 'Cart not found'});
    }

    // these are the products that are already in the cart
    const existingProducts = cart.products;

    // This gets the price of the products
    const productIds = products.map(product => product.product);
    const findProducts = await Product.find({_id: {$in: productIds}});

    const updatedProducts = products.map(product => {
      const dbProduct = findProducts.find(
        p => p._id.toString() === product.product.toString(),
      );
      return {
        ...product,
        price: dbProduct ? dbProduct.price : 0,
      };
    });
    //this checks for the duplicate products in the cart and updates the quantity

    const newProducts = updatedProducts.reduce((acc, product) => {
      const existingProduct = existingProducts.find(
        p => p.product.toString() === product.product.toString(),
      );
      if (existingProduct) {
        existingProduct.quantity = product.quantity;
        return acc;
      } else {
        return acc.concat(product);
      }
    }, []);

    const mergedProducts = [...existingProducts, ...newProducts];

    const totalPrice = mergedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );

    const updatedCart = await Cart.findOneAndUpdate(
      {user: userId},
      {products: mergedProducts, totalPrice},
      {new: true},
    );

    await updatedCart.save();

    res.json(updatedCart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const {userId} = req.params;

    // Validate that user id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid user ID'});
    }

    const findUser = await User.findById(userId);
    if (!findUser) return sendError(res, 'User not found');

    const cart = await Cart.findOne({user: userId});
    if (!cart) {
      return res.status(404).json({error: 'Cart not found'});
    }

    const deletedCart = await Cart.findOneAndDelete({user: userId});
    if (!deletedCart) {
      return res.status(404).json({error: 'Cart not found'});
    }

    return res.json({message: 'Cart deleted successfully'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};
