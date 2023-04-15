import { Router } from "express";
import { createUser, getListUser, getUserById, updateUserById, deleteUserById, signin } from "../controllers/user";
import { authenticateToken } from "../middlewares/authenticate-token";
const router = Router();

router.post('/', createUser);
router.get('/', authenticateToken, getListUser);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUserById);
router.delete('/:id', authenticateToken, deleteUserById);
router.post('/signin', signin);

export = router;