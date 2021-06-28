const Merchant = require("../models/merchant");
const generateToken = require("../utils/generateToken");

// @desc  Auth merchant and get token
// @route POST /api/v1/merchants/login
async function authMerchant(req, res, next) {
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
}

module.exports = { authMerchant };
