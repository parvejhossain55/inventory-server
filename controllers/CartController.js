const cartService = require("../services/CartService");

exports.getCart = async (req, res) => {
  try {
    const { status, cart } = await cartService.getUserCart(req.user._id);
    res.status(status).json(cart);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { status, cart } = await cartService.addToCart(
      req.user._id,
      productId,
      quantity
    );
    res.status(status).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status, message, cart } = await cartService.deleteCartItem(
      req.user._id,
      itemId
    );
    res.status(status).json({ message, cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const { status, message, cart } = await cartService.updateCartQuantity(
      req.user._id,
      itemId,
      quantity
    );
    res.status(status).json({ message, cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.clearUserCart = async (req, res) => {
  try {
    const { status, message } = await cartService.clearUserCart(req.user._id);
    res.status(status).json({ message });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.checkoutCart = async (req, res) => {
  try {
    const { status, message, order } = await cartService.checkoutCart(
      req.user._id
    );
    res.status(status).json({ message, order });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getCartSummary = async (req, res) => {
  try {
    const summary = await cartService.getCartSummary(req.user._id);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
