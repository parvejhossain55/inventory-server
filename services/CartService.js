const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

// retrieve the current user's cart
async function getUserCart(userId) {
  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    return { status: 200, cart };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Error retrieving cart." };
  }
}

// add a new product to the current user's cart
async function addToCart(userId, productId, quantity) {
  try {
    const cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(productId);

    if (!cart) {
      // If cart is null, create a new cart for the user
      const newCart = new Cart({
        user: userId,
        products: [
          {
            product: productId,
            quantity: quantity,
            price: product.price,
            totalPrice: product.price * quantity,
          },
        ],
        subTotal: product.price * quantity,
      });
      await newCart.save();
      return { status: 201, message: "product added to cart.", cart: newCart };
    }

    // Check if the product already exists in the cart
    const existProduct = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (existProduct) {
      // If the product already exists in the cart, just update the quantity
      quantity === 1 ? existProduct.quantity++ : existProduct.quantity = quantity;
      existProduct.totalPrice = product.price * existProduct.quantity;
    } else {
      // If the product doesn't exist in the cart, add it as a new product
      cart.products.push({
        product: productId,
        quantity: quantity,
        price: product.price,
        totalPrice: product.price * quantity,
      });
    }

    // Update the total cost of the cart
    cart.subTotal = cart.products.reduce((acc, p) => acc + p.totalPrice, 0);

    // Save the cart to the database
    await cart.save();

    return { status: 201, cart };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Error adding product to cart." };
  }
}

// remove an product from the current user's cart
async function deleteCartItem(userId, itemId) {
  try {
    const cart = await Cart.findOne({ user: userId });

    // Remove the cart product with the specified ID
    cart.products = cart.products.filter((p) => p._id.toString() !== itemId);

    // Update the total cost of the cart
    cart.total = cart.products.reduce(
      (total, p) => total + p.price * p.quantity,
      0
    );

    // Save the cart to the database
    await cart.save();

    return { status: 200, message: "Cart product removed.", cart };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Error removing cart product." };
  }
}

// quantity update to cart item
async function updateCartQuantity(userId, itemId, quantity = 1) {
  try {
    const cart = await Cart.findOne({ user: userId });
    // console.log("carts===========>", cart);

    if (!cart) {
      return { status: 400, message: "Cart Not Found" };
    }

    const product = cart.products.find((p) => p._id.toString() === itemId);
    // console.log("products===========>",product);

    if (!product) {
      return { status: 400, message: "Product Not Found" };
    }

    if (quantity < 1) {
      return { status: 400, message: "Please add 1 or more quantity" };
    }

    product.quantity = quantity;
    product.totalPrice = quantity * product.price;

    cart.subTotal = cart.products.reduce((acc, p) => acc + p.totalPrice, 0);

    await cart.save();

    return { status: 200, message: "Quantity successfully updated", cart };
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
}

// clear the current user's cart
async function clearUserCart(userId) {
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return { status: 404, message: "Cart not found" };
    }

    cart.products = [];
    cart.total = 0;
    await cart.save();

    return { status: 200, message: "Cart cleared successfully" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Server error" };
  }
}

// checkout cart item
async function checkoutCart(userId) {
  try {
    const cart = await Cart.findOne({ user: userId });
    // 1. check if cart exist or not
    // 2. palce payment
    // 3. if payment complete -> create order -> quantity minus and sold plus functionality added

    const order = new Order({
      user: userId,
      products: cart.products,
      total: cart.total,
      paymentMethod: "creditcard",
      shippingFee: 80,
    });

    await order.save();

    cart.products = [];
    cart.total = 0;
    await cart.save();

    return { status: 201, message: "Order succesfully complete", order };
  } catch (err) {
    return { status: 500, message: "Order Failed" };
  }
}

// get cart summary
async function getCartSummary(userId) {
  try {
    const cart = await Cart.findOne({ user: userId });

    let totalItems = 0;
    let cartTotal = 0;
    for (const product of cart.products) {
      totalItems += product.quantity;
      cartTotal += product.quantity * product.price;
    }

    return {
      totalItems,
      cartTotal,
    };
  } catch (err) {
    throw new Error(`Error getting cart summary: ${err.message}`);
  }
}

module.exports = {
  getUserCart,
  addToCart,
  deleteCartItem,
  updateCartQuantity,
  clearUserCart,
  checkoutCart,
  getCartSummary,
};
