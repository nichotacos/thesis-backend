import express from 'express';
import { addUserExp, fetchUsers, getWeeklyLeaderboard, storeUser } from "../controllers/UserController.js"

const router = express.Router();

router.get('/user', fetchUsers);
router.post('/user', storeUser);
router.post('/user/exp', addUserExp);
router.get('/weekly-leaderboard', getWeeklyLeaderboard);

export default router;  