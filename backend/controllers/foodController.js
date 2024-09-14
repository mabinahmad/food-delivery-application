import foodModel from "../models/foodModel.js";
import cloudinary from "../utils/cloudinary.js";
//==================================================

// Function to add a food item
//-----------------------------------------------
const addFood = async (req, res) => {
  try {
    // Normalize the food name for case-insensitive comparison
    const normalizedName = req.body.name.trim().toLowerCase();

    // Check if a food item with the same name already exists
    const isFoodExist = await foodModel.findOne({
      name: new RegExp(`^${normalizedName}$`, "i"),
    });

    if (isFoodExist) {
      return res.status(400).json({
        message: "Food with this name already exists",
      });
    }

    // Convert the image buffer to a base64 string
    const base64String = req.file.buffer.toString("base64");

    const folderName = "Food_Delivery_App/Food_Images"; // Cloudinary folder name

    // Upload the image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(
      `data:${req.file.mimetype};base64,${base64String}`,
      {
        folder: folderName,
      }
    );

    // Create a new food item document
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: {
        publicId: result.public_id,
        secureUrl: result.secure_url,
      },
    });
 
    await food.save();
    res.json({
      success: true,
      message: "Food Added",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Function to list all food items
//----------------------------------------------
const listFood = async (req, res) => {
  try {
    // Retrieve all food items from the database
    const foods = await foodModel.find({});

    // Respond with the list of food items
    res.json({ success: true, data: foods });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Function to delete an image from Cloudinary
//=======================================================
const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    if (result.result === "ok") {
      return true; // Return true if deletion was successful
    } else {
      throw new Error("Failed to delete image from Cloudinary");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to remove a food item
//-------------------------------------------------------
const removeFood = async (req, res) => {
  try {
    // Find the food item by its ID
    const food = await foodModel.findById(req.body.id);
    const publicId = food.image.publicId;

    // Delete image from Cloudinary
    const deletedImage = await deleteImageFromCloudinary(publicId);

    if (!deletedImage) {
      return res
        .status(500)
        .json({ message: "Failed to delete image from Cloudinary" });
    }

    // Delete the food item from the database
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ sucess: true, message: "Food Removed" });
  } catch (error) {
 
    res.json({ success: false, message: "Error" });
  }
};

// Function to search for food items
//------------------------------------------------
const searchFood = async (req, res) => {
  const { query } = req.query;

  if (typeof query !== "string") {
    return res.status(400).json({ error: "We couldn't find any matches!" });
  }

  try {
    // Search for food items by name or category using regex
    const foods = await foodModel.find({
      $or: [
        { name: { $regex: new RegExp(query, "i") } },
        { category: { $regex: new RegExp(query, "i") } },
      ],
    });

    // Respond with the search results or a message if no items are found
    if (foods.length === 0) {
      return res.status(200).json({
        message: "No foods found matching the filter criteria",
        foods: [],
      });
    }

    res.status(200).json({ foods: foods });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { addFood, listFood, removeFood, searchFood };
