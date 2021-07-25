const express = require("express");
const imagekit = require("../imagekit");

const products = require("./products");
const merchants = require("./merchants");
const auth = require("./auth");
const order = require("./order");

const middlewares = require("../middlewares");

const router = express.Router();

router.get("/imagekit/auth", (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.send(authParams);
});

router.use("/auth", auth);
router.use(middlewares.authorize);
router.use("/products", products);
router.use("/merchants", merchants);
router.use("/orders", order);

module.exports = router;
