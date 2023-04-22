const wishlistService = require("../services/wishlistService");

// Add a product to a user's wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const { status, message, wishlist } = await wishlistService.addToWishlist(
      userId,
      productId
    );
    res.status(status).json({ message, wishlist });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a user's wishlists
exports.getWishlists = async (req, res) => {
  try {
    const { status, products } = await wishlistService.getWishlists(
      req.user._id
    );
    res.status(status).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove a product from a user's wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { status, message, wishlist } =
      await wishlistService.removeFromWishlist(
        req.user._id,
        req.params.productId
      );
    res.status(status).json({ message, wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
