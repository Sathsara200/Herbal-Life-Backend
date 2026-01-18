import Review from "../models/review.js";
import Product from "../models/product.js";
import { isItAdmin, isItCustomer } from "./userController.js";

/**
 * CUSTOMER: Add a review for a product
 */
export async function addReview(req, res) {
  try {
    if (!req.user || !isItCustomer(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productKey, rating, comment } = req.body;

    if (!productKey || !rating || !comment) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check product exists
    const product = await Product.findOne({ key: productKey });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Prevent multiple reviews by same user for same product
    const existingReview = await Review.findOne({
      productKey,
      userEmail: req.user.email,
    });

    if (existingReview) {
      return res.status(400).json({
        error: "You have already reviewed this product",
      });
    }

    const review = new Review({
      productKey,
      userEmail: req.user.email,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({
      message: "Review submitted successfully. Awaiting admin approval.",
      review,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
}

/**
 * PUBLIC: Get approved reviews for a product
 */
export async function getProductReviews(req, res) {
  try {
    const { productKey } = req.params;

    const reviews = await Review.find({
      productKey,
      isApproved: true,
    }).sort({ createdAt: -1 });

    let averageRating = 0;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      averageRating = (totalRating / reviews.length).toFixed(1);
    }

    res.json({
      averageRating: Number(averageRating),
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get reviews" });
  }
}


/**
 * ADMIN: Get all pending reviews
 */
export async function getPendingReviews(req, res) {
  try {
    if (!isItAdmin(req)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const reviews = await Review.find({ isApproved: false }).sort({
      createdAt: -1,
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to get pending reviews" });
  }
}

/**
 * ADMIN: Approve or reject a review
 */
export async function approveOrRejectReview(req, res) {
  try {
    if (!isItAdmin(req)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // ✅ Toggle approval
    review.isApproved = !review.isApproved;
    await review.save();

    // ✅ Recalculate product rating (always safe)
    const approvedReviews = await Review.find({
      productKey: review.productKey,
      isApproved: true,
    });

    let avgRating = 0;

    if (approvedReviews.length > 0) {
      avgRating =
        approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
        approvedReviews.length;
    }

    await Product.updateOne(
      { key: review.productKey },
      { rating: Number(avgRating.toFixed(1)) }
    );

    res.json({
      message: `Review ${
        review.isApproved ? "approved" : "rejected"
      } successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update review" });
  }
}
