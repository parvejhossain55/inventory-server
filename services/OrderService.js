const Order = require("../models/OrderModel");
const sendError = require("../utils/error");

exports.getAllOrders = async () => {
  const orders = await Order.find(
    {},
    { orderId: 1, status: 1, note: 1, createdAt: 1 }
  )
    .populate("user", "firstName lastName")
    .populate("payment", "amount paymentMethod paymentStatus");
  return orders;
};

exports.getOrderById = async (orderId) => {
  const order = await Order.findById(orderId);
  return order;
};

exports.updateOrder = async (orderId, updates) => {
  try {
    const order = await Order.findByIdAndUpdate(orderId, updates, {
      new: true,
    });

    if (!order) {
      sendError("Invalid Order Update", 400);
    }

    return { message: "Order Updated" };
  } catch (error) {
    sendError("Order Update Failed.", 400);
  }
};
