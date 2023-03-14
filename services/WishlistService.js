const Wishlist = require("../models/WishlistModel");

// Add a product to a user's wishlist
exports.addToWishlist = async (userId, productId) => {
  try {
    // Create a new wishlist if the user doesn't have any
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      const wishlist = new Wishlist({
        user: userId,
        products: [{ product: productId }],
      });
      wishlist.save();

      return { status: 201, message: "Product added to wishlist f", wishlist };
    }

    // Check if the product is already in the wishlist
    if (wishlist.products.some((item) => item.product == productId)) {
      return { status: 200, message: "Product already in wishlist" };
    }

    // Add the product to the wishlist and save
    wishlist.products.push({ product: productId });
    await wishlist.save();

    return { status: 201, message: "Product added to wishlist", wishlist };
  } catch (err) {
    return { status: 500, message: "Failed to added wishlist" };
  }
};

// Get a user's wishlists
exports.getWishlists = async (userId) => {
  try {
    const wishlists = await Wishlist.find({ user: userId }).populate(
      "products.product"
    );
    return {
      status: 200,
      wishlists,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

// Remove a product from a user's wishlist
exports.removeFromWishlist = async (userId, productId) => {
  try {
    const wishlist = await Wishlist.updateOne(
      { user: userId },
      { $pull: { products: { product: productId } } }
    );
    return { status: 200, message: "Product successfully removed", wishlist };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};
