const express = require('express');
const products = require("../data/products");

const router = express.Router();

router.get('/', (req, res) => {
  res.json(products);
});


router.get("/:id", (req, res) => {
  res.json(products.filter(p => p._id === req.params.id));
})

module.exports = router;
