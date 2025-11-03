import express from "express";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
  getUserProfile,
} from "../controllers/userController.js";
const router = express.Router();

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

// User profile - MUST come before /:id route
router.get("/profile/me", verifyUser, getUserProfile);

//get all users
router.get("/", verifyAdmin, getAllUser);

//update user
router.put("/:id", verifyUser, updateUser);

//delete new user
router.delete("/:id", verifyUser, deleteUser);

//get single user
router.get("/:id", verifyUser, getSingleUser);

export default router;
