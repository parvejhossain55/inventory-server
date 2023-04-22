const ProductService = require("../services/ProductService");

exports.createProduct = async (req, res) => {
  const fileName = req.file?.filename;
  try {
    const { status, message, product } = await ProductService.createProduct(
      req.body,
      fileName
    );
    return res.status(status).json({ message, product });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.productByCategory = async (req, res) => {
  try {
    const { status, products, count, totalPages } =
      await ProductService.productByCategory(req.params.slug, req.query);
    res.status(status).json({ products, count, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { status, message, product } = await ProductService.getProductBySlug(
      req.params.slug
    );
    res.status(status).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { status, message, products } = await ProductService.getAllProducts();
    res.status(status).json({ message, products });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.getProductByType = async (req, res) => {
  try {
    const { status, products, message } =
      await ProductService.getProductByType();
    res.status(status).json(products);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.updateProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const filename = req.file?.filename
    const { status, message, product } =
      await ProductService.updateProductBySlug(slug, req.body, filename);
    res.status(status).json({ message, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    const { status, message } = await ProductService.deleteProductById(
      id,
      role
    );

    return res.status(status).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const { status, products, totalPages, count } =
      await ProductService.searchProduct(req.query);
    res.status(status).json({ products, totalPages, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const filters = req.body;
    const query = req.query;

    const { status, products, totalPages } =
      await ProductService.filterProducts(filters, query);
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    res.status(status).json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    const { status, message, products } = await ProductService.getNewArrivals();
    res.status(status).json({ message, products });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const { status, product } = await ProductService.getRelatedProducts(
      req.params
    );

    res.status(status).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};
