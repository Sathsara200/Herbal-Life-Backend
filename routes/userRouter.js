import express from "express";
import { blockOrUnblockUser, getAdminDashboardStats, getAllUsers, getUser, loginUser, registerUser, updateUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/all",getAllUsers)
userRouter.get("/",getUser)
userRouter.get("/dashboard",getAdminDashboardStats)

userRouter.put("/block/:email",blockOrUnblockUser)
userRouter.put("/:email", updateUser)


export default userRouter;