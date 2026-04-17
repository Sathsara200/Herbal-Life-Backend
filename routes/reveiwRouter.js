import express from 'express';
import { addReview, approveOrRejectReview, getAllReviews, getPendingReviews, getProductReviews, getApprovedReviews } from '../controllers/reveiwController.js';

const reviewRouter = express.Router();

reviewRouter.get("/", getAllReviews); // ADMIN
reviewRouter.post("/", addReview);
reviewRouter.get("/pending/all", getPendingReviews);
reviewRouter.get("/approved", getApprovedReviews); // PUBLIC - MUST be before :productKey

reviewRouter.put("/status/:reviewId", approveOrRejectReview);
reviewRouter.put("/:reviewId", approveOrRejectReview);
reviewRouter.get("/:productKey", getProductReviews);


export default reviewRouter;