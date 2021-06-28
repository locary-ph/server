const express = require("express");

const products = require("./products");
const merchants = require("./merchants");

const router = express.Router();

router.use("/products", products);
router.use("/merchants", merchants);

module.exports = router;
