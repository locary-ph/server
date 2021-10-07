const Order = require("../models/order");

// TODO(#1): Write tests for order controller

// @desc Create new order
// @route POST /api/v1/orders
async function createOrder(req, res) {
  const {
    buyer,
    items,
    deliveryOption,
    paymentOption,
    orderAmount,
    quantity,
    deliveryAddress,
  } = req.body;

  if (items && items.length === 0) {
    res.status(400);
    throw new Error("No items in cart");
  } else {
    const order = new Order({
      merchantId: req.user._id,
      buyer,
      items, // TODO(#3): refactor to only include relevant fields
      deliveryOption,
      paymentOption,
      orderAmount,
      quantity,
      deliveryAddress,
    });

    const createdOrder = await order.save();

    res.status(201);
    res.json(createdOrder);
  }
}

// @desc Fetch all orders of a merchant
// @route GET /api/v1/orders
async function getOrders(req, res) {
  const orders = await Order.find({ merchantId: req.user._id });

  res.json(orders);
}

// @desc Fetch 5 most recent orders
// @route GET /api/v1/orders/recent
async function getRecentOrders(req, res) {
  const orders = await Order.find(
    { merchantId: req.user._id },
    "buyer.firstName buyer.lastName items.product orderAmount orderStatus"
  );

  res.json(orders);
}

// @desc Fetch a single order
// @route GET /api/v1/orders/:id
async function getOrderById(req, res) {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order details not found");
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getRecentOrders,
};
