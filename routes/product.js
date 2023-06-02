const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/cloudinaryUploader");

// GET products by search query parameters
router.get("/products/search", ProductController.searchProduct);
router.get("/products/category/:slug", ProductController.productByCategory);

// GET products by search query parameters
router.post("/products/filter-products", ProductController.filterProducts);

// GET new arrivals
router.get("/products/new-arrivals", ProductController.getNewArrivals);

// GET related products
router.get(
  "/products/related-products/:productId/:categoryId",
  ProductController.getRelatedProducts
);

router.get("/product-by-type", ProductController.getProductByType);
// GET all products
router.get("/products", ProductController.getAllProducts);

// GET product by ID
router.get("/products/:slug", ProductController.getProductBySlug);

// POST new product
router.post(
  "/products",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  uploadToCloudinary,
  ProductController.createProduct
);

// PATCH update product by ID
router.patch(
  "/products/:slug",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  uploadToCloudinary,
  ProductController.updateProductBySlug
);

// DELETE product by ID
router.delete(
  "/products/:id",
  isAuthenticated,
  isAdmin,
  ProductController.deleteProductById
);
module.exports = router;
