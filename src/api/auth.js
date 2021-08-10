const express = require("express");
const Merchant = require("../models/merchant");
const generateToken = require("../utils/generateToken");

const router = express.Router();

// @desc  Auth merchant and get token
// @route POST /api/v1/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Merchant.findOne({ email });

  if (user && (await user.isCorrectPassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      shopName: user.shopName,
      shopUrl: user.shopUrl,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc  Register a new merchant
// @route POST /api/v1/auth/signup
router.post("/signup", async (req, res) => {
  const userExists = await Merchant.findOne({ email: req.body.email });
  if (userExists) {
    res.status(400);
    throw new Error("Account already exists");
  }

  const user = await Merchant.create({ ...req.body });

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      shopName: user.shopName,
      shopUrl: user.shopUrl,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user credentials");
  }
});

module.exports = router;
