import express from "express";

import multer from "multer";
import {
  addFood,
  listFood,
  removeFood,
  searchFood,
} from "../controllers/foodController.js";
//=====================================================

// Create router instance
const foodRouter = express.Router();

// Configure multer for handling file uploads
//-----------------------------------------------------
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define routes
//-----------------------------------------------------
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.get("/search", searchFood);

export default foodRouter;
