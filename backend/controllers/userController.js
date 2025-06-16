import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

//create new User
export const createUser = async (req, res) => {
  const newUser = new User(req.body);

  try {
    const savedUser = await newUser.save();

    res.status(200).json({
      success: true,
      message: "Successfully created",
      data: savedUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create. Try again" });
  }
};

//update User
export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updateUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update. Try again" });
  }
};

//delete User
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

//getSingle User
export const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      message: "Successfully found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

//getAll User
export const getAllUser = async (req, res) => {
  try {
    const users = await Tour.find({});

    res.status(200).json({
      success: true,
      message: "Successfully found",
      data: users,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

// Get user profile and bookings
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password -adminSecretKey");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Get bookings for this user
    const bookings = await Booking.find({ userId });
    // Get tour details for each booking
    const tours = await Promise.all(
      bookings.map(async (booking) => {
        const tour = await Tour.findOne({ title: booking.tourName });
        return tour ? { ...booking._doc, tour } : booking;
      })
    );
    res.status(200).json({
      success: true,
      user,
      bookings: tours,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};
