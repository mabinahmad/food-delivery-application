import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
//============================================================

// Function to create a JWT token
//--------------------------------
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//Login user function
//------------------------------------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in the database by email
    const user = await userModel.findOne({ email });
    // If the user is not found, return an error message
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }
    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    // If password doesn't match, return an invalid credentials message
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    // If the user exists and the password matches, create a JWT token
    const token = createToken(user._id);

    // Return the token along with user details (excluding the password)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cartData: user.cartData,
      },
    });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Register user function
//---------------------------------------------------------
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check if the user with the given email already exists in the database
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    //validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    // Check if the password meets minimum length requirement (at least 4 characters)
    if (password.length < 3) {
      return res.json({
        success: false,
        message: "The password must be at least 4 characters long",
      });
    }

    // Hash the password before saving it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password and provided details
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Save the user in the database
    const user = await newUser.save();

    // Generate a token for the newly registered user
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Get current user function
//------------------------------------------------------------------
const getCurrentUser = async (req, res) => {
  try {
    // Find the user by their ID
    const user = await userModel.findById(req.userId).select("-password");
    // If the user exists, return user data
    if (user) {
      res.json({ success: true, data: user });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export { loginUser, registerUser, getCurrentUser };
