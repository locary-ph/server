/* eslint-disable */
const mongoose = require("mongoose");
const colors = require("colors");
const Merchant = require("./models/merchant");
const Product = require("./models/product");
const Order = require("./models/order");

const products = require("./data/products");
const users = require("./data/merchants");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

const importData = async () => {
  try {
    await Merchant.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const merchants = await Merchant.insertMany(users);

    // 0-3 merchant1
    // 4-6 merchant2
    // 7-9 merchant1
    // no product merchant1
    for (let i = 0; i < 4; i++) {
      products[i].merchantId = merchants[0]._id;
    }
    for (let i = 4; i < 7; i++) {
      products[i].merchantId = merchants[0]._id;
    }
    for (let i = 7; i <= 9; i++) {
      products[i].merchantId = merchants[0]._id;
    }

    await Product.insertMany(products);

    console.log("Data imported!".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
    console.log(`${err}`.red.inverse);
    process.exit(1);
  }
};

importData();
