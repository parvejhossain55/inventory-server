const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

// router.get("/order", isAuthenticated, OrderController.getAllOrders);
router.get("/orders", OrderController.getAllOrders);
router.get("/order/:orderId", OrderController.getOrderById);
router.patch("/order/:orderId", isAuthenticated, OrderController.updateOrder);
// router.post("/order", OrderController.createOrder);
// router.delete("/order/:orderId", OrderController.deleteOrder);

module.exports = router;
