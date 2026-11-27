import express from "express";

import {
    
    getHoroscopoBySign,
    getWeeklyHoroscopo,
    deleteHoroscopoById
} from "../controllers/horoscopoController.js";

import verifyToken from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();


router.get("/:sign/weekly", getWeeklyHoroscopo);

router.get("/:sign", getHoroscopoBySign);

router.delete("/:id", verifyToken, isAdmin, deleteHoroscopoById);

export default router;