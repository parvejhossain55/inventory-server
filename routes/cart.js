const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

// current user's cart
router.get("/cart", isAuthenticated, CartController.getCart);

// add item to cart
router.post("/cart", isAuthenticated, CartController.addToCart);

// quantity update to specific item from cart
router.put("/cart", isAuthenticated, CartController.updateCartQuantity);

// remove item from cart
router.delete("/cart/:itemId", isAuthenticated, CartController.removeCartItem);

// clear user's cart
router.delete("/cart", isAuthenticated, CartController.clearUserCart);

// checkout cart and create order
router.post("/cart/checkout", isAuthenticated, CartController.checkoutCart);

// cart summary
router.get("/cart/summary", isAuthenticated, CartController.getCartSummary);

module.exports = router;
