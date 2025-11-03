import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  const tourId = req.params.tourId;
  
  try {
    // Validate tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }

    // Validate required fields
    const { username, reviewText, rating } = req.body;
    if (!username || !reviewText || rating === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: username, reviewText, and rating are required" 
      });
    }

    // Validate rating range
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating must be between 0 and 5" 
      });
    }

    const newReview = new Review({ 
      ...req.body,
      productId: tourId 
    });
    const savedReview = await newReview.save();

    // After creating a new review, update the reviews array of the tour
    await Tour.findByIdAndUpdate(tourId, {
      $push: { reviews: savedReview._id },
    });
    
    res.status(200).json({ 
      success: true, 
      message: "Review submitted", 
      data: savedReview 
    });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Failed to submit review" 
    });
  }
};
