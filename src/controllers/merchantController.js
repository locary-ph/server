const Merchant = require("../models/merchant");
const Product = require("../models/product");

// @desc  Fetch merchant information and merchant's prodcuts
// @route GET /api/v1/merchants/shop?route=shopRoute
async function getShop(req, res) {
  if (req.query.route) {
    const { route } = req.query;
    const merchant = await Merchant.findOne({ shopUrl: route });

    if (merchant) {
      const products = await Product.find({ merchantId: merchant._id });
      res.json([merchant, products]);
    } else {
      res.status(404);
      throw new Error("No merchant found");
    }
  } else {
    res.status(400);
    throw new Error("Expected `route` parameter, received none");
  }
}

module.exports = { getShop };
