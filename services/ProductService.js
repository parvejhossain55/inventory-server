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

exports.getProductBySlug = async (slug) => {
  try {
    const product = await Product.findOne({ slug })
      .populate("category", "name slug")
      .populate("brand", "name slug");

    if (!product) {
      return { status: 404, message: "Product not found" };
    }
    return { status: 200, message: "Product found", product };
  } catch (error) {
    return { status: 500, message: error.message };
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

exports.getProductByType = async () => {
  try {
    const feature = await Product.find({ type: "feature" })
      .limit(8)
      .sort({ sold: -1 });
    const newProduct = await Product.find({ type: "new" })
      .limit(8)
      .sort({ createdAt: -1 });
    const topSelling = await Product.find({ type: "topselling" })
      .limit(8)
      .sort({ sold: -1 });
    const bestDeal = await Product.find({ type: "bestdeal" })
      .limit(5)
      .sort({ createdAt: -1 });
    const topRated = await Product.find({ type: "toprated" })
      .limit(5)
      .sort({ createdAt: -1 });
    const products = [
      ...feature,
      ...newProduct,
      ...topSelling,
      ...bestDeal,
      ...topRated,
    ];
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

exports.filterProducts = async (filters, query) => {
  try {
    const { category, brand, price, sortBy, perPage } = filters;

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;

    const filter = {};
    const sort = {};

    if (category && category.length > 0) filter.category = { $in: category };
    if (brand && brand.length > 0) filter.brand = { $in: brand };
    if (price && price.length > 0)
      filter.price = { $gte: price[0], $lte: price[1] };

    switch (sortBy) {
      case "rating":
        sort.sold = -1;
        break;
      case "priceHigh":
        sort.price = -1;
        break;
      case "priceLow":
        sort.price = 1;
        break;
      default:
        sort.createdAt = -1;
        break;
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("brand", "name")
      .skip((page - 1) * limit)
      .sort(sort)
      .limit(limit)
      .exec();

    const count = await Product.countDocuments(filter);
    const totalPages = Math.ceil(count / limit);

    console.log("products=> ", products);
    console.log("filter=> ", filter);
    console.log("count=> ", count);

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

exports.getNewArrivals = async () => {
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
    }).limit(4);

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
