const Merchant = require("../models/merchant");
const PaymentMethod = require("../models/paymentMethod");
const Product = require("../models/product");

const bcrypt = require("bcryptjs");
const helper = require("../utils/helper");

// @desc  Fetch merchant information and merchant's prodcuts
// @route GET /api/v1/merchants?shop=shopRoute
async function getShop(req, res) {
  if (req.query.shop) {
    const { shop } = req.query;
    const merchant = await Merchant
      .findOne({ shopUrl: shop })
      .populate("paymentMethodId", "-_id -__v -createdAt -updatedAt");

    if (merchant) {
      const products = await Product.find({ merchantId: merchant._id });
      res.json({
        user: merchant,
        products,
      });
    } else {
      res.status(404);
      throw new Error("Shop not found");
    }
  } else {
    res.status(400);
    throw new Error("Expected `shop` query parameter, received none");
  }
}

// @desc  Edit merchant account info
// @route PUT /api/v1/merchants/merchant-info
async function updatePersonalDetails(req, res) {
  const { firstName, lastName, email, mobileNumber, shopLogo } = req.body;

  const options = {
    new: true,
    runValidators: true,
    // return only updated fields
    select: "firstName lastName email mobileNumber shopLogo",
  };

  // return updated merchant
  const merchant = await Merchant.findByIdAndUpdate(
    req.user._id,
    {
      firstName,
      lastName,
      email,
      mobileNumber,
      shopLogo,
    },
    options
  );

  helper.checkDocument(res, merchant, merchant, "No merchant found");
}

// @desc  Update merchan delivery options
// @route PUT /api/v1/merchants/delivery
async function updateDeliverOptions(req, res) {
  const { deliveryAreas, pickupAddress } = req.body;

  const options = {
    new: true,
    runValidators: true,
    // return only updated fields
    select: "deliveryAreas pickupAddress",
  };

  // return updated merchant
  const merchant = await Merchant.findByIdAndUpdate(req.user._id, {
    deliveryAreas,
    pickupAddress
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
  const merchant = await Merchant.findByIdAndUpdate(
    req.user._id,
    {
      shopName,
      shopDescription,
      faqs,
    },
    options
  );

  helper.checkDocument(res, merchant, merchant, "No merchant found");
}

// @desc  Change merchant password
// @route POST /api/v1/merchants/change-password
async function changePassword(req, res) {
  const { currentPass, newPass } = req.body;
  let merchant = await Merchant.findById(req.user._id);
  if (merchant && (await merchant.isCorrectPassword(currentPass))) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPass, salt);
    merchant = await Merchant.findByIdAndUpdate(req.user._id, { password });

    // https://stackoverflow.com/a/64306956
    delete merchant._doc.password;
  } else {
    res.status(401);
    throw new Error("Incorrect current password");
  }
  helper.checkDocument(res, merchant, merchant, "Account cannot be found");
}

// @desc  Add/update payment method
// @route POST /api/v1/merchants/paymentMethod
async function addPaymentMethod(req, res) {
  const merchant = await Merchant.findById(req.user._id);
  const { paymentMethodId } = merchant;

  // TODO(#28): validate and sanitize fields from req.body
  const { bankTransfer, eWallet, cashOnPickup, cashOnDelivery } = req.body;

  let paymentMethod;
  if (paymentMethodId) {
    paymentMethod = await PaymentMethod.findByIdAndUpdate(
      paymentMethodId,
      {
        bankTransfer,
        eWallet,
        cashOnPickup,
        cashOnDelivery,
      },
      { new: true }
    );
  } else {
    paymentMethod = await PaymentMethod.create({
      bankTransfer,
      eWallet,
      cashOnPickup,
      cashOnDelivery,
    });
    // relate logged in user to this payment method
    merchant.paymentMethodId = paymentMethod._id;
    await merchant.save();
  }

  res.json(paymentMethod);
}

// @desc  Get payment methods
// @route GET /api/v1/merchants/paymentMethod/:id
async function getPaymentMethod(req, res) {
  const { id } = req.params;
  const paymentMethod = await PaymentMethod.findById(id)
    .select("-__v -updatedAt -createdAt")
    .lean();

  helper.checkDocument(
    res,
    paymentMethod,
    paymentMethod,
    "No payment method set"
  );
}

module.exports = {
  getShop,
  updatePersonalDetails,
  updateShop,
  addPaymentMethod,
  getPaymentMethod,
  changePassword,
  updateDeliverOptions
};
