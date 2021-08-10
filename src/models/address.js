/* eslint-disable */
const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CitySchema = new Schema({ name: String });

const DeliveryLocationSchema = new Schema({ name: String });

module.exports = mongoose.model("City", CitySchema);
module.exports = mongoose.model("Province", ProvinceSchema);
