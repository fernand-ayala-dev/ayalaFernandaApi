import express from "express";

import {
  getCompatibility,
  createCompatibility,
  updateCompatibility,
  deleteCompatibility
} from "../controllers/compatibilityController.js";

import verifyToken from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/:sign1/:sign2", getCompatibility);
router.post("/", verifyToken, isAdmin, createCompatibility);
router.put("/:id", verifyToken, isAdmin, updateCompatibility);
router.delete("/:id", verifyToken, isAdmin, deleteCompatibility);

export default router;