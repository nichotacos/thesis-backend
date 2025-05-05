import express from 'express';
import { getAchievements, createAchievement, grantAchievement } from '../controllers/achievementController.js';

const router = express.Router();

router.get('/achievement', getAchievements);
router.post('/achievement', createAchievement);
router.post('/achievement/grant', grantAchievement);

export default router;