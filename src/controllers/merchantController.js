const Merchant = require("../models/merchant");
const PaymentMethod = require("../models/paymentMethod");

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

// @desc  Add/edit payment methods
// @route post /api/v1/merchants/paymentMethod/:merchantId
async function updatePaymentMethods(req, res) {
  const { merchantId } = req.params;
  const {
    bankTransfer, eWallet, cashOnPickup, cashOnDelivery
  } = req.body;

  // TODO: validate and sanitize fields from req.body

  let paymentMethods = await PaymentMethod.findByIdAndUpdate(merchantId, {
    bankTransfer,
    eWallet,
    cashOnPickup,
    cashOnDelivery
  }, { new: true });

  // create new document if first time updating this setting
  if (!paymentMethods) {
    paymentMethods = new PaymentMethod({
      merchantId,
      bankTransfer,
      eWallet,
      cashOnPickup,
      cashOnDelivery
    });

    await paymentMethods.save();
  }

  res.json(paymentMethods);
}

module.exports = {
  getShop,
  updatePersonalDetails,
  updateShop,
  updatePaymentMethods
};
