const OrderService = require("../services/OrderService");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders." });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving order." });
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await OrderService.updateOrder(orderId, req.body);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getOrderByUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const order = await OrderService.getOrderByUser(userId);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
