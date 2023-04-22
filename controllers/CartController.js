const cartService = require("../services/CartService");

exports.getCart = async (req, res) => {
  try {
    const { status, products, subtotal, shipping } =
      await cartService.getUserCart(req.user._id);
    res.status(status).json({ products, subtotal, shipping });
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

exports.updateCartQuantity = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const { status, cart } = await cartService.updateCartQuantity(
      req.user._id,
      itemId,
      quantity
    );
    res.status(status).json(cart);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status, cart } = await cartService.removeCartItem(
      req.user._id,
      itemId
    );
    res.status(status).json(cart);
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
    const { status, url } = await cartService.checkoutCart(
      req.user._id,
      req.body
    );
    res.status(status).json({ url });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.checkoutSuccess = async (req, res) => {
  try {
    const success_url = await cartService.checkoutSuccess(req.body);
    res.redirect(success_url);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.checkoutCancel = async (req, res) => {
  try {
    const cancel = await cartService.checkoutCancel(req.body);
    res.json({ message: "Payment Canceled", cancel });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.checkoutFail = async (req, res) => {
  try {
    const fail = await cartService.checkoutFail(req.body);
    res.json({ message: "Payment Failed", fail });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.checkoutIpn = async (req, res) => {
  // console.log("params ipn", req.params);
  // console.log("body ipn", req.body);
  // try {
  //   const ipn = await cartService.checkoutIpn(req.body);
  //   res.json({ message : ipn,  });
  // } catch (err) {
  //   res.status(500).json({ status: "error", message: err.message });
  // }
};

exports.getCartSummary = async (req, res) => {
  try {
    const summary = await cartService.getCartSummary(req.user._id);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
