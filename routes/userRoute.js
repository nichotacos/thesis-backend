import express from 'express';
import {
    addUserExp,
    fetchUsers,
    getWeeklyLeaderboard,
    loseHeart,
    buyHeart,
    completeModule,
    addGems,
    claimDailyReward,
    buyShopItem,
    equipShopItem,
    updateUser,
    updateUserProfilePicture
} from "../controllers/UserController.js"
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/user', fetchUsers);
router.put('/user/update', updateUser);
router.post('/user/update-profile-picture', upload.single("profilePicture"), updateUserProfilePicture);
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