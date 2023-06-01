const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "Brand Name must be unique"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

// Generate a slug from the category name
brandSchema.pre("save", function (next) {
  this.slug = this.name.replace(/\s+/g, "-").toLowerCase();
  next();
});

module.exports = mongoose.model("Brand", brandSchema);
