const express = require("express");

const router = express.Router();

const merchantController = require("../controllers/merchantController");
const middleware = require("../middlewares");

// GET /merchants?shop=sunt-est
router.get("/", merchantController.getShop);
router.get("/paymentMethod/:id", merchantController.getPaymentMethod);

router.use(middleware.authorize);
router.post("/paymentMethod", merchantController.addPaymentMethod);
router.put("/personal", merchantController.updatePersonalDetails);
router.put("/shop", merchantController.updateShop);

module.exports = router;
