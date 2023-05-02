const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

router.get("/orders", OrderController.getAllOrders);
router.get("/order/:orderId", OrderController.getOrderById);
router.patch("/order/:orderId", isAuthenticated, OrderController.updateOrder);

router.get("/orders-by-user", isAuthenticated, OrderController.getOrderByUser);
module.exports = router;
