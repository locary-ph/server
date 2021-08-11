const Product = require("../models/product");
const helper = require("../utils/helper");

// TODO(#2): Write tests for product controller

// @desc  Fetch all products of a merchant
// @route GET /api/v1/products
async function getProducts(req, res) {
  const products = await Product.find({ merchantId: req.user._id });

  res.json(products);
}

// @desc  Fetch all products of a merchant
// @route POST /api/v1/products
async function createProduct(req, res) {
  const {
    imageUrls,
    name,
    price,
    description,
    thumbnailUrl,
    qty
  } = req.body;

  const productExists = await Product.find({ name });
  if (productExists.length) {
    res.status(409);
    throw new Error("Product already exists");
  }

  const product = new Product({
    merchantId: req.user._id,
    imageUrls,
    name,
    price,
    description,
    thumbnailUrl,
    qty
  });

  const createdProduct = await product.save();

  res.status(201);
  res.json(createdProduct);
}

// @desc  Fetch single product
// @route GET /api/v1/products/:id
async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);

  helper.checkDocument(res, product, product);
}

// @desc  Delete single product
// @route DELETE /api/v1/products/:id
async function deleteProductById(req, res) {
  const product = await Product.findByIdAndRemove(req.params.id);

  helper.checkDocument(res, product, { message: `${product.name} deleted!` });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProductById
};
