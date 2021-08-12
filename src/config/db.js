const mongoose = require("mongoose");
const config = require("../utils/config");

async function connectDB() {
  try {
    const { connection } = await mongoose.connect(config.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    });

    console.log(`MongoDB connected: ${connection.host}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
