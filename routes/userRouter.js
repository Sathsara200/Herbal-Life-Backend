import express from "express";
import { blockOrUnblockUser, getAdminDashboardStats, getAllUsers, getUser, loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/all",getAllUsers)
userRouter.get("/",getUser)
userRouter.get("/dashboard",getAdminDashboardStats)

userRouter.get("/block/:email",blockOrUnblockUser)


export default userRouter;