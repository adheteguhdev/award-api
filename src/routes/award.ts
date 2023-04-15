import { Router } from "express";
import { createAward, getListAward, getAwardById, updateAwardById, deleteAwardById } from "../controllers/award";
import { authenticateToken } from "../middlewares/authenticate-token";
const router = Router();

router.post('/', authenticateToken, createAward);
router.get('/', authenticateToken, getListAward);
router.get('/:id', authenticateToken, getAwardById);
router.put('/:id', authenticateToken, updateAwardById);
router.delete('/:id', authenticateToken, deleteAwardById);

export = router;