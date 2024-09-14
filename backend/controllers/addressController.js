import addressModel from "../models/addressModel.js";
import userModel from "../models/userModel.js";
//=======================================================

// Function to add a new address for the user
//---------------------------------------------
const addAddress = async (req, res) => {
  const userId = req.userId; // Extract userId from the request
  try {
    // Extract address details from the request body
    const {
      firstName,
      lastName,
      phone,
      buildingNumber,
      street,
      streetNumber,
      zone,
      city,
    } = req.body;

    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Create a new address document
    const address = new addressModel({
      user: userId,
      firstName,
      lastName,
      phone,
      buildingNumber,
      street,
      streetNumber,
      zone,
      city,
      status: "active",
    });

    // Save the address document
    await address.save();

    // Add address to user's address list
    user.addresses.push(address._id);
    await user.save(); // Save the updated user document

    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Function to get all saved addresses for the user
//--------------------------------------------------
const getSavedAddresses = async (req, res) => {
  const userId = req.userId;
  try {
    // Find all addresses associated with the userId
    const addresses = await addressModel.find({
      user: userId,
      status: "active",
    });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAddressStatus = async (req, res) => {
  const addressId = req.body.addressId;
  const userId = req.userId;
  try {
    await addressModel.findByIdAndUpdate(
      addressId,
      {
        status: "inactive",
      },
      { new: true }
    );
    // Fetch updated list of addresses
    const addresses = await addressModel.find({
      user: userId,
      status: "active",
    });
    res.json({ success: true, message: "Address deleted", addresses });
  } catch (error) {}
};

//Function to get a specific address by its ID
//------------------------------------------------
const getOrderAddress = async (req, res) => {
  const { addressId } = req.query;

  try {
    const address = await addressModel.findById(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addAddress, getSavedAddresses, getOrderAddress, updateAddressStatus };
