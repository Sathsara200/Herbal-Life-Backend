import express from 'express';
import { addReview, approveOrRejectReview, getPendingReviews, getProductReviews } from '../controllers/reveiwController.js';

const reviewRouter = express.Router();

reviewRouter.post("/", addReview);
reviewRouter.get("/pending/all", getPendingReviews);

reviewRouter.put("/status/:reviewId", approveOrRejectReview);
reviewRouter.get("/:productKey", getProductReviews);


export default reviewRouter;