import express from 'express';
import {
    addUserExp,
    fetchUsers,
    getWeeklyLeaderboard,
    storeUser,
    loseHeart,
    buyHeart,
    completeModule,
    addGems,
    claimDailyReward,
    buyShopItem,
    equipShopItem,
    updateUser
} from "../controllers/UserController.js"
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/user', fetchUsers);
router.post('/user', storeUser);
router.put('/user/update', updateUser);
router.post('/user/exp', addUserExp);
router.get('/weekly-leaderboard', getWeeklyLeaderboard);
router.post('/user/lose-heart', loseHeart);
router.post('/user/buy-heart', buyHeart);
router.post('/module/complete', completeModule);
router.post('/user/add-gems', addGems);
router.post('/user/claim-daily-reward', claimDailyReward);
router.post('/user/buy-shop-item', buyShopItem);
router.post('/user/equip-item', equipShopItem);

export default router;  