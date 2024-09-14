import mongoose from "mongoose";

const foodCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
    image: {
      publicId: { type: String, required: true },
      secureUrl: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const foodCategoryModel =
  mongoose.models.foodCategory ||
  mongoose.model("foodCategory", foodCategorySchema);

export default foodCategoryModel;
