const mongoose = require("mongoose");
const config = require("../utils/config");

let mongoDB;

async function connectDB() {
  try {
    const { connection } = await mongoose.connect(config.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    console.log(`MongoDB connected: ${connection.host}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
