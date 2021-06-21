const express = require("express");
const Product = require("../models/product");

const router = express.Router();

// @desc  Fetch all products of a merchant
// @route GET /api/v1/products
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({});

    res.json(products);
  } catch (err) {
    next(err);
  }
});

// @desc  Fetch single product
// @route GET /api/v1/products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
