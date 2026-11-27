import express from 'express';
import {
    getSignById,
    getSigns,
    getSignByName,
   
    postSign,
    updateSignById,
    deleteSignById,
    
   
} from '../controllers/signsController.js';

import verifyToken from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";


const router = express.Router();
router.get('/', getSigns);
router.post('/', verifyToken, isAdmin, postSign);
router.get('/buscar/:name', getSignByName);
router.get('/:id',  getSignById);
router.put('/:id', verifyToken, isAdmin, updateSignById);
router.delete('/:id', verifyToken, isAdmin, deleteSignById);


export default router;
