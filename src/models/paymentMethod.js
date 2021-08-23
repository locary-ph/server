const mongoose = require("mongoose");

const { Schema } = mongoose;

const BankTransferSchema = new Schema({
  bankName: String,
  accountNumber: String,
  accountName: String,
  instructions: String,
});

const EWalletSchema = new Schema({
  walletName: String,
  accountName: String,
  accountNumber: String,
});

const PaymentMethodSchema = new Schema({
  merchantId: {
    type: Schema.Types.ObjectId,
    ref: "Merchant",
    required: true
  },
  bankTransfer: BankTransferSchema,
  eWallet: EWalletSchema,
  // values here are the instructions given to the customer/buyer
  cashOnPickup: String,
  cashOnDelivery: String
}, { timestamps: true });

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
