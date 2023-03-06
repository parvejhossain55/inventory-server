const ReviewService = require("../services/ReviewService");

async function getAllReviews(req, res) {
  try {
    const { productId } = req.params;
    const { status, reviews, message } = await ReviewService.getAllReviews(
      productId
    );
    res.status(status).json({ reviews, message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createReview(req, res) {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const { status, message, review } = await ReviewService.createReview({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });
    res.status(status).json({ message, review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateReviewById(req, res) {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;
    const { status, message, review } = await ReviewService.updateReviewById({
      userId: req.user._id,
      productId,
      reviewId,
      rating,
      comment,
    });
    res.status(status).json({ message, review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteReviewById(req, res) {
  try {
    const { productId, reviewId } = req.params;
    const {status, message} = await ReviewService.deleteReviewById({
      userId: req.user._id,
      productId,
      reviewId,
    });
    res.status(status).json({message});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getAllReviews,
  createReview,
  updateReviewById,
  deleteReviewById,
};
