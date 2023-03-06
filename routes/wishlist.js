const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/WishlistController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

// Add a product to a user's wishlist
router.post("/wishlist", isAuthenticated, WishlistController.addToWishlist);

// Get a user's wishlists
router.get("/wishlist", isAuthenticated, WishlistController.getWishlists);

// Remove a product from a user's wishlist
router.delete("/wishlist/:productId", isAuthenticated, WishlistController.removeFromWishlist);

module.exports = router;
