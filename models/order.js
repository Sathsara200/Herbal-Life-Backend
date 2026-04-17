import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    orderId : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true
    },
    orderDate : {
        type: Date,
        required: true,
        default: Date.now
    },
    shippingInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true }
    },
    orderedItems : {
        type : [
            {
                product : {
                    key : {
                        type : String,
                        required : true
                    },
                    name : {
                        type : String,
                        required : true
                    },
                    image : {
                        type : [String],
                        required : true
                    },
                    price : {
                        type : Number,
                        required : true
                    }
                },
                quantity : {
                    type : Number,
                    required : true
                }
            }
        ],
        required : true
    },
    totalAmount : {
        type : Number,
        required : true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentId: {
        type: String
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    isOrderComplete: {
        type: Boolean,
        required: true,
        default: false
    }
})

const Order = mongoose.model("Orderss",orderSchema);

export default Order;