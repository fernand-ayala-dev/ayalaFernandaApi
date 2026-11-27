import express from "express";

import {
  getUsers,
  postUser,
  loginUser,
  getUserById,
  deleteUserById,
  updateUserById,
} from "../controllers/userController.js";

import verifyToken from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();


router.post("/", postUser);
router.post("/login" ,loginUser);

router.get("/", verifyToken, isAdmin, getUsers);
router.get("/:id", verifyToken , getUserById);
router.delete("/:id",verifyToken, isAdmin, deleteUserById);
router.put("/:id", verifyToken, updateUserById);

export default router;
