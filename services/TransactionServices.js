const Payment = require("../models/PaymentModel");
const sendError = require("../utils/error");

exports.getAllTransaction = async ({
  fromDate,
  toDate,
  paymentStatus,
  search,
  sortBy = "tran_date",
  sortOrder = -1,
}) => {
  try {
    const query = {};

    if (fromDate) {
      query.tran_date = { $gte: new Date(fromDate) };
    }

    if (toDate) {
      query.tran_date = { ...query.tran_date, $lte: new Date(toDate) };
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [{ tran_id: { $regex: search, $options: "i" } }];
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const transaction = await Payment.find(query, {
      amount: 1,
      tran_id: 1,
      tran_date: 1,
      paymentMethod: 1,
      paymentStatus: 1,
    })
      .populate("user", "firstName lastName -_id")
      .populate("order", "orderId status note -_id")
      .sort(sortObj);

    return transaction;
  } catch (error) {
    sendError(error.message);
  }
};

// exports.getOrderById = async (orderId) => {
//   const order = await Order.findById(orderId);
//   return order;
// };

// exports.updateOrder = async (orderId, updates) => {
//   try {
//     const order = await Order.findByIdAndUpdate(orderId, updates, {
//       new: true,
//       projection: { orderId: 1, status: 1 },
//     }).populate("user", "firstName lastName email -_id");

//     if (!order) {
//       sendError("Order Update Failed.", 400);
//     }

//     const templateInfo = {
//       orderId: order.orderId,
//       name: order.user.firstName + " " + order.user.lastName,
//       status: order.status,
//       // date: new Date().toLocaleString("en-US", {
//       //   timeZone: "Asia/Dhaka",
//       //   hour12: true,
//       //   year: "numeric",
//       //   month: "long",
//       //   day: "2-digit",
//       //   hour: "numeric",
//       //   minute: "numeric",
//       // }),
//     };

//     const mailTemplate = orderStatusTemplate(templateInfo);
//     await SendEmail(order.user.email, "Order Status Updated", mailTemplate);

//     return { message: "Order Updated", order };
//   } catch (error) {
//     sendError(error.message, 400);
//   }
// };
