import express from 'express';
import {  cancelOrder, createOrder, getOrders, getQuote, isOrderComplete, updatePaymentStatus } from '../controllers/orderController.js';

const orderRouter = express.Router();

// Create a new order
orderRouter.post("/", createOrder);

// Get order quotation (before placing order)
orderRouter.post("/quote", getQuote);

// Get orders (customer → own orders, admin → all orders)
orderRouter.get("/", getOrders);

// Admin: update order status (Completed / Processing / etc.)
orderRouter.put("/status/:orderId", isOrderComplete);

// Admin: update payment status (isPaid: true/false)
orderRouter.put("/payment-status/:orderId", updatePaymentStatus);

// Customer: cancel own order
orderRouter.put("/cancel/:orderId", cancelOrder);

export default orderRouter;