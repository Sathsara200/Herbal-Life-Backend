import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use((req,res,next)=>{
    let token = req.header
    ("Authorization")

    if (token!=null){
        token = token.replace("Bearer ","")

        jwt.verify(token, process.env.JWT_SECRET,
        (err,decoded)=>{
            if(!err){
                req.user = decoded;
            }
        });
    }
    next()

});

let mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl)

let connection = mongoose.connection;

connection.once("open",()=>{
    console.log("MongoDB database connection established successfully");
});

//api calls

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});