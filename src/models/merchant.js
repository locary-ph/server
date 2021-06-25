const mongoose = require("mongoose");

const { Schema } = mongoose;

const defaultOptions = {
  type: String,
  required: true,
};

const MerchantSchema = new Schema({
  deliveryAreas: { type: Map, of: [String], default: {} }, // key: province, value: cities
  email: defaultOptions,
  password: defaultOptions,
  shopName: defaultOptions,
  firstName: defaultOptions,
  lastName: defaultOptions,
  shopUrl: defaultOptions
}, { timestamps: true });

module.exports = mongoose.model("Merchant", MerchantSchema);
