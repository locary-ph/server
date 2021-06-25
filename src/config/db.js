const mongoose = require('mongoose');

async function connectDB() {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI, {
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
