const Merchant = require("../models/merchant");

const helper = require("../utils/helper");

// @desc  Fetch merchant information and merchant's prodcuts
// @route GET /api/v1/merchants?shop=shopRoute
async function getShop(req, res) {
  if (req.query.shop) {
    const { shop } = req.query;
    const merchant = await Merchant.findOne({ shopUrl: shop });

    const errorMessage = "No merchant found";
    helper.checkDocument(res, merchant, merchant, errorMessage);
  } else {
    res.status(400);
    throw new Error("Expected `shop` query parameter, received none");
  }
}

module.exports = { getShop };
