const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

// GET products by search query parameters
router.get("/products/filter-products", ProductController.filterProducts);

// GET new arrivals
router.get("/products/new-arrivals", ProductController.getNewArrivals);

// GET related products
router.get(
  "/products/related-products/:productId/:categoryId",
  ProductController.getRelatedProducts
);

// GET all products
router.get("/products", ProductController.getAllProducts);

// GET product by ID
router.get("/products/:id", ProductController.getProductById);

// POST new product
router.post("/products",isAuthenticated,isAdmin,ProductController.createProduct);

// PUT update product by ID
router.put("/products/:id",isAuthenticated,isAdmin,ProductController.updateProductById);

// DELETE product by ID
router.delete("/products/:id",isAuthenticated,isAdmin,ProductController.deleteProductById);

module.exports = router;
