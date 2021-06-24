const express = require("express");

const router = express.Router();

const merchantController = require("../controllers/merchantController");

router.post("/login", merchantController.authMerchant);

module.exports = router;
