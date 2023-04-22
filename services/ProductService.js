const fs = require("fs");
const path = require("path");
const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");

exports.createProduct = async (productData, images) => {
  try {
    const product = await Product.create({ ...productData, images: [images] });

    console.log("product ", product)
    console.log("value ", Object.values(product).length)

    if (Object.values(product).length < 1)
      return { status: 200, message: "Bad request, Can't create Product" };

    return {
      status: 201,
      message: "Product created successfully",
      product,
    };
  } catch (error) {
    const filePath = path.join(__dirname, "../", "public", "uploads", images);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
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

exports.updateProductBySlug = async (slug, data, images) => {
  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return { status: 404, message: "Product not found" };
    }

    if (images) {
      const filePath = path.join(
        __dirname,
        "../",
        "public",
        "uploads",
        product.images[0]
      );
  
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
  
      product.images = [images];
    }

    product.title = data.title || product.title;
    product.slug = data.slug || product.slug;
    product.description = data.description || product.description;
    product.tags = data.tags || product.tags;
    product.price = data.price || product.price;
    product.salePrice = data.salePrice || product.salePrice;
    product.quantity = data.quantity || product.quantity;
    product.size = data.size || product.size;
    product.unit = data.unit || product.unit;
    product.type = data.type || product.type;
    product.status = data.status || product.status;
    product.brand = data.brand || product.brand;
    product.category = data.category || product.category;

    await product.save();
    return { status: 200, message: "Product Updated Successfully", product };
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
      return {
        status: 403,
        message: "Unauthorized access. Only Admin can delete",
      };
    }

    const filePath = path.join(
      __dirname,
      "../",
      "public",
      "uploads",
      product.images[0]
    );

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    await product.remove();
    return { status: 200, message: "Product deleted successfully" };
  } catch (err) {
    return { status: 500, message: "Internal server error" };
  }
};

exports.productByCategory = async (slug, query) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const sortBy = query.sortBy || "rating";

    const sort = {};

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

    const category = await Category.findOne({ slug });
    if (!category) return { status: 404, message: "Category not found" };

    const products = await Product.find({ category })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .select("title slug price images");

    const count = await Product.find({ category }).countDocuments();
    const totalPages = Math.ceil(count / limit);

    // console.log("products=> ", products);
    console.log("count=> ", count);
    console.log("totalPages=> ", totalPages);

    return {
      status: 200,
      products,
      totalPages,
      count,
    };

    return { status: 200, product };
  } catch (error) {
    return { status: 500, message: error.message };
  }
};

exports.searchProduct = async (query) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const sortBy = query.sortBy || "rating";

    const filter = {
      $or: [
        { title: { $regex: query.q, $options: "i" } },
        { description: { $regex: query.q, $options: "i" } },
      ],
    };
    const sort = {};

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
      .select("title slug price images")
      .skip((page - 1) * limit)
      .sort(sort)
      .limit(limit)
      .exec();

    const count = await Product.countDocuments(filter);
    const totalPages = Math.ceil(count / limit);

    // console.log("products=> ", products);
    console.log("count=> ", count);
    console.log("totalPages=> ", totalPages);

    return {
      status: 200,
      products,
      currentPage: page,
      totalPages,
      count,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Something went wrong for filtering product",
    };
  }
};

exports.filterProducts = async (filters, query) => {
  try {
    const { category, brand, price, sortBy, keyword, perPage } = filters;

    const page = parseInt(query.page) || 1;
    const limit = perPage;

    const filter = {};
    const sort = {};

    if (category && category.length > 0) filter.category = { $in: category };
    if (brand && brand.length > 0) filter.brand = { $in: brand };
    if (price) filter.price = { $gte: price.min, $lte: price.max };
    if (keyword && keyword.length > 0) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

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

    // console.log("products=> ", products);
    // console.log("filter=> ", filter);
    // console.log("count=> ", count);

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
