const ProductService = require("../services/ProductService");

exports.createProduct = async (req, res) => {
  try {
    const { status, message, product } = await ProductService.createProduct(
      req.body
    );
    return res.status(status).json({ message, product });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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

exports.updateProductById = async (req, res) => {
  const { id } = req.params;
  const { status, message, product } = await ProductService.updateProductById(
    id,
    req.body
  );
  res.status(status).json({ message, product });
};

exports.deleteProductById = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  const { status, message } = await ProductService.deleteProductById(id, role);

  return res.status(status).json({ message });
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
    const { status, product } =
      await ProductService.getRelatedProducts(req.params);

    res.status(status).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};
