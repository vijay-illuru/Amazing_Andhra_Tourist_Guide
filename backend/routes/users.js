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

//update user
router.put("/:id", verifyUser, updateUser);

//delete new user
router.delete("/:id", verifyUser, deleteUser);

//get sing user
router.get("/:id", verifyUser, getSingleUser);

//get all users
router.get("/", verifyAdmin, getAllUser);

// User profile
router.get("/profile/me", verifyUser, getUserProfile);

export default router;
