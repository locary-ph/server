const Merchant = require("../models/merchant");

async function getMerchantByShopRoute(req, res) {
  if (req.query.shopUrl) {
    const { shopUrl } = req.query;
    const merchant = await Merchant.findOne({ shopUrl });
    res.json(merchant);
  } else {
    res.status(400);
    throw new Error("No `shopurl` query parameter found");
  }
}

module.exports = { getMerchantByShopRoute };
