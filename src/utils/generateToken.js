const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: "30d" });

module.exports = generateToken;
