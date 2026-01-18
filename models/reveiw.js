import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productKey: {
      type: String,
      required: true,
      index: true
    },

    userEmail: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      required: true,
      trim: true
    },

    isApproved: {
      type: Boolean,
      default: false // admin approval
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
