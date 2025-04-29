import express from 'express';
import { addUserExp, fetchUsers, getWeeklyLeaderboard, storeUser, loseHeart, buyHeart, completeModule } from "../controllers/UserController.js"

const router = express.Router();

router.get('/user', fetchUsers);
router.post('/user', storeUser);
router.post('/user/exp', addUserExp);
router.get('/weekly-leaderboard', getWeeklyLeaderboard);
router.post('/user/lose-heart', loseHeart);
router.post('/user/buy-heart', buyHeart);
router.post('/module/complete', completeModule);

export default router;  