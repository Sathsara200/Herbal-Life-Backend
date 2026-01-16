import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    key:{
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true,
        default : "uncategorized"
    },
    weight : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    availability : {
       type : Boolean,
       required : true,
       default : true 
    },
    rating : {
        type : Number,
        required : true,
        default : 0
    },
    image : {
        type : [String],
        required : true,
        default : ["https://img.icons8.com/?size=100&id=98957&format=png&color=000000"]
    }
})

const Product = mongoose.model("Product", productSchema);

export default Product;
