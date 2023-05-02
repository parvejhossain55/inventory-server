const TransactionServices = require("../services/TransactionServices");

exports.getAllTransaction = async (req, res, next) => {
  try {
    const transaction = await TransactionServices.getAllTransaction(req.query);
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// exports.getOrderById = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     const order = await OrderService.getOrderById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found." });
//     }
//     res.status(200).json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error retrieving order." });
//   }
// };

// exports.updateOrder = async (req, res, next) => {
//   try {
//     const { orderId } = req.params;
//     const order = await OrderService.updateOrder(orderId, req.body);

//     res.status(200).json(order);
//   } catch (error) {
//     next(error);
//   }
// };
