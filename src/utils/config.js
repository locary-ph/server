require("dotenv").config();

const MONGODB_URI = process.env.NODE_ENV === "test" ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

const { IMAGEKIT_URL_ENDPOINT } = process.env;
const { IMAGEKIT_PUBLIC_KEY } = process.env;
const { IMAGEKIT_PRIVATE_KEY } = process.env;

module.exports = {
  MONGODB_URI,
  IMAGEKIT_URL_ENDPOINT,
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY
};
