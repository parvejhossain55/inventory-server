const mongoose = require("mongoose");
const crypto = require("crypto");

const shippingAddressSchema = new mongoose.Schema({
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
    match: /^\d{5}$/,
  },
  country: {
    type: String,
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      match: /^\d{11}$/,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    emailVerified: {
      type: Boolean,
    },
    verificationToken: {
      type: String,
    },
    verificationExpires: {
      type: Date,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpires: {
      type: Date,
    },
    shippingAddress: shippingAddressSchema,
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.verificationToken = token;
  this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // Expires in 24 hours
  return token;
};

module.exports = mongoose.model("User", userSchema);
