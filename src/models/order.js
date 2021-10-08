const mongoose = require("mongoose");

const Product = require("./product");

const { Schema } = mongoose;

const BuyerSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const OrderSchema = new Schema(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
    buyer: {
      type: BuyerSchema,
      required: true,
    },
    items: [
      {
        product: {
          type: Product.schema,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    deliveryOption: {
      type: String,
      enum: ["PICKUP", "DELIVERY"],
    },
    paymentOption: {
      type: String,
      enum: ["EWALLET", "BANK", "PICKUP", "DELIVERY"],
    },
    orderAmount: {
      type: String,
      required: true,
    },
    quantity: Number,
    deliveryAddress: {
      line1: {
        type: String,
        required: true,
      },
      line2: String,
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      zipcode: String,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "UNPAID",
        "PAID",
        "ORDER PLACED",
        "APPROVED",
        "REJECT",
        "TO DELIVER",
        "ON THE WAY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "ORDER PLACED"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
