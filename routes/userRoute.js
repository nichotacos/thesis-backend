import express from 'express';
import { fetchUsers, storeUser } from "../controllers/UserController.js"

const router = express.Router();

router.get('/user', fetchUsers);
router.post('/user', storeUser);

export default router;  