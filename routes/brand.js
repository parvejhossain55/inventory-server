const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/BrandController");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/cloudinaryUploader");

router.get("/brand/:slug", BrandController.getBrandBySlug);
router.get("/brand", BrandController.getAllBrands);
router.post(
  "/brand",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  uploadToCloudinary,
  BrandController.createBrand
);
router.put(
  "/brand/:id",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  uploadToCloudinary,
  BrandController.updateBrand
);
router.delete(
  "/brand/:id",
  isAuthenticated,
  isAdmin,
  BrandController.deleteBrand
);

router.get("/brand/:id/products", BrandController.getAllProductsByBrand);

module.exports = router;
