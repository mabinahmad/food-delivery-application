import foodCategoryModel from "../models/foodCategoryModel.js";
import cloudinary from "../utils/cloudinary.js";
//=======================================================

// Function to add a food category
//-----------------------------------------
const addFoodCategory = async (req, res) => {
  try {
    const originalCategory = req.body.category.trim();

    // Normalize the category name by trimming whitespace and converting to lowercase
    const normalizedName = originalCategory.toLowerCase();

    // Check if a food category with the same name already exists
    const isFoodCategoryExist = await foodCategoryModel.findOne({
      category: new RegExp(`^${normalizedName}$`, "i"),
    });

    if (isFoodCategoryExist) {
      return res.status(400).json({
        message: "Food category with this name already exists",
      });
    }

    // Convert the image buffer to a base64 string
    const base64String = req.file.buffer.toString("base64");
    const folderName = "Food_Delivery_App/Food_Category_Images";

    // Upload the image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(
      `data:${req.file.mimetype};base64,${base64String}`,
      {
        folder: folderName,
        // use_filename: true,
      }
    );

    // Create a new food category document
    const foodCategory = new foodCategoryModel({
      category: originalCategory,
      image: {
        publicId: result.public_id,
        secureUrl: result.secure_url,
      },
    });

    console.log(foodCategory, "foooodcatgry");
    await foodCategory.save();

    res.json({
      success: true,
      message: "Food category added",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to fetch the list of food categories
//---------------------------------------------------------
const fetchFoodCategoryList = async (req, res) => {
  try {
    // Retrieve all food categories from the database
    const categoriesList = await foodCategoryModel.find();
    res.status(200).json(categoriesList);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export { addFoodCategory, fetchFoodCategoryList };
