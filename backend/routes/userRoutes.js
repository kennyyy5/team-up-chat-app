import express from "express"
import { registerUser, authUser, allUsers } from "../controllers/userControllers.js"
import { protect } from "../middleware/authMiddleware.js"
export const userRouter = express.Router()

userRouter.route("/").post(registerUser).get(protect,allUsers)
userRouter.post("/login", authUser)
