const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: "30d" });
const generateResetToken = (id) => jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: "15m" });

module.exports = {
  generateToken,
  generateResetToken
};
