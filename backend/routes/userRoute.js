import express from "express";
import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
//============================================================

// Create a new Express router instance
const userRouter = express.Router();

// Define routes
//-------------------------------------------
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/current-user", authMiddleware, getCurrentUser);

export default userRouter;
