const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");
const Payment = require("../models/PaymentModel");
const Product = require("../models/ProductModel");
const orderTemplate = require("../template/order-confirmation");
const { SendEmail } = require("../utils/SendEmail");
const generateOrderId = require("../utils/generateOrdeId");
const transactionId = require("../utils/transactionId");
const SSLCommerz = require("sslcommerz-lts");

const sslcommerz = new SSLCommerz(
  process.env.STORE_ID,
  process.env.STORE_PASSWORD,
  false
);

// retrieve the current user's cart
async function getUserCart(userId) {
  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    const products = cart.products;
    const subtotal = cart.subTotal;
    const shipping = 0;

    return { status: 200, products, subtotal, shipping };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Error Retrieving Cart" };
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
      quantity === 1
        ? existProduct.quantity++
        : (existProduct.quantity = quantity);
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

// quantity update to cart item
async function updateCartQuantity(userId, itemId, quantity) {
  try {
    const cart = await Cart.findOne({ user: userId });
    // console.log("carts===========>", cart);

    if (!cart) {
      return { status: 404, message: "Cart Not Found" };
    }

    const product = cart.products.find((p) => p._id.toString() === itemId);
    // console.log("products===========>",product);

    if (!product) {
      return { status: 404, message: "Product Not Found" };
    }

    if (quantity < 1) {
      return { status: 400, message: "Please add 1 or more quantity" };
    }

    product.quantity = quantity;
    product.totalPrice = quantity * product.price;

    cart.subTotal = cart.products.reduce(
      (total, product) => total + product.totalPrice,
      0
    );

    await cart.save();

    return { status: 200, cart };
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
}

// remove an product from the current user's cart
async function removeCartItem(userId, itemId) {
  try {
    const cart = await Cart.findOne({ user: userId });

    cart.products = cart.products.filter(
      (product) => product._id.toString() !== itemId
    );

    // Update the total cost of the cart
    cart.subTotal = cart.products.reduce(
      (total, product) => total + product.totalPrice,
      0
    );

    // Save the cart to the database
    await cart.save();

    return { status: 200, cart };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Error removing cart product." };
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
async function checkoutCart(userId, orderData) {
  const {
    name,
    email,
    phone,
    address,
    country,
    city,
    state,
    zip,
    note,
    product_name,
  } = orderData;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return { status: 404, message: "Cart Not Found" };
    }

    const data = {
      total_amount: cart.subTotal,
      currency: "BDT",
      tran_id: transactionId(), // use unique tran_id for each api call
      success_url: `${process.env.CLIENT_URL}/checkout/success`,
      fail_url: `${process.env.CLIENT_URL}/checkout/fail`,
      cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`,
      ipn_url: `${process.env.CLIENT_URL}/checkout/ipn`,
      product_name,
      product_category: "General",
      product_profile: "General",
      cus_name: name,
      cus_email: email,
      cus_add1: address,
      cus_city: city,
      cus_state: state,
      cus_postcode: zip,
      cus_country: country,
      cus_phone: phone,
      shipping_method: "No",
      value_a: userId,
      value_b: note,
      value_c: email,
      // ship_name: "Customer Name",
      // ship_add1: "Dhaka",
      // ship_add2: "Dhaka",
      // ship_city: "Dhaka",
      // ship_state: "Dhaka",
      // ship_postcode: 1000,
      // ship_country: "Bangladesh",
    };

    const payment = await sslcommerz.init(data);

    return {
      status: 200,
      url: payment.GatewayPageURL,
    };
  } catch (err) {
    throw new Error("Checkout Failed");
  }
}

async function checkoutSuccess(success) {
  try {
    // Validate the payment
    const validate = await sslcommerz.validate(success);
    const {
      status,
      tran_id,
      tran_date,
      amount,
      store_amount,
      bank_tran_id,
      card_type,
      card_brand,
      card_issuer,
      value_a,
      value_b,
      value_c,
    } = validate;

    if (status !== "VALID") {
      throw new Error("Payment validation failed.");
    }

    // Retrieve the user's cart
    const cart = await Cart.findOne({ user: value_a });

    const orderId = generateOrderId();

    // Create the new order
    const order = new Order({
      user: value_a,
      orderId,
      products: cart.products.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: cart.subTotal,
      paymentMethod: card_issuer,
      paymentStatus: status === "VALID" ? "paid" : "unpaid",
      note: value_b,
    });

    // create payment
    const payment = new Payment({
      user: value_a,
      order: order._id,
      amount,
      store_amount,
      paymentStatus: status,
      tran_id,
      tran_date,
      bank_tran_id,
      paymentMethod: card_type,
      card_brand,
      card_issuer,
    });

    // Update product sold and quantity
    await quantityUpdate(cart);

    // order detail for send email
    const orderTemplateInfo = {
      orderId,
      amount: cart.subTotal,
      date: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        hour12: true,
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
      }),
    };

    // Clear the user's cart
    cart.products = [];
    cart.subTotal = 0;
    cart.couponApplied = false;

    const mailbody = orderTemplate(orderTemplateInfo);

    // email send hole resolve kore data save korte hobe otherwise order failed kore dite hobe
    await SendEmail(value_c, "Order Confirmation Mail", mailbody);

    // Save the order and the updated cart
    await Promise.all([order.save(), cart.save(), payment.save()]);

    const success_url = `${process.env.FRONTEND_URL}/user/order-success/${orderId}`;
    return success_url;
  } catch (error) {
    console.error(error);
    throw new Error("Invalid Payment. Can't create order");
  }
}

async function quantityUpdate(cart) {
  await Product.bulkWrite(
    cart.products.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }))
  );
}

async function checkoutCancel(cancel) {
  // return cancel;
  return { status: 500, message: "Payment Canceled, Please Try Again" };
}

async function checkoutFail(fail) {
  return { status: 500, message: "Payment Failed, Please Try Again" };
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
  removeCartItem,
  updateCartQuantity,
  clearUserCart,
  checkoutCart,
  checkoutSuccess,
  checkoutCancel,
  checkoutFail,
  getCartSummary,
};
