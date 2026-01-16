import express from "express";
import { blockOrUnblockUser, getAllUsers, getUser, loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/all",getAllUsers)
userRouter.get("/",getUser)

userRouter.get("/block/:email",blockOrUnblockUser)


export default userRouter;