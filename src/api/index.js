const express = require("express");

const products = require("./products");
const merchants = require("./merchants");
const auth = require("./auth");

const middlewares = require("../middlewares");

const router = express.Router();

router.use("/auth", auth);
router.use(middlewares.authorize);
router.use("/products", products);
router.use("/merchants", merchants);

module.exports = router;
