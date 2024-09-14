import express from "express";
import {
  addAddress,
  getOrderAddress,
  getSavedAddresses,
  updateAddressStatus,
} from "../controllers/addressController.js";
import authMiddleware from "../middleware/auth.js";
//=====================================================

// Create a new Express router instance
const addressRouter = express.Router();

// Define routes
//-----------------------------------------------------------------------
addressRouter.post("/add", authMiddleware, addAddress);
addressRouter.get("/saved-addresses", authMiddleware, getSavedAddresses);
addressRouter.get("/:addressId", getOrderAddress);
addressRouter.put(
  "/update-address-status",
  authMiddleware,
  updateAddressStatus
);

export default addressRouter;
