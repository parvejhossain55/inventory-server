const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/BrandController");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const upload = require("../utils/fileUpload");

router.get("/brand/:slug", BrandController.getBrandBySlug);
router.get("/brand", BrandController.getAllBrands);
router.post("/brand", isAuthenticated, isAdmin, upload.single("image"), BrandController.createBrand);
router.put("/brand/:id", isAuthenticated, isAdmin, upload.single("image"), BrandController.updateBrand);
router.delete("/brand/:id", isAuthenticated, isAdmin, BrandController.deleteBrand);

router.get("/brand/:id/products", BrandController.getAllProductsByBrand);

module.exports = router;
