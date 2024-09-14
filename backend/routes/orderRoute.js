import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  getUserOrders,
  verifyOrder,
} from "../controllers/orderController.js";
//============================================================

// Create a new Express router instance
const orderRouter = express.Router();

// Define routes
//-----------------------------------------------------------
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/userorders", authMiddleware, getUserOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;
