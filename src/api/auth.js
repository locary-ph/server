const express = require("express");
const Merchant = require("../models/merchant");
const generateToken = require("../utils/generateToken");

const router = express.Router();

// @desc  Auth merchant and get token
// @route POST /api/v1/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Merchant.findOne({ email }).select("-__v -createdAt -updatedAt");

  if (user && (await user.isCorrectPassword(password))) {
    // https://stackoverflow.com/a/64306956
    delete user._doc.password;

    res.json({
      user,
      token: generateToken.generateToken(user._id),
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
      token: generateToken.generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user credentials");
  }
});

// @desc  Validate password reset link
// @route GET /api/v1/auth/validate-reset-token
router.get("/validate-reset-token/:resetToken", async (req, res) => {
  const { resetToken } = req.params;
  const user = await Merchant.findOne({ resetToken }).select("_id resetToken");

  if (!user || (user.resetToken !== resetToken)) {
    res.status(400);
    throw new Error("Invalid reset password link");
  }

  res.status(201).json({ user });
});

// @desc  Create a reset token
// @route POST /api/v1/auth/generate-reset-link
router.post("/generate-reset-link", async (req, res) => {
  const user = await Merchant.findOne({ email: req.body.email });

  if (!user) {
    res.status(400);
    throw new Error("Account cannot be found!");
  }

  try {
    const resetToken = await generateToken.generateResetToken(user._id);
    user.resetToken = resetToken;
    await user.save();
    const link = `http://localhost:3000/auth/forgot-password/${resetToken}`;
    // const link = `http://dashboard.locary.ph/auth/forgot-password/${resetToken}`;
    console.log(link);
  } catch (err) {
    throw new Error(err.message);
  }

  res.status(201).json({ message: "success" });
});

module.exports = router;
