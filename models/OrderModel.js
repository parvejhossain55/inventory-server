const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: { type: String, required: true },
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
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    note: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
