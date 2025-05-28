import express from 'express';
import { createQuestions, getQuestions } from '../controllers/questionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/question', getQuestions);
router.post('/question/create', createQuestions);

export default router;