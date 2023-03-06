const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["creditcard", "paypal", "banktransfer"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);

