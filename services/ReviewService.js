const Review = require("../models/ReviewModel");

async function getAllReviews(productId) {
  try {
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "firstName lastName"
    );
    return { status: 200, reviews, message: "Retrived all reviews" };
  } catch (error) {
    return { status: 200, message: "Failed to retrive all review" };
  }
}

async function createReview(reviewData) {
  try {
    const review = new Review(reviewData);
    await review.save();
    return { status: 201, message: "Review created successfully", review };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Review created Failed" };
  }
}

async function updateReviewById(reviewData) {
  try {
    const { userId, productId, reviewId, rating, comment } = reviewData;
    const review = await Review.findOne({
      user: userId,
      _id: reviewId,
      product: productId,
    });
    if (!review) {
      return { status: 404, message: "Review not found" };
    }
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();
    return { status: 200, message: "Review updated successfully", review };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Review updated Failed" };
  }
}

async function deleteReviewById({ userId, productId, reviewId }) {
  try {
    const result = await Review.deleteOne({
      user: userId,
      _id: reviewId,
      product: productId,
    });
    if (result.deletedCount === 0) {
      return { status: 404, message: "Review not found" };
    }
    return { status: 200, message: "Review deleted successfully" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Review Deleted Failed" };
  }
}

module.exports = {
  getAllReviews,
  createReview,
  updateReviewById,
  deleteReviewById,
};
