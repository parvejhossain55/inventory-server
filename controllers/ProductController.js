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

exports.getProductById = async (req, res) => {
  try {
    const { status, message, product } = await ProductService.getProductById(
      req.params.id
    );
    res.status(status).json({ message, product });
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
    const products = await ProductService.filterProducts(req.query);
    return res.status(products.status).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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

// controller function to handle requests to retrieve related products
exports.getRelatedProducts = async (req, res) => {
  try {
    // call the service function to retrieve
    const { status, message, product } = await ProductService.getRelatedProducts(
      req.params
    );

    // send the appropriate response based on the result of the service function call
    if (status === 200) {
      res.status(status).json({ message, product });
    } else {
      res.status(500).json({ status, message });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
