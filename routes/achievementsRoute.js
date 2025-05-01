import express from 'express';
import { getAchievements, createAchievement } from '../controllers/achievementController.js';

const router = express.Router();

router.get('/achievement', getAchievements);
router.post('/achievement', createAchievement);

export default router;