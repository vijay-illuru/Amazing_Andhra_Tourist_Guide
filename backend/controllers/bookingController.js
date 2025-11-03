import Booking from "../models/Booking.js";

// create booking
export const createBooking = async (req, res) => {
  try {
    // Validate required fields
    const { fullName, phone, guestSize, tourName, bookAt } = req.body;
    if (!fullName || !phone || !guestSize || !tourName) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required booking fields" 
      });
    }
    
    const newBooking = new Booking({
      ...req.body,
      bookAt: bookAt ? new Date(bookAt) : new Date(), // Set current date if not provided
    });
    
    const savedBooking = await newBooking.save();
    res.status(200).json({
      success: true,
      message: "Your tour is booked",
      data: savedBooking,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "internal server error" 
    });
  }
};

// get single booking
export const getBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const book = await Booking.findById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({
      success: true,
      message: "Successful",
      data: book,
    });
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Failed to fetch booking" 
    });
  }
};

// get All booking
export const getAllBooking = async (req, res) => {
  try {
    const books = await Booking.find();
    res.status(200).json({
      success: true,
      message: "Successful",
      data: books,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};
