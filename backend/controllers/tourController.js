import Tour from "../models/Tour.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// ===========================
// Google Maps Geocoding Helper
// ===========================
const geocodeAddress = async (address) => {
  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    }
  );

  if (response.data.status === "OK") {
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  } else {
    throw new Error("Geocoding failed: " + response.data.status);
  }
};

// ===========================
// CREATE NEW TOUR
// ===========================
export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(200).json({ success: true, message: "Successfully created", data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create. Try again" });
  }
};

// ===========================
// UPDATE TOUR
// ===========================
export const updateTour = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedTour,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// ===========================
// DELETE TOUR
// ===========================
export const deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// ===========================
// GET SINGLE TOUR
// ===========================
export const getSingleTour = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id).populate("reviews");
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

// ===========================
// GET ALL TOURS (Paginated)
// ===========================
export const getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find({}).populate("reviews");
    res.status(200).json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

// ===========================
// SEARCH TOURS
// ===========================
export const getTourBySearch = async (req, res) => {
  const city = new RegExp(req.query.city, "i");
  const distance = parseInt(req.query.distance);
  const maxGroupSize = parseInt(req.query.maxGroupSize);

  try {
    const tours = await Tour.find({
      city,
      distance: { $gte: distance },
      maxGroupSize: { $gte: maxGroupSize },
    }).populate("reviews");

    res
      .status(200)
      .json({ success: true, message: "Successfully", data: tours });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

// ===========================
// FEATURED TOURS
// ===========================
export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true })
      .populate("reviews")
      .limit(8);
    res.status(200).json({ success: true, message: "Successful", data: tours });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

// ===========================
// GET TOUR COUNT
// ===========================
export const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();
    res.status(200).json({ success: true, data: tourCount });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch" });
  }
};
