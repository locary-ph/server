const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const defaultOptions = {
  type: String,
  required: true,
};

const MerchantSchema = new Schema({
  deliveryAreas: [{
    location: String,
    fee: Number
  }], // key: location, value: fee to deliver to that location
  pickupAddress: String,
  email: defaultOptions,
  password: defaultOptions,
  shopName: defaultOptions,
  firstName: defaultOptions,
  lastName: defaultOptions,
  shopUrl: defaultOptions,
  mobileNumber: defaultOptions,
  shopLogo: String,

  shopDescription: String,
  faqs: [{
    question: String,
    answer: String
  }],
  paymentMethodId: {
    type: Schema.Types.ObjectId,
    ref: "PaymentMethod",
  },
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
