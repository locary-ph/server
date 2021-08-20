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

// @desc  Edit merchant account info
// @route PUT /api/v1/merchants/account
async function updatePersonalDetails(req, res) {
  const {
    firstName, lastName, email, mobileNumber, shopLogo
  } = req.body;

  const options = {
    new: true,
    runValidators: true,
    // return only updated fields
    select: "firstName lastName email mobileNumber shopLogo",
  };

  // return updated merchant
  const merchant = await Merchant.findByIdAndUpdate(req.user._id, {
    firstName,
    lastName,
    email,
    mobileNumber,
    shopLogo
  }, options);

  helper.checkDocument(res, merchant, merchant, "No merchant found");
}

// @desc  Edit merchant shop information
// @route PUT /api/v1/merchants/shop
async function updateShop(req, res) {
  const { shopName, shopDescription, faqs } = req.body;

  const options = {
    new: true,
    runValidators: true,
    // return only updated fields
    select: "shopName shopDescription faqs",
  };

  // return updated merchant
  const merchant = await Merchant.findByIdAndUpdate(req.user._id, {
    shopName,
    shopDescription,
    faqs
  }, options);

  helper.checkDocument(res, merchant, merchant, "No merchant found");
}

module.exports = {
  getShop,
  updatePersonalDetails,
  updateShop
};
