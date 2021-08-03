const express = require("express");

const router = express.Router();

const merchantController = require("../controllers/merchantController");

// GET /merchant?shopRoute=/sunt-est
router.get("/", merchantController.getMerchantByShopRoute);

module.exports = router;
