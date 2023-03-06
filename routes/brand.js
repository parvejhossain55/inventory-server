const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/BrandController");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

router.get("/brand/:id", BrandController.getBrandById);
router.get("/brand", BrandController.getAllBrands);
router.post("/brand", isAuthenticated, BrandController.createBrand);
router.put("/brand/:id", isAuthenticated, BrandController.updateBrand);
router.delete("/brand/:id", isAuthenticated, isAdmin, BrandController.deleteBrand);

router.get("/brand/:id/products",BrandController.getAllProductsByBrand);

module.exports = router;
