const ImageKit = require("imagekit");
const config = require("./utils/config.js");

const imagekit = new ImageKit({
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY
});

module.exports = imagekit;
