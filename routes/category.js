const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

router.get("/category/:id", CategoryController.getCategoryById);
router.get("/category", CategoryController.getAllCategories);
router.post("/category", isAuthenticated, CategoryController.createCategory);
router.put("/category/:id", isAuthenticated, CategoryController.updateCategory);
router.delete("/category/:id",isAuthenticated,isAdmin,CategoryController.deleteCategory);

router.get("/category/:id/products",CategoryController.getAllProductsByCategory);

module.exports = router;
