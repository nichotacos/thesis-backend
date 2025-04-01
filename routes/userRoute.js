import express from 'express';
import { fetchUsers, storeUser } from "../controllers/userController.js"

const router = express.Router();

router.get('/user', fetchUsers);
router.post('/user', storeUser);

export default router;  