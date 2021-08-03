const express = require("express");

const router = express.Router();

const middlewares = require("../middlewares");
const productController = require("../controllers/productController");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.use(middlewares.authorize);
router.post("/", productController.createProduct);

module.exports = router;
