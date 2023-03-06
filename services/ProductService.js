const Product = require("../models/ProductModel");

exports.createProduct = async (productData) => {
  try {
    const product = new Product(productData);
    const createdProduct = await product.save();
    return {
      status: 201,
      message: "Product created successfully",
      product: createdProduct,
    };
  } catch (error) {
    return { status: 500, message: "Bad request, can't create product" };
  }
};

exports.getProductById = async (id) => {
  try {
    const product = await Product.findById(id).populate(["category", "brand"]);

    if (!product) {
      return { status: 404, message: "Product not found" };
    }
    return { status: 200, message: "Product found", product };
  } catch (error) {
    return { status: 500, message: "Internal server error" };
  }
};

exports.getAllProducts = async () => {
  try {
    const products = await Product.find().populate(["category", "brand"]);
    return {
      status: 200,
      products,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

exports.updateProductById = async (id, updatedProductData) => {
  try {
    const slug = slugify(updatedProductData.title, { lower: true });
    const product = await Product.findByIdAndUpdate(
      id,
      { ...updatedProductData, slug },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return { status: 404, message: "Product not found" };
    }

    return { status: 200, message: "Product updated successfully", product };
  } catch (error) {
    return { status: 500, message: error.message };
  }
};

exports.deleteProductById = async (productId, userRole) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return { status: 404, message: "Product not found" };
    }

    if (userRole !== "admin") {
      return { status: 403, message: "Unauthorized access" };
    }

    await product.remove();
    return { status: 200, message: "Product deleted successfully" };
  } catch (err) {
    return { status: 500, message: "Internal server error" };
  }
};

exports.filterProducts = async (query) => {
  try {
    const { keyword, minPrice, maxPrice, page = 1, limit = 10 } = query;

    // Construct the filter object based on the query parameters
    const filter = {};

    if (keyword) {
      filter.$text = { $search: keyword };
    }
    if (minPrice && maxPrice) {
      filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    } else if (minPrice) {
      filter.price = { $gte: parseInt(minPrice) };
    } else if (maxPrice) {
      filter.price = { $lte: parseInt(maxPrice) };
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("brand", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const count = await Product.countDocuments(filter);
    const totalPages = Math.ceil(count / limit);

    return {
      status: 200,
      message: "Products filtered successfully",
      products,
      currentPage: page,
      totalPages,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Something went wrong for filtering product",
    };
  }
};

exports.getNewArrivals = async (page = 1, limit = 10) => {
  try {
    const products = await Product.find({})
      .populate(["category", "brand"])
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    return {
      status: 200,
      message: "New arrivals retrieved successfully.",
      products,
    };
  } catch (error) {
    return { status: 500, message: "Internal server error" };
  }
};

exports.getRelatedProducts = async ({ productId, categoryId }) => {
  try {
    const product = await Product.find({
      category: { $in: [categoryId] },
      _id: { $ne: productId },
    })
      .populate(["category", "brand"])
      .limit(5);

    return {
      status: 200,
      message: "Successfully find related product",
      product,
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
