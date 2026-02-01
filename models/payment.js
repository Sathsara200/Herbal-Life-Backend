import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  method: {
    type: String,
    enum: ["Card", "PayPal", "COD"],
    required: true
  },
  transactionId: String,
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Pending"
  },
  paidAt: Date
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
