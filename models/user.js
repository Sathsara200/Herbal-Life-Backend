import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    isBlocked : {
        type : Boolean,
        required : true,
        default : false
    },
    role : {
        type : String,
        required : true,
        default : "customer"
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },    
    phone : {
        type : String,
        required : true
    },
    emailVerified : {
        type : Boolean,
        required : true,
        default : false
    },
    profilePicture : {
        type : String,
        required : true,
        default : "https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
    }
});

const User = mongoose.model("User",userSchema);

export default User;