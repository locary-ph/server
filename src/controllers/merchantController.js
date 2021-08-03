const Merchant = require("../models/merchant");
const Products = require("../models/product");

async function getShop(req, res) {
  if (req.query.route) {
    const { route } = req.query;
    const merchant = await Merchant.findOne({ shopUrl: route });
    res.json(merchant);
  } else {
    res.status(400);
    throw new Error("No `route` query parameter found");
  }
}

module.exports = { getShop };
