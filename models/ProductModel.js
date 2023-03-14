const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["feature", "sale", "new"],
      default: "new",
    },
    sold: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: true,
    },
    unit: {
      type: String,
    },
    images: {
      type: Array,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

productSchema.index({
  title: "text",
  slug: "text",
  description: "text",
  sku: "text",
  category: "text",
  brand: "text",
});

module.exports = mongoose.model("Product", productSchema);
