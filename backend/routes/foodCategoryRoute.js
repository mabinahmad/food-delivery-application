import express from "express";
import multer from "multer";
import {
  addFoodCategory,
  fetchFoodCategoryList,
} from "../controllers/foodCategoryController.js";
//======================================================

// Create a new Express router instance
const foodCategoryRouter = express.Router();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define routes
//------------------------------------------------------------------------
foodCategoryRouter.post("/add", upload.single("image"), addFoodCategory);
foodCategoryRouter.get("/list", fetchFoodCategoryList);

export default foodCategoryRouter;
