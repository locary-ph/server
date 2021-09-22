const Order = require("../models/order");
const sendEmail = require("./../utils/sendEmail");

// TODO(#1): Write tests for order controller

// @desc Create new order
// @route POST /api/v1/orders
async function createOrder(req, res) {
  const {
    buyer,
    items,
    deliveryOption,
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
      orderAmount,
      quantity,
      deliveryAddress,
    });

    const createdOrder = await order.save();

    res.status(201);
    res.json(createdOrder);
  }
}

async function confirmOrderById(req, res) {
  const { orderID, buyerEmail } = req.body;
  const result = await Order.findByIdAndUpdate(orderID, {
    orderStatus: "ACCEPTED",
  });
  let mailDetails = {
    from: "customerservice@locary.com.ph",
    to: buyerEmail,
    subject: "Order Accepted",
    html: "<h1>Order Accepted</h1>",
  };
  sendEmail.sendEmail(mailDetails);
  res.json(result);
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
  confirmOrderById,
  getOrders,
  getOrderById,
  getRecentOrders,
};
