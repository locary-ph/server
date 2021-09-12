const express = require("express");

const router = express.Router();

const middlewares = require("../middlewares");
const productController = require("../controllers/productController");

router.get("/:merchantId/:productName", productController.getProductByName);
router.get("/:id", productController.getProductById);
router.use(middlewares.authorize);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProductById);
router.get("/", productController.getProducts);
router.post("/", productController.createProduct);

module.exports = router;
