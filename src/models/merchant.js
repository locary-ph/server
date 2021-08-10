const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const defaultOptions = {
  type: String,
  required: true,
};

const MerchantSchema = new Schema({
  deliveryAreas: {
    type: Map,
    of: [String],
    default: {}
  }, // key: province, value: cities
  email: defaultOptions,
  password: defaultOptions,
  shopName: defaultOptions,
  firstName: defaultOptions,
  lastName: defaultOptions,
  shopUrl: defaultOptions
}, { timestamps: true });

MerchantSchema.methods.isCorrectPassword = async function isCorrectPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

MerchantSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Merchant", MerchantSchema);
