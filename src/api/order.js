const express = require("express");

const router = express.Router();

const middlewares = require("../middlewares");
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);
router.use(middlewares.authorize);
router.get("/", orderController.getOrders);
router.get("/recent", orderController.getRecentOrders);
router.get("/:id", orderController.getOrderById);

module.exports = router;
