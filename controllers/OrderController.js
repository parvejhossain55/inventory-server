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
    const orderId = req.params.orderId;
    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving order." });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { updates } = req.body;
    const order = await OrderService.updateOrder(orderId, updates);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json({ message: "Order updated successfully.", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order." });
  }
};
