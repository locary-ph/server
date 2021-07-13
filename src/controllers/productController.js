const Product = require("../models/product");

// TODO(#2): Write tests for product controller
// TODO: Implement product creation
//    POST /api/v1/products

// @desc  Fetch all products of a merchant
// @route GET /api/v1/products
async function getProducts(req, res, next) {
  const products = await Product.find({ merchantId: req.user._id });

  res.json(products);
}

// @desc  Fetch single product
// @route GET /api/v1/products/:id
async function getProductById(req, res, next) {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
}

module.exports = {
  getProducts,
  getProductById
};
