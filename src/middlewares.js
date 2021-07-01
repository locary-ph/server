const jwt = require("jsonwebtoken");
const Merchant = require("./models/merchant");

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack
  });
}

async function authorize(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const exclude = "-password -__v";
      req.user = await Merchant.findById(decoded._id).select(exclude);
      console.log("User: ", req.user);

      next();
    } catch (e) {
      console.error(e);
      throw new Error("Not authorized, invalis token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token found");
  }
}

module.exports = {
  notFound,
  errorHandler,
  authorize
};
