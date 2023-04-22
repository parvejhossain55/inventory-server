const CouponService = require("../services/CouponService");

// create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await CouponService.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get a specific coupon by code
exports.applyCouponCode = async (req, res) => {
  try {
    const {status, cart, message} = await CouponService.applyCouponCode(req.params.code, req.user._id);
    res.status(status).json({message, cart});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await CouponService.getAllCoupons();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get a specific coupon by code
exports.getCouponByCode = async (req, res) => {
  try {
    const coupon = await CouponService.getCouponByCode(req.params.code);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update a specific coupon by code
exports.updateCouponByCode = async (req, res) => {
  try {
    const coupon = await CouponService.updateCouponByCode(
      req.params.code,
      req.body
    );
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete a specific coupon by code
exports.deleteCouponByCode = async (req, res) => {
  try {
    const result = await CouponService.deleteCouponByCode(req.params.code);
    if (!result) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({message : "Coupon Successfully Deleted"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
