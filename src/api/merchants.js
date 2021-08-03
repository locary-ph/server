const express = require("express");

const router = express.Router();

const merchantController = require("../controllers/merchantController");

// GET /merchants/shop?shopRoute=sunt-est
router.get("/shop", merchantController.getShop);

module.exports = router;
