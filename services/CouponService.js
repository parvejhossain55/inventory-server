const Cart = require("../models/CartModel");
const Coupon = require("../models/CouponModel");

// create a new coupon
exports.createCoupon = async (couponData) => {
  try {
    const coupon = new Coupon(couponData);
    await coupon.save();
    return coupon;
  } catch (error) {
    throw new Error(error.message);
  }
};

// get a specific coupon by code
exports.applyCouponCode = async (code, userid) => {
  try {
    const coupon = await Coupon.findOne({ code });
    const cart = await Cart.findOne({ user: userid });

    if (!coupon) return { status: 404, message: "Coupon Not Found" };
    if (!cart || cart.products.length < 1)
      return { status: 404, message: "Cart Not Found" };

    const totalPrice = cart.products.reduce(
      (total, product) => total + product.totalPrice,
      0
    );
    const currentDate = new Date().getTime();

    if (cart.couponApplied)
      return { status: 200, message: "Coupon Already Applied" };

    if (totalPrice < coupon.minPurchase)
      return {
        status: 200,
        message: `Plesase order more than ${coupon.minPurchase}`,
      };
    if (currentDate > coupon.expirationDate.getTime())
      return { status: 200, message: "Coupon has expired" };

    if (coupon.usageLimit <= 0)
      return { status: 200, message: "Coupon usage limit exceeded" };

    cart.subTotal -= calculateDiscount(coupon, totalPrice);
    cart.couponApplied = true;
    coupon.usageLimit -= 1;
    await cart.save();
    await coupon.save();

    console.log("min purchase", coupon.minPurchase);
    console.log("total purchase price", totalPrice);
    console.log("discountAmount", calculateDiscount(coupon, totalPrice));
    console.log("subTotal", totalPrice - calculateDiscount(coupon, totalPrice));

    return { status: 200, message: "Coupon Succesfully Applied", cart };
  } catch (error) {
    throw new Error(error.message);
  }
};

const calculateDiscount = (coupon, subTotal) => {
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (coupon.discountAmount / 100) * subTotal;
  } else if (coupon.discountType === "fixed") {
    discount = coupon.discountAmount;
  }
  return discount;
};

// get all coupons
exports.getAllCoupons = async () => {
  try {
    const coupons = await Coupon.find();
    return coupons;
  } catch (error) {
    throw new Error(error.message);
  }
};

// get a specific coupon by code
exports.getCouponByCode = async (code) => {
  try {
    const coupon = await Coupon.findOne({ code });
    return coupon;
  } catch (error) {
    throw new Error(error.message);
  }
};

// update a specific coupon by code
exports.updateCouponByCode = async (code, couponData) => {
  try {
    const coupon = await Coupon.findOneAndUpdate({ code }, couponData, {
      new: true,
    });
    return coupon;
  } catch (error) {
    throw new Error(error.message);
  }
};

// delete a specific coupon by code
exports.deleteCouponByCode = async (code) => {
  try {
    const result = await Coupon.findOneAndDelete({ code });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
