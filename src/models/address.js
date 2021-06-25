const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CitySchema = new Schema({
  name: String
});

const DeliveryLocationSchema = new Schema({
  name: String
});

module.exports = mongoose.model('City', CitySchema);
module.exports = mongoose.model('Province', ProvinceSchema);
