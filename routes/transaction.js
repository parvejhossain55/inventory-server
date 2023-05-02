const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/TransactionController");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

router.get(
  "/transactions",
  isAuthenticated,
  isAdmin,
  TransactionController.getAllTransaction
);
// router.get("/order/:orderId", OrderController.getOrderById);
// router.patch("/order/:orderId", isAuthenticated, OrderController.updateOrder);

module.exports = router;
