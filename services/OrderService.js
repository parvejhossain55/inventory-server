const Order = require("../models/OrderModel");

exports.getAllOrders = async () => {
  const orders = await Order.find();
  return orders;
};

exports.getOrderById = async (orderId) => {
  const order = await Order.findById(orderId);
  return order;
};

exports.updateOrder = async (orderId, updates) => {
  const order = await Order.findByIdAndUpdate(orderId, updates, { new: true });
  return order;
};
