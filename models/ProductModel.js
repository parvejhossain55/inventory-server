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

// GET /products - retrieves a list of all products
// GET /products/:id - retrieves details for the product with the specified ID
// POST /products - creates a new product with the data in the request body
// PUT /products/:id - updates the product with the specified ID using the data in the request body
// DELETE /products/:id - deletes the product with the specified ID
// GET /products/search - searches for products that match the given query parameters (e.g. name, category, brand, price range)
// GET /products/top-rated - retrieves a list of top-rated products (based on customer reviews or ratings)
// GET /products/new-arrivals - retrieves a list of newly added products
// GET /products/sale - retrieves a list of products on sale or with discounts
// GET /products/bestsellers - retrieves a list of best-selling products
// GET /products/recommended - retrieves a list of products recommended based on the user's browsing or purchase history

// generate controller and service function. all business logic write in service function and always return object with status and message. controller should be responsible for request and response. destucture status , message in controller where call service function. return product with pagination
