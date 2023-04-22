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

// checkout success
router.post("/checkout/success", CartController.checkoutSuccess)

// checkout success
router.post("/checkout/cancel", CartController.checkoutCancel)

// checkout success
router.post("/checkout/fail", CartController.checkoutFail)

// checkout success
router.post("/checkout/ipn", CartController.checkoutIpn)

// cart summary
router.get("/cart/summary", isAuthenticated, CartController.getCartSummary);

module.exports = router;
