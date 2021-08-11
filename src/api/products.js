const express = require("express");

const router = express.Router();

const middlewares = require("../middlewares");
const productController = require("../controllers/productController");

router.get("/:id", productController.getProductById);
router.use(middlewares.authorize);
router.delete("/:id", productController.deleteProductById);
router.get("/", productController.getProducts);
router.post("/", productController.createProduct);

module.exports = router;
