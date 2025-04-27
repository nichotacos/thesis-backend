import express from 'express';
import { addUserExp, fetchUsers, storeUser } from "../controllers/UserController.js"

const router = express.Router();

router.get('/user', fetchUsers);
router.post('/user', storeUser);
router.post('/user/exp', addUserExp);

export default router;  