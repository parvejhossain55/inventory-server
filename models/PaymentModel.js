const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    store_amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: { type: String, required: true },
    tran_id: { type: String, required: true },
    tran_date: { type: Date, required: true },
    bank_tran_id: { type: String },
    card_type: { type: String },
    card_brand: { type: String },
  },
  { versionKey: false }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
