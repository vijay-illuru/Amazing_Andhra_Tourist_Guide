import express from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import {
  createTour,
  deleteTour,
  getAllTour,
  getSingleTour,
  updateTour,
  getTourBySearch,
  getFeaturedTour,
  getTourCount
} from "../controllers/tourController.js";

const router = express.Router();

// Public routes
router.get("/search/getTourBySearch", getTourBySearch);
router.get("/search/getFeaturedTours", getFeaturedTour);
router.get("/search/getTourCount", getTourCount);
router.get("/", getAllTour);
router.get("/:id", getSingleTour);

// Admin routes
router.post("/", verifyAdmin, createTour);
router.put("/:id", verifyAdmin, updateTour);
router.delete("/:id", verifyAdmin, deleteTour);

export default router;
