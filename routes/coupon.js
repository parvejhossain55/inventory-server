const express = require("express");
const router = express.Router();
const CouponController = require("../controllers/CouponController");
const {isAuthenticated, isAdmin} = require("../middleware/isAuthenticated.js");
const CartModel = require("../models/CartModel");

// Route to create a new coupon
router.post("/coupons", isAuthenticated, isAdmin, CouponController.createCoupon);

// Route to get a specific coupon by code
router.get("/coupons/:code", isAuthenticated, CouponController.applyCouponCode);

// Route to get a specific coupon by code
router.get("/coupons/:code", isAuthenticated, isAdmin, CouponController.getCouponByCode);

// Route to get all coupons
router.get("/coupons", isAuthenticated, isAdmin, CouponController.getAllCoupons);

// Route to update a specific coupon by code
router.put("/coupons/:code", isAuthenticated, isAdmin, CouponController.updateCouponByCode);

// Route to delete a specific coupon by code
router.delete("/coupons/:code",isAuthenticated, isAdmin, CouponController.deleteCouponByCode);

module.exports = router;
