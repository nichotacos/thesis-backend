import express from 'express';
import { getAchievements, createAchievement, grantAchievement } from '../controllers/achievementController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/achievement', getAchievements);
router.post('/achievement', upload.single('badge'), createAchievement);
router.post('/achievement/grant-achievement', grantAchievement);

export default router;