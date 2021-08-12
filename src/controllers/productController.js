const Product = require("../models/product");
const helper = require("../utils/helper");

// TODO(#2): Write tests for product controller

// @desc  Fetch all products of a merchant
// @route GET /api/v1/products or /api/v1/products?merchantId=x909sampleIdx909
async function getProducts(req, res) {
  // get the logged in user's id: request from the dashbord
  // OR
  // the queried id: req from storefront
  const merchantId = req.query.merchantId || req.user._id;

  const products = await Product.find({ merchantId });

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

// @desc  Edit a product
// @route PUT /api/v1/products/:id
async function updateProduct(req, res) {
  if (req.body.product) {
    const { id } = req.params;
    const {
      name,
      price,
      description,
      thumbnailUrl,
      qty
    } = req.body.product;

    const options = {
      new: true,
      runValidators: true
    };
    console.log(req.body.product);

    // return updated product
    const product = await Product.findByIdAndUpdate(id, {
      name,
      price,
      description,
      thumbnailUrl,
      qty,
    }, options);

    helper.checkDocument(res, product, product);
  } else {
    res.status(422);
    throw new Error("Cannot process entity");
  }
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
  deleteProductById,
  updateProduct
};
