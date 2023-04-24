const Order = require("../models/OrderModel");
const orderStatusTemplate = require("../template/order-status-update");
const { SendEmail } = require("../utils/SendEmail");
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
      projection: { orderId: 1, status: 1 },
    }).populate("user", "firstName lastName email -_id");

    if (!order) {
      sendError("Order Update Failed.", 400);
    }

    const templateInfo = {
      orderId: order.orderId,
      name: order.user.firstName + " " + order.user.lastName,
      status: order.status,
      // date: new Date().toLocaleString("en-US", {
      //   timeZone: "Asia/Dhaka",
      //   hour12: true,
      //   year: "numeric",
      //   month: "long",
      //   day: "2-digit",
      //   hour: "numeric",
      //   minute: "numeric",
      // }),
    };

    const mailTemplate = orderStatusTemplate(templateInfo);
    await SendEmail(order.user.email, "Order Status Updated", mailTemplate);

    return { message: "Order Updated", order };
  } catch (error) {
    sendError(error.message, 400);
  }
};
