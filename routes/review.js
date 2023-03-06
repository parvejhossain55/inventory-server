const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

// Retrieve all reviews for a product
router.get("/product/:productId/reviews", ReviewController.getAllReviews);

// Create a new review for a product
router.post(
  "/product/:productId/reviews",
  isAuthenticated,
  ReviewController.createReview
);

// Update a specific review for a product
router.put(
  "/product/:productId/reviews/:reviewId",
  isAuthenticated,
  ReviewController.updateReviewById
);

// Delete a specific review for a product
router.delete(
  "/product/:productId/review/:reviewId",
  isAuthenticated,
  ReviewController.deleteReviewById
);

module.exports = router;
