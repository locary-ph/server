const express = require("express");

const router = express.Router();

const merchantController = require("../controllers/merchantController");

// GET /merchants?shop=sunt-est
router.get("/", merchantController.getShop);

module.exports = router;
