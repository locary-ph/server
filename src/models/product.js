const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ProductSchema = new Schema({
  merchantId: {
    type: ObjectId,
    ref: "Merchant",
    required: true
  },
  name: { type: String, required: true },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  description: String,
  thumbnailUrl: String,
  imageUrls: [{
    type: String,
    required: [true, "Upload atleast one image"]
  }],
  qty: {
    type: Number,
    required: true,
    min: 0
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
