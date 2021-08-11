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
  console.log(err);
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
  }

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack
  });
}

async function authorize(req, res, next) {
  // the request is for GET /products and req came from storefront
  // this allows public requests, we should find a better solution for this. (TODO)
  if (
    (req.baseUrl + req.path).includes("/api/v1/products")
    && req.query.merchantId
    && req.method === "GET"
  ) {
    // skip authorization
    return next();
  }

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const exclude = "-password -__v";
      req.user = await Merchant.findById(decoded._id).select(exclude);
    } catch (e) {
      console.error(e);
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token found");
  }

  return next();
}

module.exports = {
  notFound,
  errorHandler,
  authorize
};
